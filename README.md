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
version-commit {token} {repository} {branch}
```

### Example simple:
```sh
version-commit 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
danilosoftwares/BloomMany
```

### Example with branch:
```sh
version-commit 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
danilosoftwares/BloomMany
develop
```

### Parameters:
- `{token}`: Your **GitHub Personal Access Token (PAT)**, required for authentication and repository access.
- `{repository}`: The repository name in the format `user/repo` (e.g., `danilosoftwares/ReactCapilar`).
- `{branch}`: The branch name such as `develop`.

## How It Works

1. `version-commit` accesses the specified repository and analyzes its commits.
2. Based on commit patterns (`fix:`, `feat:`, etc.), it generates a version following the **Semantic Versioning (SemVer)** standard.
3. The generated version is displayed in the terminal.

## Example of Generated Version

If the latest commits are:
```sh
1.0.0: Initial release.
1.1.0: feat: Added new functionality, compatible with 1.0.0.
1.1.1: fix: Bug fix in 1.1.0.
2.0.0: BREAKING CHANGE: Incompatible API changes, breaking compatibility with 1.x.
```
The generated version might be **2.0.0** (depending on the versioning rules used).

## GitHub Token Permissions

The provided token should have at least the following permissions:
- `repo` (for private repositories)
- `public_repo` (for public repositories)

If you need to generate a token, visit:
🔗 [GitHub Token Settings](https://github.com/settings/tokens)

## What is Semantic Version ?

Semantic Versioning (SemVer) is a software version control scheme that uses a structure of three numbers separated by periods to indicate the nature of changes in a project: MAJOR.MINOR.PATCH. Each number has a specific meaning, indicating whether the changes are compatible or not with previous versions.

SemVer Structure and Rules:

MAJOR (Major Version):

Increments when incompatible changes are made to the software's API. This means that when updating to this new version, code that depends on the previous version may need to be modified to work correctly.

MINOR (Minor Version):

Increments when new functionality is added in a way that is compatible with previous versions. The existing API continues to work, but with additional features.

PATCH (Patch Version):

Increments when bug fixes or minor adjustments that do not change the API are made.

Example Commits:
```sh
1.0.0: Initial release.
1.1.0: feat: Added new functionality, compatible with 1.0.0.
1.1.1: fix: Bug fix in 1.1.0.
2.0.0: BREAKING CHANGE: Incompatible API changes, breaking compatibility with 1.x.
```

![](flow.svg)

## Contribution

If you find any bugs or have suggestions, feel free to open an **Issue** or submit a **Pull Request** in the official repository:
🔗 [GitHub Repo](https://github.com/danilosoftwares/versionCommit)

## License

This project is distributed under the MIT license. See the repository for more details.

---

Now you can automatically generate versions based on your repository commits! 🚀

