import express from 'express';
import http from 'http';
import { setupApi, setupDB } from './setup.js';
import { setupSocket } from './src/socket/socket.js';

const app = express();
const server = http.createServer(app);

setupApi(app);
setupSocket(server);
await setupDB();

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
