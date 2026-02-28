# Shion AI — Deep Research Engine

## Introduction
Shion AI is an advanced AI-powered research assistant and search engine developed by Cynerza. It is designed to deliver accurate, source-aware answers, summarize relevant web information, and support deep research workflows.

Inspired by systems like Perplexity, Shion AI is built to provide a more powerful and customizable AI research platform for developers, teams, and independent researchers.

## Key Features
- AI-powered research engine for complex, multi-step queries
- Multi-model AI support across local and cloud model providers
- Web search summarization with source-grounded responses
- Streaming AI responses for faster interaction
- Research modes: `Speed`, `Balanced`, and `Quality`
- Advanced model selection for task-specific performance
- Modern chat-based research interface for iterative exploration

## Architecture Overview
Shion AI is structured as a modern web application with modular AI integrations:
- **Next.js frontend** for the interactive chat and research UI
- **Node.js backend runtime** powering API routes and orchestration logic
- **AI provider integrations** for flexible model access
- **Search engine aggregation** to collect and synthesize web results

## Getting Started
### Prerequisites
- Node.js and npm installed
- A configured search provider and AI model provider (depending on your setup)

### Installation
```bash
npm install
```

### Running the development server
```bash
npm run dev
```

After starting the server, open `http://localhost:3000` in your browser.

## Configuration
Shion AI uses environment variables for runtime configuration.

Typical configuration includes:
- AI provider credentials (API keys, model endpoints)
- Search provider settings
- Optional app-level runtime settings

Create and manage your environment variables locally (for example via a `.env` file) and never commit real secrets to version control.

## Project Structure
Major folders in this repository:
- `src/` - Application source code (frontend, backend routes, core logic)
- `public/` - Static assets served by the app
- `docs/` - Project and technical documentation
- `drizzle/` - Database schema and migration-related files
- `data/` - Local runtime data used by the application

## Future Roadmap
Planned upgrades include:
- AI agents for autonomous multi-step research
- Document intelligence for richer file understanding and extraction
- Knowledge base features for persistent research memory
- Team collaboration workflows
- Advanced research tools for expert and enterprise use cases

## Contributing
Contributions are welcome from the community.

If you want to improve Shion AI, please open an issue, discuss your proposal, and submit a pull request. For contribution guidelines, see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License
This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
