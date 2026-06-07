# 🎮 Cathappy - Game Proxy & Search Engine

A comprehensive proxy server for unblocked games with an integrated search engine to discover and access both browser-based and client-based games.

## Features

### 🔍 Search Engine
- **Game Discovery** - Search through a database of games
- **Categorization** - Filter by category (puzzle, arcade, strategy, etc.)
- **Type Filtering** - Browser games vs Client-based games
- **Popular & Featured** - Quick access to trending games
- **Suggestions** - Auto-complete suggestions while typing
- **Statistics** - View game database stats

### 🔀 Proxy System

#### Browser Game Proxy
- Forward requests to game servers
- Header rewriting for origin masking
- Support for static assets, APIs, and resources

#### Content Proxy
- Fetch content from remote URLs
- API request forwarding
- Direct content delivery

#### Client Game Support
- Configuration templates for popular games
- Launch parameter handling
- Environment setup assistance

#### WebSocket Support
- Real-time game communication
- Multiplayer game support
- Live data streaming

### ⚡ Performance Features
- Request caching (10-minute TTL)
- Rate limiting (100 req/15min per IP)
- Compression for faster delivery
- Connection pooling
- Timeout handling

### 🔒 Security
- CORS enabled
- Helmet security headers
- Rate limiting per IP
- Input validation
- Error handling

## Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/jduj220-crypto/cathappy.git
cd cathappy
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env if needed (PORT, NODE_ENV, etc.)
```

4. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Usage

### Web Interface
Visit `http://localhost:3000` in your browser to access the full interface with:
- Game search
- Proxy tools
- Statistics

### API Endpoints

#### Search Engine

**Search Games**
```
GET /api/search/games?q=<query>&category=<category>&type=<type>
```
Example: `GET /api/search/games?q=tetris&type=browser`

**Get Categories**
```
GET /api/search/categories
```

**Get Game Types**
```
GET /api/search/types
```

**Popular Games**
```
GET /api/search/popular
```

**Featured Games**
```
GET /api/search/featured
```

**Search Suggestions**
```
GET /api/search/suggest?q=<query>
```

**Game Statistics**
```
GET /api/search/stats
```

**Add Custom Game**
```
POST /api/search/add-game
Content-Type: application/json

{
  "name": "Game Name",
  "category": "puzzle",
  "type": "browser",
  "url": "https://example.com/game",
  "description": "Game description"
}
```

#### Proxy System

**Browser Game Proxy**
```
GET /proxy/browser?url=<game_url>
```

**Content Proxy**
```
GET /proxy/content?url=<content_url>
```

**Client Game Launcher**
```
POST /proxy/client
Content-Type: application/json

{
  "game": "minecraft",
  "action": "launch",
  "params": {}
}
```

**Proxy Status**
```
GET /proxy/status
```

#### Health Check
```
GET /health
```

## Project Structure

```
cathappy/
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore         # Git ignore rules
├── public/
│   └── index.html     # Web interface
├── routes/
│   ├── search.js      # Search engine routes
│   └── proxy.js       # Proxy routes
└── README.md          # This file
```

## Configuration

### Environment Variables

```env
PORT=3000              # Server port
NODE_ENV=development   # development or production
```

### Rate Limiting
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Message**: Customizable

### Cache Settings
- **TTL**: 600 seconds (10 minutes)
- **Type**: In-memory cache
- **Used for**: Search results

## Game Database

The initial game database includes:
- Tetris (Puzzle)
- 2048 (Puzzle)
- Flappy Bird (Arcade)
- Snake (Arcade)
- Chess (Strategy)
- Minecraft (Sandbox/Client)
- Among Us (Social/Client)

### Adding More Games

**Via API:**
```bash
curl -X POST http://localhost:3000/api/search/add-game \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Game",
    "category": "puzzle",
    "type": "browser",
    "url": "https://example.com/game",
    "description": "A fun game"
  }'
```

**Via Code:**
Edit `routes/search.js` and add entries to the `gameDatabase` array.

## Error Handling

The server handles various error scenarios:

- **Missing Parameters**: Returns 400 with error message
- **Invalid URL Format**: Validates and returns error
- **Proxy Failures**: Returns 502 Bad Gateway
- **Server Errors**: Returns 500 with optional details
- **Rate Limit Exceeded**: Returns 429

## Performance Tips

1. **Enable Caching** - Search results are cached automatically
2. **Use Compression** - Enabled by default
3. **Rate Limiting** - Prevents abuse and server overload
4. **Connection Pooling** - Reuse connections where possible

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Heroku
```bash
git push heroku main
```

### Docker (coming soon)

### Traditional VPS
```bash
npm install
npm start
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001
npm start
```

### Module Not Found
```bash
npm install
```

### CORS Issues
- CORS is enabled by default
- Check if origin is allowed in server config

### Slow Search
- Clear cache: Restart server
- Check internet connection
- Reduce database size

## Security Considerations

⚠️ **Warning**: This proxy tool should only be used for:
- Educational purposes
- Accessing legitimate content
- Personal use on your own network

Do NOT use for:
- Bypassing network restrictions illegally
- Accessing unauthorized content
- Running on public networks without proper access control

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check existing GitHub issues
- Create a new GitHub issue
- Contact the maintainer

## Changelog

### v1.0.0
- Initial release
- Search engine
- Proxy system
- Web interface
- Rate limiting
- Caching

## Future Features

- [ ] WebSocket full support
- [ ] Database persistence (MongoDB)
- [ ] User authentication
- [ ] Game favorites/bookmarks
- [ ] Advanced filtering
- [ ] API key management
- [ ] Performance analytics
- [ ] Docker support
- [ ] Mobile app

---

**Made with ❤️ by jduj220-crypto**
