# Contributing to Fancy HN 🤝

First off, thank you for considering contributing to Fancy HN! It's people like you that make Fancy HN such a great tool.

## Code of Conduct 📜

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Exercise consideration and empathy
- Focus on what is best for the community
- Use welcoming and inclusive language

## How Can I Contribute? 🤔

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Current behavior
- Screenshots (if applicable)
- Your environment details (OS, browser, etc.)

### Suggesting Enhancements ✨

If you have ideas for new features or improvements:

1. Check if the enhancement has already been suggested
2. Provide a clear description of the enhancement
3. Explain why this enhancement would be useful
4. Include any relevant examples or mockups

### Pull Requests 🔀

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing code style
5. Include appropriate documentation
6. Issue the pull request!

## Development Setup 💻

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```
3. Create a `.env.local` file based on `.env.example` (if exists)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Style Guide 🎨

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Use [Biome](https://biomejs.dev/) for formatting
- Follow the component structure in the `app` directory

## Commit Messages 📝

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally after the first line

Example:
```
feat: add dark mode toggle

- Add ThemeProvider component
- Implement user preference persistence
- Update documentation

Closes #123
```

## Branch Naming Convention 🌿

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Performance improvements: `perf/description`

## Need Help? 🆘

Feel free to ask for help! You can:

- Open an issue with your question
- Reach out to the maintainers
- Check the existing documentation

## Recognition 🌟

Contributors will be recognized in our README and project documentation.

Thank you for contributing to Fancy HN! 🙏 