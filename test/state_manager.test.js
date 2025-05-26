const { loadProjectState, saveProjectState, updateProjectState, generateContinuityPrompt } = require('../scripts/state_manager');
const fs = require('fs');
const path = require('path');

jest.mock('fs'); // Mock the fs module

describe('State Manager', () => {
    const mockDefaultProjectPath = 'project-status.json';
    const mockCustomProjectPath = 'custom/path/project-status.json';
    let resolvedDefaultPath;
    let resolvedCustomPath;
    
    // Helper to create a default state structure
    const getDefaultState = () => ({
        projectInfo: { name: "Project", repository: "", lastUpdated: expect.any(String) },
        development: { currentFile: "", currentComponent: "", inProgress: { type: "feature", description: "", remainingTasks: [] } },
        components: { completed: [], inProgress: [], pending: [] },
        context: { lastThought: "", nextSteps: [], dependencies: [] },
        mcpTools: { lastUsed: { repl: null, artifacts: [], searchResults: [] }, cacheFiles: [], tempStorage: [] }
    });


    beforeEach(() => {
        // Reset mocks before each test
        fs.readFileSync.mockReset();
        fs.writeFileSync.mockReset();
        
        // Resolve paths based on CWD for consistent testing
        resolvedDefaultPath = path.resolve(mockDefaultProjectPath);
        resolvedCustomPath = path.resolve(mockCustomProjectPath);

        // Default mock implementation for readFileSync
        fs.readFileSync.mockImplementation((filePath) => {
            // console.log(`Mock fs.readFileSync called with: ${filePath}`); // For debugging tests
            // Allow specific tests to override this with mockReturnValueOnce
            const err = new Error(`ENOENT: no such file or directory, open '${filePath}'`);
            err.code = 'ENOENT';
            throw err;
        });
    });

    describe('loadProjectState', () => {
        it('should load and parse a JSON file if it exists (default path)', () => {
            const mockState = { projectInfo: { name: 'Test Project Loaded' } };
            fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockState));
            
            const state = loadProjectState(); // Test with default path
            
            expect(fs.readFileSync).toHaveBeenCalledWith(resolvedDefaultPath, { encoding: 'utf8' });
            expect(state).toEqual(mockState);
        });

        it('should load and parse a JSON file if it exists (custom path)', () => {
            const mockState = { projectInfo: { name: 'Test Project Custom Path' } };
            fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockState));
            
            const state = loadProjectState(mockCustomProjectPath);
            
            expect(fs.readFileSync).toHaveBeenCalledWith(resolvedCustomPath, { encoding: 'utf8' });
            expect(state).toEqual(mockState);
        });

        it('should return a default state if the file does not exist', () => {
            // fs.readFileSync will throw ENOENT by default from beforeEach
            const state = loadProjectState(mockCustomProjectPath);
            
            expect(fs.readFileSync).toHaveBeenCalledWith(resolvedCustomPath, { encoding: 'utf8' });
            const defaultState = getDefaultState();
            // lastUpdated is dynamic, so compare structure and key elements
            expect(state).toMatchObject({
                ...defaultState,
                projectInfo: { ...defaultState.projectInfo, name: 'Project' } // Ensure default name
            });
            expect(new Date(state.projectInfo.lastUpdated).toISOString()).toEqual(state.projectInfo.lastUpdated); // Validate date format
        });

        it('should return a default state if JSON.parse throws an error', () => {
            fs.readFileSync.mockReturnValueOnce('this is not json');
            
            const state = loadProjectState(mockCustomProjectPath);
            
            expect(fs.readFileSync).toHaveBeenCalledWith(resolvedCustomPath, { encoding: 'utf8' });
            const defaultState = getDefaultState();
            expect(state).toMatchObject({
                ...defaultState,
                projectInfo: { ...defaultState.projectInfo, name: 'Project' }
            });
        });
    });

    describe('saveProjectState', () => {
        it('should stringify the state, add lastUpdated, and call fs.writeFileSync (default path)', () => {
            const stateToSave = { projectInfo: { name: 'Test Save Default' } };
            const result = saveProjectState(stateToSave); // Default path
            
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
            const callArgs = fs.writeFileSync.mock.calls[0];
            expect(callArgs[0]).toBe(resolvedDefaultPath);
            
            const writtenData = JSON.parse(callArgs[1]);
            expect(writtenData.projectInfo.name).toBe('Test Save Default');
            expect(writtenData.projectInfo).toHaveProperty('lastUpdated');
            expect(new Date(writtenData.projectInfo.lastUpdated).toISOString()).toBe(writtenData.projectInfo.lastUpdated);
            
            expect(result.success).toBe(true);
            expect(result.message).toBe('Estado do projeto salvo com sucesso!');
        });

        it('should stringify the state and call fs.writeFileSync (custom path)', () => {
            const stateToSave = { projectInfo: { name: 'Test Save Custom' } };
            saveProjectState(stateToSave, mockCustomProjectPath);
            
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
            expect(fs.writeFileSync.mock.calls[0][0]).toBe(resolvedCustomPath);
            // Content check is similar to above, can be less specific if path is main focus
            expect(fs.writeFileSync.mock.calls[0][1]).toContain('"name": "Test Save Custom"');
        });

        it('should return success: false if fs.writeFileSync throws an error', () => {
            const stateToSave = { projectInfo: { name: 'Test Save Fail' } };
            const writeError = new Error('Disk full');
            fs.writeFileSync.mockImplementationOnce(() => {
                throw writeError;
            });
            
            const result = saveProjectState(stateToSave, mockCustomProjectPath);
            
            expect(fs.writeFileSync).toHaveBeenCalledWith(resolvedCustomPath, expect.any(String));
            expect(result.success).toBe(false);
            expect(result.error).toBe(writeError.message);
        });
    });

    describe('updateProjectState', () => {
        const initialMockState = { 
            projectInfo: { name: 'Initial Project', lastUpdated: new Date().toISOString() },
            development: { currentFile: 'initial.js' },
            context: { lastThought: 'Initial thought' }
        };

        it('should merge updates into an existing state and save', () => {
            fs.readFileSync.mockReturnValueOnce(JSON.stringify(initialMockState)); // For loadProjectState
            
            const updates = { development: { currentFile: 'updated.js' }, context: { lastThought: 'Updated thought' } };
            const result = updateProjectState(updates, mockCustomProjectPath);

            expect(fs.readFileSync).toHaveBeenCalledWith(resolvedCustomPath, { encoding: 'utf8' });
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
            
            const savedData = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
            expect(savedData.projectInfo.name).toBe('Initial Project'); // From initial state
            expect(savedData.development.currentFile).toBe('updated.js'); // Updated
            expect(savedData.context.lastThought).toBe('Updated thought'); // Updated
            expect(savedData.projectInfo).toHaveProperty('lastUpdated'); 
            // Ensure lastUpdated was updated by saveProjectState
            expect(new Date(savedData.projectInfo.lastUpdated).toISOString()).not.toBe(initialMockState.projectInfo.lastUpdated);


            expect(result.projectInfo.name).toBe('Initial Project');
            expect(result.development.currentFile).toBe('updated.js');
        });

        it('should use default state if no prior state file exists and save', () => {
            // fs.readFileSync will throw ENOENT by default
            const updates = { context: { lastThought: 'First thought on new project' } };
            const result = updateProjectState(updates, mockCustomProjectPath);

            expect(fs.readFileSync).toHaveBeenCalledWith(resolvedCustomPath, { encoding: 'utf8' }); // Attempted read
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1); // Save was called

            const savedData = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
            expect(savedData.projectInfo.name).toBe('Project'); // Default name
            expect(savedData.context.lastThought).toBe('First thought on new project'); // Updated
            
            expect(result.projectInfo.name).toBe('Project');
            expect(result.context.lastThought).toBe('First thought on new project');
        });

        it('should perform deep merging correctly', () => {
            const deepInitialState = {
                projectInfo: { name: 'Deep Project' },
                development: { inProgress: { type: 'task', description: 'Old task', remainingTasks: ['a', 'b'] } }
            };
            fs.readFileSync.mockReturnValueOnce(JSON.stringify(deepInitialState));

            const updates = { development: { inProgress: { description: 'New task description' } } };
            const result = updateProjectState(updates, mockCustomProjectPath);
            
            const savedData = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
            expect(savedData.development.inProgress.type).toBe('task'); // Preserved from initial
            expect(savedData.development.inProgress.description).toBe('New task description'); // Updated
            expect(savedData.development.inProgress.remainingTasks).toEqual(['a', 'b']); // Preserved array

            expect(result.development.inProgress.description).toBe('New task description');
        });
        
        it('should handle error during loadProjectState gracefully and return error object', () => {
            fs.readFileSync.mockImplementationOnce(() => { throw new Error('Simulated read error during update'); });
            
            const updates = { context: { lastThought: 'Update attempt' } };
            const result = updateProjectState(updates, mockCustomProjectPath);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Simulated read error during update');
            expect(result.details).toBe('Failed during update operation'); // Specific message from updateProjectState's catch
            expect(fs.writeFileSync).not.toHaveBeenCalled(); // Save should not be called
        });

        it('should handle error during saveProjectState gracefully and return error object', () => {
            fs.readFileSync.mockReturnValueOnce(JSON.stringify(initialMockState)); // Load succeeds
            fs.writeFileSync.mockImplementationOnce(() => { throw new Error('Simulated write error during update'); }); // Save fails

            const updates = { context: { lastThought: 'Update attempt' } };
            const result = updateProjectState(updates, mockCustomProjectPath);

            expect(result.success).toBe(false);
            expect(result.error).toContain('Simulated write error during update');
            expect(result.details).toBe('Failed during update operation');
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1); // Attempted write
        });
    });

    describe('generateContinuityPrompt', () => {
        const baseState = {
            projectInfo: { name: 'Prompt Test', repository: 'user/repo.git' },
            development: { 
                currentFile: 'src/main.js', 
                inProgress: { type: 'feature', description: 'Working on feature X' } 
            },
            context: { lastThought: 'Need to refactor module Y' }
        };

        it('should generate a prompt with typical state information', () => {
            const prompt = generateContinuityPrompt(baseState);
            expect(prompt).toContain('Working on: user/repo.git');
            expect(prompt).toContain('Context: Need to refactor module Y');
            expect(prompt).toContain('"name": "Prompt Test"');
            expect(prompt).toContain('"currentTask": "Working on feature X"');
            expect(prompt).toContain('"lastState": "Need to refactor module Y"');
            expect(prompt).toContain('"currentFile": "src/main.js"');
            expect(prompt).toContain('"inProgress": "feature: Working on feature X"');
        });

        it('should use development.inProgress.description for context if context.lastThought is missing', () => {
            const state = { ...baseState, context: { ...baseState.context, lastThought: null } };
            const prompt = generateContinuityPrompt(state);
            expect(prompt).toContain('Context: Working on feature X');
            expect(prompt).toContain('"lastState": null');
        });

        it('should use [CONTEXTO_ATUAL] if both context.lastThought and development.inProgress.description are missing', () => {
            const state = { 
                ...baseState, 
                context: { ...baseState.context, lastThought: null },
                development: { ...baseState.development, inProgress: { ...baseState.development.inProgress, description: null } }
            };
            const prompt = generateContinuityPrompt(state);
            expect(prompt).toContain('Context: [CONTEXTO_ATUAL]');
            expect(prompt).toContain('"currentTask": null');
            expect(prompt).toContain('"inProgress": "feature: null"'); // Type is still there
        });
        
        it('should handle missing development.inProgress gracefully', () => {
            const state = {
                projectInfo: { name: 'Prompt Test', repository: 'user/repo.git' },
                development: { currentFile: 'src/main.js', inProgress: null }, // inProgress is null
                context: { lastThought: 'A thought' }
            };
            const prompt = generateContinuityPrompt(state);
            expect(prompt).toContain('Context: A thought');
            expect(prompt).toContain('"currentTask": null');
            expect(prompt).toContain('"inProgress": null');
        });

        it('should use [REPOSITÓRIO] if projectInfo.repository is missing', () => {
            const state = { ...baseState, projectInfo: { ...baseState.projectInfo, repository: null } };
            const prompt = generateContinuityPrompt(state);
            expect(prompt).toContain('Working on: [REPOSITÓRIO]');
        });

        it('should return "Estado do projeto não disponível..." if projectInfo is missing', () => {
            const state = { ...baseState, projectInfo: null };
            const prompt = generateContinuityPrompt(state);
            expect(prompt).toBe('Estado do projeto não disponível. Carregue o estado primeiro.');
        });
        
        it('should return "Estado do projeto não disponível..." if state is null or undefined', () => {
            expect(generateContinuityPrompt(null)).toBe('Estado do projeto não disponível. Carregue o estado primeiro.');
            expect(generateContinuityPrompt(undefined)).toBe('Estado do projeto não disponível. Carregue o estado primeiro.');
        });
    });
});
