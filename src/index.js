const { initServer, startServer } = require('./server');

// Initialize the server
const server = initServer();

// Start the server
startServer(server, 3000);
