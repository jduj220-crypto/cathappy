const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const router = express.Router();

// Cache for search results (10 minute TTL)
const cache = new NodeCache({ stdTTL: 600 });

// Game database (can be expanded)
const gameDatabase = [
  {
    id: 1,
    name: 'Tetris',
    category: 'puzzle',
    type: 'browser',
    url: 'https://tetris.com',
    description: 'Classic Tetris game'
  },
  {
    id: 2,
    name: '2048',
    category: 'puzzle',
    type: 'browser',
    url: 'https://play2048.co',
    description: 'Number puzzle game'
  },
  {
    id: 3,
    name: 'Flappy Bird',
    category: 'arcade',
    type: 'browser',
    url: 'https://flappybird.io',
    description: 'Tap to fly bird'
  },
  {
    id: 4,
    name: 'Snake',
    category: 'arcade',
    type: 'browser',
    url: 'https://snake.io',
    description: 'Classic snake game'
  },
  {
    id: 5,
    name: 'Chess',
    category: 'strategy',
    type: 'browser',
    url: 'https://chess.com',
    description: 'Online chess'
  },
  {
    id: 6,
    name: 'Minecraft',
    category: 'sandbox',
    type: 'client',
    url: 'https://minecraft.net',
    description: 'Building and survival game'
  },
  {
    id: 7,
    name: 'Among Us',
    category: 'social',
    type: 'client',
    url: 'https://www.innersloth.com/games/among-us/',
    description: 'Multiplayer social deduction game'
  }
];

/**
 * Search for games
 * Query: /api/search/games?q=puzzle&type=browser
 */
router.get('/games', (req, res) => {
  try {
    const { q, category, type } = req.query;
    const cacheKey = `search_${q}_${category}_${type}`;

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ 
        results: cached,
        cached: true,
        query: { q, category, type }
      });
    }

    let results = gameDatabase;

    // Filter by search query
    if (q) {
      results = results.filter(game =>
        game.name.toLowerCase().includes(q.toLowerCase()) ||
        game.description.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      results = results.filter(game => game.category === category.toLowerCase());
    }

    // Filter by type
    if (type) {
      results = results.filter(game => game.type === type.toLowerCase());
    }

    // Cache results
    cache.set(cacheKey, results);

    res.json({ 
      results,
      count: results.length,
      query: { q, category, type }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all categories
 */
router.get('/categories', (req, res) => {
  try {
    const categories = [...new Set(gameDatabase.map(g => g.category))];
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all game types
 */
router.get('/types', (req, res) => {
  try {
    const types = [...new Set(gameDatabase.map(g => g.type))];
    res.json({ types });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get popular games
 */
router.get('/popular', (req, res) => {
  try {
    const popular = gameDatabase.slice(0, 5);
    res.json({ results: popular });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get featured games
 */
router.get('/featured', (req, res) => {
  try {
    const featured = gameDatabase.filter(g => g.category === 'puzzle' || g.category === 'arcade');
    res.json({ results: featured });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Add custom game to database
 * POST: /api/search/add-game
 */
router.post('/add-game', (req, res) => {
  try {
    const { name, category, type, url, description } = req.body;

    if (!name || !category || !type || !url) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, category, type, url' 
      });
    }

    const newGame = {
      id: gameDatabase.length + 1,
      name,
      category: category.toLowerCase(),
      type: type.toLowerCase(),
      url,
      description: description || ''
    };

    gameDatabase.push(newGame);
    cache.flushAll(); // Clear cache

    res.json({ 
      status: 'success',
      game: newGame,
      message: 'Game added successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Search suggestions
 */
router.get('/suggest', (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = gameDatabase
      .filter(game => game.name.toLowerCase().startsWith(q.toLowerCase()))
      .map(g => ({ name: g.name, category: g.category }))
      .slice(0, 5);

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Search statistics
 */
router.get('/stats', (req, res) => {
  try {
    res.json({
      totalGames: gameDatabase.length,
      byCategory: gameDatabase.reduce((acc, g) => {
        acc[g.category] = (acc[g.category] || 0) + 1;
        return acc;
      }, {}),
      byType: gameDatabase.reduce((acc, g) => {
        acc[g.type] = (acc[g.type] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
