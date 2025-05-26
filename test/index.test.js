const http = require('http');
const { Readable } = require('stream'); // For mocking request body stream

// Mock dependent modules
jest.mock('../scripts/state_manager');
jest.mock('../scripts/auto_setup');

// Mock http.createServer
const mockListen = jest.fn();
const mockClose = jest.fn(callback => { if (callback) callback(); }); // Mock server.close
const mockServer = { 
    listen: mockListen,
    close: mockClose, // Add close mock
};
let requestHandler; // To store the handler function passed to createServer

// We need to capture the request handler passed to http.createServer
// The actual server module ('../index.js') will call createServer when it's required.
jest.mock('http', () => ({
    ...jest.requireActual('http'), // Import and retain default behavior if needed for other parts
    createServer: jest.fn(handler => {
        requestHandler = handler; // Capture the handler
        return mockServer;
    }),
}));

// Import functions from mocked modules to set up their behavior
const { loadProjectState, updateProjectState, generateContinuityPrompt } = require('../scripts/state_manager');
const { initializeEnvironment } = require('../scripts/auto_setup');

describe('MCP Server (index.js)', () => {
    let mockReq;
    let mockRes;
    let originalArgv;
    let serverInstance; // To hold the server instance from index.js for closing

    beforeAll(() => {
        originalArgv = [...process.argv]; // Store original argv
        // Require the server module AFTER mocks are set up.
        // This will execute index.js, calling our mocked http.createServer.
        serverInstance = require('../index.js'); // serverInstance will be the module exports if any, or the server itself
    });
    
    afterAll(() => {
        process.argv = originalArgv; // Restore original argv
        // Ensure server is closed if it was started by index.js
        if (serverInstance && serverInstance.close) { // index.js doesn't export server, http.mockServer handles it
             mockServer.close(); // Use the mockServer's close
        }
    });


    beforeEach(() => {
        // Reset mocks for service functions and response methods
        loadProjectState.mockReset();
        updateProjectState.mockReset();
        generateContinuityPrompt.mockReset();
        initializeEnvironment.mockReset();
        mockListen.mockClear();
        mockClose.mockClear(); // Clear close mock calls

        // Basic mock response object
        mockRes = {
            writeHead: jest.fn(),
            end: jest.fn(),
            on: jest.fn(), // For parseJsonBody if it uses req.on for errors
        };
        
        // Reset process.argv to a default state for port parsing tests if needed
        process.argv = [...originalArgv.slice(0, 2)]; // node executable and script name
    });

    // Test for server listening
    it('should start the server and listen on the configured PORT (default 3000 if no args/env)', () => {
        expect(http.createServer).toHaveBeenCalled();
        expect(mockListen).toHaveBeenCalled();
        // We can also check the port if needed, but it depends on how PORT is resolved in index.js
        // For now, just checking if listen was called is enough.
        // The first argument to the first call to listen
        const listenCallArgs = mockListen.mock.calls[0];
        const usedPort = listenCallArgs[0];
        expect(typeof usedPort).toBe('number'); // Should be a number
    });

    describe('GET /', () => {
        it('should return a welcome message', () => {
            mockReq = { method: 'GET', url: '/' };
            requestHandler(mockReq, mockRes); // Invoke the handler
            expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ message: 'MCP Server is running. Use specific endpoints to interact.' }));
        });
    });

    describe('POST /initialize', () => {
        const mockRepoUrl = 'user/repo';
        const mockRequestBody = { repositoryUrl: mockRepoUrl, workingDirectory: 'src' };

        it('should call initializeEnvironment and return 200 on success', () => {
            const mockResult = { success: true, data: 'initialized' };
            initializeEnvironment.mockReturnValue(mockResult);

            mockReq = {
                method: 'POST',
                url: '/initialize',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify(mockRequestBody)));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);

            expect(initializeEnvironment).toHaveBeenCalledWith(mockRepoUrl, 'src');
            expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });

        it('should return 400 if repositoryUrl is missing', () => {
            mockReq = {
                method: 'POST',
                url: '/initialize',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify({ workingDirectory: 'src' }))); // Missing repositoryUrl
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(mockRes.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Missing required field: repositoryUrl' }));
        });
        
        it('should return 400 for invalid JSON in request body', () => {
            mockReq = {
                method: 'POST',
                url: '/initialize',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from('this is not json'));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(mockRes.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(expect.stringContaining('Invalid JSON body:'));
        });

        it('should return 500 if initializeEnvironment returns an error object', () => {
            const errorResult = { error: true, message: 'Initialization failed badly' };
            initializeEnvironment.mockReturnValue(errorResult);
            mockReq = {
                method: 'POST',
                url: '/initialize',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify(mockRequestBody)));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(initializeEnvironment).toHaveBeenCalledWith(mockRepoUrl, 'src');
            expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Initialization failed badly' }));
        });
        
        it('should return 500 if initializeEnvironment throws an exception', () => {
            initializeEnvironment.mockImplementation(() => { throw new Error('Critical failure'); });
             mockReq = {
                method: 'POST',
                url: '/initialize',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify(mockRequestBody)));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(initializeEnvironment).toHaveBeenCalledWith(mockRepoUrl, 'src');
            expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Internal Server Error: Critical failure' }));
        });
    });

    describe('GET /state', () => {
        it('should call loadProjectState and return 200 with state', () => {
            const mockState = { project: 'test' };
            const projectPath = 'custom/project-status.json';
            loadProjectState.mockReturnValue(mockState);
            
            mockReq = { method: 'GET', url: `/state?projectPath=${encodeURIComponent(projectPath)}` };
            requestHandler(mockReq, mockRes);
            
            expect(loadProjectState).toHaveBeenCalledWith(projectPath);
            expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(mockState));
        });
        
        it('should use default projectPath if not provided', () => {
            const mockState = { project: 'default' };
            loadProjectState.mockReturnValue(mockState);
            
            mockReq = { method: 'GET', url: '/state' };
            requestHandler(mockReq, mockRes);
            
            expect(loadProjectState).toHaveBeenCalledWith('project-status.json');
            expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(mockState));
        });

        it('should return 500 if loadProjectState throws an error', () => {
            loadProjectState.mockImplementation(() => { throw new Error('Failed to load'); });
            mockReq = { method: 'GET', url: '/state' };
            requestHandler(mockReq, mockRes);
            
            expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Internal Server Error: Failed to load' }));
        });
    });

    describe('POST /state', () => {
        const mockUpdates = { newField: 'newValue' };
        const projectPath = 'custom/project-status.json';
        const mockRequestBody = { updates: mockUpdates, projectPath: projectPath };

        it('should call updateProjectState and return 200 with updated state', () => {
            const mockUpdatedStateResult = { success: true, data: 'updated state' };
            updateProjectState.mockReturnValue(mockUpdatedStateResult);

            mockReq = {
                method: 'POST',
                url: '/state',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify(mockRequestBody)));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);

            expect(updateProjectState).toHaveBeenCalledWith(mockUpdates, projectPath);
            expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(mockUpdatedStateResult));
        });
        
        it('should use default projectPath if not provided in body', () => {
            const mockUpdatedStateResult = { success: true, data: 'updated state' };
            updateProjectState.mockReturnValue(mockUpdatedStateResult);
            const requestBodyNoPath = { updates: mockUpdates };

            mockReq = {
                method: 'POST',
                url: '/state',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify(requestBodyNoPath)));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);

            expect(updateProjectState).toHaveBeenCalledWith(mockUpdates, 'project-status.json');
        });

        it('should return 400 if updates field is missing', () => {
            mockReq = {
                method: 'POST',
                url: '/state',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify({ projectPath: projectPath }))); // Missing updates
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(mockRes.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Missing required field: updates' }));
        });
        
        it('should return 400 for invalid JSON in request body', () => {
            mockReq = {
                method: 'POST',
                url: '/state',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from('not valid json'));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(mockRes.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(expect.stringContaining('Invalid JSON body:'));
        });

        it('should return 500 if updateProjectState returns an error object', () => {
            const errorResult = { success: false, error: 'Update failed badly' };
            updateProjectState.mockReturnValue(errorResult);
            mockReq = {
                method: 'POST',
                url: '/state',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify(mockRequestBody)));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Update failed badly' }));
        });
        
        it('should return 500 if updateProjectState throws an exception', () => {
            updateProjectState.mockImplementation(() => { throw new Error('Critical update failure'); });
             mockReq = {
                method: 'POST',
                url: '/state',
                on: (event, callback) => {
                    if (event === 'data') callback(Buffer.from(JSON.stringify(mockRequestBody)));
                    if (event === 'end') callback();
                }
            };
            requestHandler(mockReq, mockRes);
            expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Internal Server Error: Critical update failure' }));
        });
    });

    describe('GET /continuity-prompt', () => {
        const mockState = { projectInfo: { name: 'Test' } };
        const mockPrompt = 'This is the continuity prompt.';
        const projectPath = 'custom/path/status.json';

        it('should load state, generate prompt, and return 200', () => {
            loadProjectState.mockReturnValue(mockState);
            generateContinuityPrompt.mockReturnValue(mockPrompt);
            
            mockReq = { method: 'GET', url: `/continuity-prompt?projectPath=${encodeURIComponent(projectPath)}` };
            requestHandler(mockReq, mockRes);
            
            expect(loadProjectState).toHaveBeenCalledWith(projectPath);
            expect(generateContinuityPrompt).toHaveBeenCalledWith(mockState);
            expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ prompt: mockPrompt }));
        });
        
        it('should use default projectPath if not provided', () => {
            loadProjectState.mockReturnValue(mockState);
            generateContinuityPrompt.mockReturnValue(mockPrompt);
            
            mockReq = { method: 'GET', url: '/continuity-prompt' };
            requestHandler(mockReq, mockRes);
            
            expect(loadProjectState).toHaveBeenCalledWith('project-status.json');
        });

        it('should return 500 if loadProjectState throws', () => {
            loadProjectState.mockImplementation(() => { throw new Error('Load failed for prompt'); });
            mockReq = { method: 'GET', url: '/continuity-prompt' };
            requestHandler(mockReq, mockRes);
            
            expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Internal Server Error: Load failed for prompt' }));
            expect(generateContinuityPrompt).not.toHaveBeenCalled();
        });
        
        it('should return 500 if generateContinuityPrompt throws', () => {
            loadProjectState.mockReturnValue(mockState); // Load succeeds
            generateContinuityPrompt.mockImplementation(() => { throw new Error('Prompt generation failed'); });
            mockReq = { method: 'GET', url: '/continuity-prompt' };
            requestHandler(mockReq, mockRes);
            
            expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Internal Server Error: Prompt generation failed' }));
        });
    });

    describe('Unknown route', () => {
        it('should return 404', () => {
            mockReq = { method: 'GET', url: '/unknown-route' };
            requestHandler(mockReq, mockRes);
            expect(mockRes.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Not Found' }));
        });
    });

    // Test for port parsing (demonstrative - requires specific setup for index.js re-evaluation)
    describe('Port Configuration', () => {
        // This test is a bit more complex because index.js parses port on load.
        // We need to reset modules and re-require index.js with new process.argv
        // or inspect the arguments passed to mockListen.

        it('should use port from --port argument if provided', () => {
            jest.resetModules(); // Important to re-evaluate index.js
            process.argv = [...originalArgv.slice(0, 2), '--port', '4000'];
            
            // Re-mock http for this specific test context if needed, or ensure global mock handles it
            const localMockListen = jest.fn();
            const localMockServer = { listen: localMockListen, close: jest.fn(cb => cb && cb()) };
            jest.mock('http', () => ({
                 ...jest.requireActual('http'),
                 createServer: jest.fn(() => localMockServer),
            }));

            require('../index.js'); // Re-require to parse new argv
            
            expect(localMockListen).toHaveBeenCalledWith(4000, expect.any(Function));
            process.argv = originalArgv; // Restore argv
            jest.unmock('http'); // Unmock to not affect other tests, or restore original mock
            // Re-establish global mock for http for other tests if unmocked
             jest.mock('http', () => ({
                ...jest.requireActual('http'),
                createServer: jest.fn(handler => {
                    requestHandler = handler; 
                    return mockServer; // mockServer is the global one
                }),
            }));
        });
    });
});
