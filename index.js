#!/usr/bin/env node
const http = require('http');
const url = require('url');
const { loadProjectState, saveProjectState, updateProjectState, generateContinuityPrompt } = require('./scripts/state_manager');
const { initializeEnvironment } = require('./scripts/auto_setup.js');

// Port configuration
let cliPort;
const portArgIndex = process.argv.indexOf('--port');
const pArgIndex = process.argv.indexOf('-p');

if (portArgIndex > -1 && process.argv[portArgIndex + 1]) {
    const portValue = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(portValue) && portValue > 0 && portValue < 65536) {
        cliPort = portValue;
    } else {
        console.warn(`Invalid value for --port: ${process.argv[portArgIndex + 1]}.`);
    }
} else if (pArgIndex > -1 && process.argv[pArgIndex + 1]) {
    const portValue = parseInt(process.argv[pArgIndex + 1], 10);
    if (!isNaN(portValue) && portValue > 0 && portValue < 65536) {
        cliPort = portValue;
    } else {
        console.warn(`Invalid value for -p: ${process.argv[pArgIndex + 1]}.`);
    }
}

const DEFAULT_PORT = 3000;
let finalPort = DEFAULT_PORT;

if (process.env.PORT) {
    const envPort = parseInt(process.env.PORT, 10);
    if (!isNaN(envPort) && envPort > 0 && envPort < 65536) {
        finalPort = envPort;
    } else {
        console.warn(`Invalid process.env.PORT value: ${process.env.PORT}.`);
    }
} else if (cliPort) {
    finalPort = cliPort;
}

if (finalPort !== DEFAULT_PORT && (finalPort === cliPort || finalPort === parseInt(process.env.PORT,10)) ) {
    // Only log if the port was actually changed by env or cli
    console.log(`Attempting to use port: ${finalPort}`);
}


const PORT = finalPort; // Use this PORT variable for the server

// Helper function to send JSON responses
function sendJsonResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// Helper function to parse JSON body
function parseJsonBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const jsonData = JSON.parse(body);
            callback(null, jsonData);
        } catch (e) {
            callback(e, null);
        }
    });
    req.on('error', (err) => {
        callback(err, null);
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    console.log(`Received ${method} request for ${pathname}`);

    if (pathname === '/' && method === 'GET') {
        sendJsonResponse(res, 200, { message: 'MCP Server is running. Use specific endpoints to interact.' });
    } else if (pathname === '/initialize' && method === 'POST') {
        parseJsonBody(req, (err, data) => {
            if (err) {
                console.error("JSON parsing error:", err.message);
                sendJsonResponse(res, 400, { error: 'Invalid JSON body: ' + err.message });
                return;
            }
            try {
                const { repositoryUrl, workingDirectory = '' } = data;
                if (!repositoryUrl) {
                    sendJsonResponse(res, 400, { error: 'Missing required field: repositoryUrl' });
                    return;
                }
                const result = initializeEnvironment(repositoryUrl, workingDirectory);
                if (result && result.error) { // Check for error flag from initializeEnvironment
                    console.error("Error during initialization:", result.message);
                    sendJsonResponse(res, 500, { error: result.message || 'Error initializing environment.' });
                } else {
                    sendJsonResponse(res, 200, result);
                }
            } catch (e) {
                console.error("Error in /initialize:", e.message);
                sendJsonResponse(res, 500, { error: 'Internal Server Error: ' + e.message });
            }
        });
    } else if (pathname === '/state' && method === 'GET') {
        try {
            const projectPath = parsedUrl.query.projectPath || 'project-status.json';
            const state = loadProjectState(projectPath);
            sendJsonResponse(res, 200, state);
        } catch (e) {
            console.error("Error in GET /state:", e.message);
            sendJsonResponse(res, 500, { error: 'Internal Server Error: ' + e.message });
        }
    } else if (pathname === '/state' && method === 'POST') {
        parseJsonBody(req, (err, data) => {
            if (err) {
                console.error("JSON parsing error:", err.message);
                sendJsonResponse(res, 400, { error: 'Invalid JSON body: ' + err.message });
                return;
            }
            try {
                const { updates, projectPath = 'project-status.json' } = data;
                if (!updates) {
                    sendJsonResponse(res, 400, { error: 'Missing required field: updates' });
                    return;
                }
                const updatedState = updateProjectState(updates, projectPath);
                 if (updatedState && updatedState.success === false) {
                    console.error("Error updating state:", updatedState.error);
                    sendJsonResponse(res, 500, { error: updatedState.error || 'Error updating project state.' });
                } else {
                    sendJsonResponse(res, 200, updatedState);
                }
            } catch (e) {
                console.error("Error in POST /state:", e.message);
                sendJsonResponse(res, 500, { error: 'Internal Server Error: ' + e.message });
            }
        });
    } else if (pathname === '/continuity-prompt' && method === 'GET') {
        try {
            const projectPath = parsedUrl.query.projectPath || 'project-status.json';
            const state = loadProjectState(projectPath);
            // Check if loading state itself returned the default error object
            if (state && state.projectInfo && state.projectInfo.name === "Project" && Object.keys(state.development).length === 0) {
                 // This might indicate the file wasn't found and a default template was returned by loadProjectState
                 // Depending on desired behavior, you might want to signal this differently.
                 // For now, we proceed, and generateContinuityPrompt might return a message about unavailable state.
            }
            const prompt = generateContinuityPrompt(state);
            sendJsonResponse(res, 200, { prompt });
        } catch (e) {
            console.error("Error in /continuity-prompt:", e.message);
            sendJsonResponse(res, 500, { error: 'Internal Server Error: ' + e.message });
        }
    } else {
        sendJsonResponse(res, 404, { error: 'Not Found' });
    }
});

server.listen(PORT, () => {
    console.log(`MCP Server listening on port ${PORT}`);
});

// Basic startup message (already in original file, kept for consistency)
// This message might be redundant now or could be combined with the listener log.
// For now, I'll leave it as is.
console.log("MCP Continuity Tool server starting...");
