# GitHub Repo Chat 🤖

A Chrome extension that helps you understand GitHub repositories through natural conversations with AI. Ask questions about code, architecture, dependencies, or implementation details - get clear, contextual answers.

## 🎯 Purpose

Ever landed on a GitHub repository and felt overwhelmed trying to understand its structure, purpose, or implementation details? GitHub Repo Chat connects you with an AI assistant that can help you:

- Understand repository architecture and design decisions
- Get explanations of complex code sections
- Learn about dependencies and their purposes
- Discover how different components work together
- Navigate large codebases efficiently

## 💡 Key Features

- **Context-Aware Discussions**: Chat about any file or folder in the current repository
- **Natural Interactions**: Ask questions in plain English, get clear explanations
- **Code Understanding**: Get help understanding complex code patterns and architectures
- **Quick Access**: Simple popup interface accessible while browsing GitHub
- **Markdown Support**: Receive formatted responses with syntax-highlighted code examples

## 🚀 Quick Start

1. Install the extension
2. Add your API keys in settings:
   - GitHub token (for repository access)
   - OpenAI API key (for AI responses)
3. Browse to any GitHub repository
4. Click the extension icon
5. Start asking questions!

## 💬 Example Questions

- "What's the main purpose of this repository?"
- "How does the authentication system work?"
- "Explain the project's folder structure"
- "What are the key dependencies and why are they used?"
- "Walk me through the data flow in this component"

## 🛠️ Technical Details

### Installation

```bash
git clone https://github.com/yourusername/github-repo-chat.git
cd github-repo-chat/extension
npm install
npm run build
```

Then load the `extension/dist` folder as an unpacked extension in Chrome.

### Development

```bash
# Watch mode for development
npm run watch

# Production build
npm run prod
```

### Core Dependencies

- OpenAI API for intelligent responses
- GitHub API for repository context
- Marked.js for response formatting
- Highlight.js for code syntax highlighting

## 🔒 Security

- Minimal permissions required:
  - `activeTab`: Only accesses the current GitHub tab
  - `storage`: Securely stores your API tokens
- No code execution
- No data collection
- All communication is encrypted

## 🎯 Roadmap

- [ ] Support for private repositories
- [ ] Repository-wide search and context
- [ ] Code explanation with visual diagrams
- [ ] Integration with GitHub discussions
- [ ] Custom AI model selection

## 🤝 Contributing

Contributions welcome! Some areas that need improvement:

- Enhanced error handling
- Better token management
- Additional conversation features
- UI/UX improvements
- Documentation

## 📝 Notes

- Works best with public repositories
- Requires OpenAI API credits
- Response quality depends on repository documentation and code clarity

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

Built for developers, by developers. Happy coding! 🚀
