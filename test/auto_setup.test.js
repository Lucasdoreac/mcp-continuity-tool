const fs = require('fs');
const path = require('path');
const { setupProjectState, analyzeRepository, initializeEnvironment } = require('../scripts/auto_setup');

// Mock fs module
jest.mock('fs');

// Mock state_manager module
jest.mock('../scripts/state_manager', () => ({
    loadProjectState: jest.fn(),
    saveProjectState: jest.fn(), // Though not directly called by auto_setup, it's part of the module
    generateContinuityPrompt: jest.fn(),
}));

// Import mocked functions from state_manager to use in tests if needed for assertions
const { loadProjectState, saveProjectState: mockedSaveProjectState, generateContinuityPrompt } = require('../scripts/state_manager');


describe('Auto Setup', () => {
    const MOCK_REPO_URL = 'user/test-repo.git';
    const MOCK_REPO_NAME = 'test-repo';
    const DEFAULT_PROJECT_STATUS_FILENAME = 'project-status.json';

    beforeEach(() => {
        // Reset all mocks before each test
        fs.readFileSync.mockReset();
        fs.writeFileSync.mockReset();
        fs.readdirSync.mockReset();
        fs.statSync.mockReset();
        fs.mkdirSync.mockReset();
        
        loadProjectState.mockReset();
        mockedSaveProjectState.mockReset(); // Reset our alias for the mocked saveProjectState
        generateContinuityPrompt.mockReset();

        // Default behavior for statSync (exists and is a file)
        fs.statSync.mockImplementation((filePath) => {
            // console.log(`Mock fs.statSync called for: ${filePath}`); // Debugging
            // Default to file not found, specific tests can override
            const err = new Error(`ENOENT: no such file or directory, stat '${filePath}'`);
            err.code = 'ENOENT';
            throw err;
        });
        
        // Default behavior for readdirSync (empty directory)
        fs.readdirSync.mockReturnValue([]);
    });

    describe('setupProjectState(repositoryUrl, workingDirectoryInput)', () => {
        it('should load existing state if project-status.json exists', () => {
            const mockExistingState = { projectInfo: { name: MOCK_REPO_NAME, repository: MOCK_REPO_URL } };
            loadProjectState.mockReturnValue(mockExistingState);
            
            const workingDir = 'existing_project';
            const resolvedWorkingDir = path.resolve(workingDir);
            const resolvedProjectStatusPath = path.join(resolvedWorkingDir, DEFAULT_PROJECT_STATUS_FILENAME);
            
            // Mock that workingDir exists
            fs.statSync.mockImplementation((p) => {
                 if (p === resolvedWorkingDir) return { isDirectory: () => true };
                 const err = new Error(`ENOENT: no such file or directory, stat '${p}'`);
                 err.code = 'ENOENT';
                 throw err;
            });

            const state = setupProjectState(MOCK_REPO_URL, workingDir);

            expect(loadProjectState).toHaveBeenCalledWith(resolvedProjectStatusPath);
            expect(fs.writeFileSync).not.toHaveBeenCalled(); // Should not create a new file
            expect(state).toEqual(mockExistingState);
        });

        it('should create new state if project-status.json does not exist', () => {
            loadProjectState.mockImplementation((p) => {
                // console.log(`loadProjectState mock called with ${p}, throwing ENOENT`); // Debug
                const err = new Error('File not found by loadProjectState mock');
                err.code = 'ENOENT'; // Simulate file not found behavior for loadProjectState
                throw err;
            });
            
            fs.readdirSync.mockReturnValue([ // Mock files in the directory
                { name: 'main.js', isFile: () => true, isDirectory: () => false },
                { name: 'README.md', isFile: () => true, isDirectory: () => false },
            ]);
            // Mock statSync for readdirSync's file check (if any, though not strictly needed by current auto_setup readdir logic)
            fs.statSync.mockImplementation((p) => {
                 if (p.endsWith('main.js') || p.endsWith('README.md')) return { isDirectory: () => false };
                 const err = new Error(`ENOENT stat for ${p}`);
                 err.code = 'ENOENT';
                 throw err;
            });


            const workingDir = 'new_project';
            const resolvedWorkingDir = path.resolve(workingDir);
            const resolvedProjectStatusPath = path.join(resolvedWorkingDir, DEFAULT_PROJECT_STATUS_FILENAME);
            
            // Mock that workingDir exists for the readdirSync call
            fs.statSync.mockImplementationOnce((p) => { // For the workingDir check itself
                 if (p === resolvedWorkingDir) return { isDirectory: () => true };
                 const err = new Error(`ENOENT: no such file or directory, stat '${p}'`);
                 err.code = 'ENOENT';
                 throw err;
            });


            const state = setupProjectState(MOCK_REPO_URL, workingDir);

            expect(loadProjectState).toHaveBeenCalledWith(resolvedProjectStatusPath);
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1); // For project-status.json
            
            const writtenPath = fs.writeFileSync.mock.calls[0][0];
            const writtenData = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
            
            expect(writtenPath).toBe(resolvedProjectStatusPath);
            expect(writtenData.projectInfo.name).toBe(MOCK_REPO_NAME);
            expect(writtenData.projectInfo.repository).toBe(MOCK_REPO_URL);
            expect(writtenData.projectInfo.workingDirectory).toBe(workingDir);
            expect(writtenData.development.currentFile).toBe('main.js'); // Based on readdirSync mock
            expect(state).toEqual(writtenData);
        });
        
        it('should create workingDirectoryInput if it does not exist, then create project-status.json', () => {
            loadProjectState.mockImplementation(() => { 
                const err = new Error('File not found by loadProjectState'); 
                err.code = 'ENOENT'; 
                throw err; 
            });
            fs.readdirSync.mockReturnValue([{ name: 'app.py', isFile: () => true, isDirectory: () => false }]);

            const newWorkingDir = 'non_existent_dir/project_src';
            const resolvedNewWorkingDir = path.resolve(newWorkingDir);
            const resolvedProjectStatusPath = path.join(resolvedNewWorkingDir, DEFAULT_PROJECT_STATUS_FILENAME);
            const resolvedGitkeepPath = path.join(resolvedNewWorkingDir, '.gitkeep');

            // Mock fs.statSync: first call for workingDir (not found), then for readdir (exists after creation)
            let statCallCount = 0;
            fs.statSync.mockImplementation((p) => {
                statCallCount++;
                if (statCallCount === 1 && p === resolvedNewWorkingDir) { // First call for the dir itself
                    const err = new Error(`ENOENT: no such file or directory, stat '${p}'`);
                    err.code = 'ENOENT';
                    throw err;
                }
                if (p === resolvedNewWorkingDir) { // Subsequent calls for the dir (e.g. by readdirSync)
                     return { isDirectory: () => true };
                }
                if (p.endsWith('app.py')) return {isDirectory: () => false};
                const err = new Error(`ENOENT for path ${p} in statSync mock`);
                err.code = 'ENOENT';
                throw err;
            });
            
            const state = setupProjectState(MOCK_REPO_URL, newWorkingDir);

            expect(fs.mkdirSync).toHaveBeenCalledWith(resolvedNewWorkingDir, { recursive: true });
            expect(fs.writeFileSync).toHaveBeenCalledWith(resolvedGitkeepPath, ''); // .gitkeep
            expect(fs.writeFileSync).toHaveBeenCalledWith(resolvedProjectStatusPath, expect.any(String)); // project-status.json
            
            const projectStatusWriteCall = fs.writeFileSync.mock.calls.find(call => call[0] === resolvedProjectStatusPath);
            const writtenData = JSON.parse(projectStatusWriteCall[1]);

            expect(writtenData.projectInfo.name).toBe(MOCK_REPO_NAME);
            expect(writtenData.projectInfo.workingDirectory).toBe(newWorkingDir);
            expect(writtenData.development.currentFile).toBe('app.py');
            expect(state).toEqual(writtenData);
        });

        it('should correctly extract repoName from various repositoryUrl formats', () => {
            loadProjectState.mockImplementation(() => { throw new Error('ENOENT'); }); // Ensure write path
            
            const urls = {
                'user/my-repo.git': 'my-repo',
                'https://github.com/user/another-repo.git': 'another-repo',
                'git@gitlab.com:user/project-x.git': 'project-x',
                'my-simple-repo': 'my-simple-repo' // No slashes
            };

            for (const url in urls) {
                fs.writeFileSync.mockClear(); // Clear from previous iterations
                const expectedName = urls[url];
                setupProjectState(url, ''); // No working dir, CWD is used for project-status.json
                
                // Check the name in the written project-status.json
                // The first argument to the first call to writeFileSync
                const writtenData = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
                expect(writtenData.projectInfo.name).toBe(expectedName);
            }
        });
        
        it('should use process.cwd() if workingDirectoryInput is empty or null', () => {
            loadProjectState.mockImplementation(() => { throw new Error('ENOENT'); });
            
            const cwd = process.cwd();
            const resolvedProjectStatusPath = path.join(cwd, DEFAULT_PROJECT_STATUS_FILENAME);

            setupProjectState(MOCK_REPO_URL, ''); // Empty working directory
            expect(fs.writeFileSync).toHaveBeenCalledWith(resolvedProjectStatusPath, expect.any(String));
            
            fs.writeFileSync.mockClear();
            
            setupProjectState(MOCK_REPO_URL, null); // Null working directory
            expect(fs.writeFileSync).toHaveBeenCalledWith(resolvedProjectStatusPath, expect.any(String));
        });
    });

    describe('analyzeRepository(workingDirectoryInput)', () => {
        it('should correctly categorize files and directories', () => {
            const workingDir = 'project_root';
            const resolvedWorkingDir = path.resolve(workingDir);
            fs.readdirSync.mockReturnValue([
                { name: 'index.js', isFile: () => true, isDirectory: () => false },
                { name: 'style.css', isFile: () => true, isDirectory: () => false },
                { name: 'package.json', isFile: () => true, isDirectory: () => false },
                { name: 'README.md', isFile: () => true, isDirectory: () => false },
                { name: 'src', isFile: () => false, isDirectory: () => true },
                { name: 'image.png', isFile: () => true, isDirectory: () => false }, // Not explicitly categorized
                { name: 'project-status.json', isFile: () => true, isDirectory: () => false }, // Should be ignored in config count
            ]);
            // Mock statSync for the workingDir itself if analyzeRepository calls it (it doesn't currently)
            // fs.statSync.mockReturnValueOnce({ isDirectory: () => true });

            const analysis = analyzeRepository(workingDir);

            expect(fs.readdirSync).toHaveBeenCalledWith(resolvedWorkingDir, { withFileTypes: true });
            expect(analysis.fileCount).toBe(5); // index.js, style.css, package.json, README.md, image.png (project-status.json is filtered)
            expect(analysis.categories.code).toEqual(['index.js']);
            expect(analysis.categories.web).toEqual(['style.css']);
            expect(analysis.categories.config).toEqual(['package.json']); // project-status.json is excluded
            expect(analysis.categories.docs).toEqual(['README.md']);
            expect(analysis.categories.dirs).toEqual(['src']);
            expect(analysis.analyzedDirectory).toBe(resolvedWorkingDir);
        });

        it('should handle an empty directory', () => {
            fs.readdirSync.mockReturnValue([]); // Empty directory
            const analysis = analyzeRepository('empty_dir');
            expect(analysis.fileCount).toBe(0);
            expect(analysis.categories.code).toEqual([]);
            expect(analysis.categories.dirs).toEqual([]);
        });

        it('should return default structure on fs.readdirSync error', () => {
            fs.readdirSync.mockImplementationOnce(() => { throw new Error('Read dir failed'); });
            const analysis = analyzeRepository('error_dir');
            expect(analysis.fileCount).toBe(0);
            expect(Object.values(analysis.categories).every(arr => arr.length === 0)).toBe(true);
            expect(analysis.error).toBeUndefined(); // As per current implementation, it logs error but returns default
        });
    });

    describe('initializeEnvironment(repositoryUrl, workingDirectoryInput)', () => {
        const mockProjectState = { projectInfo: { name: MOCK_REPO_NAME }, development: {}, context: {} };
        const mockRepoAnalysis = { fileCount: 5, categories: {} };
        const mockContinuityPrompt = "This is a mock prompt.";

        beforeEach(() => {
            // Mock the functions called by initializeEnvironment
            // setupProjectState is part of the module under test, so we can let its actual logic run
            // but ensure its dependencies (loadProjectState, fs calls) are mocked appropriately.
            loadProjectState.mockImplementation(() => { throw new Error('ENOENT for setup in initialize'); }); // Default for setupProjectState to create new
            generateContinuityPrompt.mockReturnValue(mockContinuityPrompt);
            
            // Mock analyzeRepository's dependencies
            fs.readdirSync.mockImplementation((dirPath) => {
                // console.log(`readdirSync mock for analyzeRepository, path: ${dirPath}`); // Debug
                if (path.resolve(dirPath) === path.resolve('') || path.resolve(dirPath) === path.resolve('test_dir')) {
                    return [{ name: 'mockFile.js', isFile: () => true, isDirectory: () => false }];
                }
                return [];
            });
        });
        
        it('should call setupProjectState, analyzeRepository, and generateContinuityPrompt', () => {
            const result = initializeEnvironment(MOCK_REPO_URL, 'test_dir');
            
            // Check if setupProjectState was effectively run (e.g. by its fs.writeFileSync call)
            expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining(DEFAULT_PROJECT_STATUS_FILENAME), expect.any(String));
            
            // Check analyzeRepository was effectively run
            expect(fs.readdirSync).toHaveBeenCalledWith(path.resolve('test_dir'), { withFileTypes: true });
            
            // Check generateContinuityPrompt
            expect(generateContinuityPrompt).toHaveBeenCalled();
            
            expect(result.projectState).toBeDefined();
            expect(result.projectState.projectInfo.name).toBe(MOCK_REPO_NAME); // From the new state created by setupProjectState
            expect(result.repoAnalysis).toBeDefined();
            expect(result.repoAnalysis.fileCount).toBe(1); // From readdirSync mock for analyzeRepository
            expect(result.continuityPrompt).toBe(mockContinuityPrompt);
            expect(result.error).toBeUndefined();
        });

        it('should return an error object if setupProjectState fails internally (e.g. fs.writeFileSync fails)', () => {
            // Make setupProjectState fail by making its fs.writeFileSync fail
            fs.writeFileSync.mockImplementationOnce(() => { throw new Error('Failed to write project-status.json'); });

            const result = initializeEnvironment(MOCK_REPO_URL, 'fail_dir');
            
            expect(result.error).toBe(true);
            expect(result.message).toContain('Failed to write project-status.json');
            expect(result.projectState).toBeNull();
        });
        
        it('should return an error object if analyzeRepository fails', () => {
            // Mock setupProjectState to succeed (by ensuring its fs.writeFileSync doesn't throw)
            // And then make analyzeRepository fail
            fs.writeFileSync.mockImplementation((p,c) => { /* console.log(`Mock write OK for ${p}`); */ }); // Allow setupProjectState's write to "succeed"
            fs.readdirSync.mockImplementationOnce(() => { throw new Error('analyzeRepository failed'); });

            const result = initializeEnvironment(MOCK_REPO_URL, 'fail_analysis_dir');
            
            expect(result.error).toBe(true);
            expect(result.message).toContain('analyzeRepository failed');
            expect(result.repoAnalysis).toBeNull();
            // projectState might exist if setupProjectState completed before analyzeRepository failed.
            // This depends on exact internal error handling of initializeEnvironment.
            // Current initializeEnvironment catches and returns specific error object.
        });
    });
});
