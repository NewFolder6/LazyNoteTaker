const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// Initialize server
const initServer = () => {
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
