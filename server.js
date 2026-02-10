import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import { join } from 'node:path';

const app = express();
const bare = createBareServer('/bare/');
const server = createServer();

app.use('/uv/', express.static(uvPath));
app.use(express.static(join(process.cwd(), './')));

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) bare.routeRequest(req, res);
    else app(req, res);
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) bare.routeUpgrade(req, socket, head);
    else socket.end();
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`CatHappy running on ${PORT}`));