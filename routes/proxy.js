const express = require('express');
const httpProxy = require('http-proxy');
const axios = require('axios');
const router = express.Router();

// Create proxy instance
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  followRedirects: true
});

// Proxy error handler
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(502).json({ 
    error: 'Bad Gateway',
    message: 'Failed to proxy request'
  });
});

/**
 * Browser-based game proxy
 * Usage: /proxy/browser?url=https://example.com/game
 */
router.get('/browser', (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Forward the request
    proxy.web(req, res, { target: url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Direct content proxy (for APIs and resources)
 * Usage: /proxy/content?url=https://api.example.com/endpoint
 */
router.get('/content', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (err) {
    console.error('Content proxy error:', err.message);
    res.status(502).json({ error: 'Failed to fetch content' });
  }
});

/**
 * WebSocket proxy for real-time games
 * Usage: /proxy/ws?url=wss://game-server.com/socket
 */
router.get('/ws', (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  // This would need WebSocket upgrade handling
  // Implementation depends on your specific game requirements
  res.json({ 
    message: 'WebSocket proxy endpoint',
    note: 'WebSocket upgrade requires separate handling'
  });
});

/**
 * Client-based game launcher
 * Usage: /proxy/client?game=minecraft&action=launch
 */
router.post('/client', (req, res) => {
  try {
    const { game, action, params } = req.body;

    if (!game || !action) {
      return res.status(400).json({ error: 'game and action parameters required' });
    }

    // Game launch configuration
    const gameConfig = {
      minecraft: {
        launcher: 'java',
        args: ['-jar', 'launcher.jar'],
        env: process.env
      },
      roblox: {
        launcher: 'RobloxPlayer.exe',
        args: [],
        env: process.env
      },
      steam: {
        launcher: 'steam',
        args: ['-applaunch'],
        env: process.env
      }
    };

    if (!gameConfig[game]) {
      return res.status(404).json({ error: `Game ${game} not found` });
    }

    res.json({
      status: 'success',
      game,
      action,
      config: gameConfig[game],
      params
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Proxy health check
 */
router.get('/status', (req, res) => {
  res.json({ 
    status: 'Proxy Server Active',
    endpoints: {
      browser: '/proxy/browser?url=<url>',
      content: '/proxy/content?url=<url>',
      client: '/proxy/client (POST)',
      ws: '/proxy/ws?url=<url>'
    }
  });
});

module.exports = router;
