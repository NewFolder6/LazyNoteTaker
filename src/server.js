const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const googleAuth = require('./services/googleAuth');

// Simple in-memory token store (not production ready)
const tokenStore = new Map();

// Initialize server
const initServer = () => {
    // Serve static assets (CSS, JS)
    fastify.get('/assets/*', (request, reply) => {
        const filePath = path.join(__dirname, '..', 'public', request.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reply.code(404).send('File not found');
            } else {
                // Set content type based on file extension
                const ext = path.extname(filePath).toLowerCase();
                const contentType = {
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json'
                }[ext] || 'text/plain';
                
                reply.type(contentType).send(data);
            }
        });
    });

    // Serve default index.html
    fastify.get('/', (request, reply) => {
        const filePath = path.join(__dirname, '..', 'public', 'index.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reply.code(500).send('Error loading index.html');
            } else {
                reply.type('text/html').send(data);
            }
        });
    });

    // Google Auth routes
    fastify.get('/auth/google', (request, reply) => {
        const authUrl = googleAuth.getAuthUrl();
        reply.redirect(authUrl);
    });

    fastify.get('/auth/google/callback', async (request, reply) => {
        try {
            const { code } = request.query;
            const tokens = await googleAuth.getTokens(code);
            
            // Generate a simple token ID
            const tokenId = Date.now().toString();
            tokenStore.set(tokenId, tokens);
            
            // Redirect back to main page with token ID
            reply.redirect(`/?token=${tokenId}`);
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send('Authentication failed');
        }
    });

    // Google Docs API routes
    fastify.get('/api/docs', async (request, reply) => {
        try {
            const { token } = request.query;
            if (!token || !tokenStore.has(token)) {
                reply.code(401).send({ error: 'Not authenticated' });
                return;
            }
            
            const tokens = tokenStore.get(token);
            const authClient = googleAuth.setCredentials(tokens);
            const docs = await googleAuth.listDocs(authClient);
            reply.send({ docs });
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({ error: 'Failed to fetch documents' });
        }
    });

    fastify.get('/api/docs/:id', async (request, reply) => {
        try {
            const { token } = request.query;
            if (!token || !tokenStore.has(token)) {
                reply.code(401).send({ error: 'Not authenticated' });
                return;
            }
            
            const { id } = request.params;
            const tokens = tokenStore.get(token);
            const authClient = googleAuth.setCredentials(tokens);
            const docContent = await googleAuth.getDocContent(authClient, id);
            reply.send(docContent);
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({ error: 'Failed to fetch document content' });
        }
    });

    // Route for voice-to-text conversion
    fastify.post('/voice-to-text', async (request, reply) => {
        // ...code to handle voice-to-text conversion...
        reply.send('Voice-to-text conversion result');
    });

    // Route for automatic summarization
    fastify.post('/summarize', async (request, reply) => {
        // ...code to handle summarization...
        reply.send('Summarization result');
    });

    // Route for organizing notes
    fastify.post('/organize', async (request, reply) => {
        // ...code to handle organization...
        reply.send('Organization result');
    });

    return fastify;
};

// Start the server
const startServer = async (server, port = 3000) => {
    try {
        await server.listen({ port, host: '127.0.0.1' });
        server.log.info(`Server listening on ${server.server.address().port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

module.exports = {
    initServer,
    startServer
};
