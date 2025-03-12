# Version Commit CLI

`version-commit` is a command-line tool (CLI) that automatically generates versions based on GitHub repository commits.

## Installation

To install `version-commit`, run the following command:

```sh
npm install -g https://github.com/danilosoftwares/versionCommit.git
```

This will install the tool globally, allowing you to use it from anywhere in the terminal.

## Usage

`version-commit` requires a **GitHub token** and the **repository name** to generate the version based on commits.

### Command:
```sh
version-commit {token} {repository}
```

### Example:
```sh
version-commit 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
danilosoftwares/BloomMany
```

### Parameters:
- `{token}`: Your **GitHub Personal Access Token (PAT)**, required for authentication and repository access.
- `{repository}`: The repository name in the format `user/repo` (e.g., `danilosoftwares/ReactCapilar`).

## How It Works

1. `version-commit` accesses the specified repository and analyzes its commits.
2. Based on commit patterns (`fix:`, `feat:`, etc.), it generates a version following the **Semantic Versioning (SemVer)** standard.
3. The generated version is displayed in the terminal.

## Example of Generated Version

If the latest commits are:
```sh
feat: added new feature X
fix: fixed bug Y
chore: updated README
```
The generated version might be **2.3.2** (depending on the versioning rules used).

## GitHub Token Permissions

The provided token should have at least the following permissions:
- `repo` (for private repositories)
- `public_repo` (for public repositories)

If you need to generate a token, visit:
🔗 [GitHub Token Settings](https://github.com/settings/tokens)

## Contribution

If you find any bugs or have suggestions, feel free to open an **Issue** or submit a **Pull Request** in the official repository:
🔗 [GitHub Repo](https://github.com/danilosoftwares/versionCommit)

## License

This project is distributed under the MIT license. See the repository for more details.

---

Now you can automatically generate versions based on your repository commits! 🚀

