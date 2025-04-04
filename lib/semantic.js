
const generateSemanticVersion = (commit, major, minor, patch) => {
    const prefix = commit.message.split(":")[0].trim();
    const toAddMajor = ['BREAKING CHANGE', '!']
    const toAddPatch = ['fix', 'refactor', 'perf', 'docs', 'style', 'chore'];
    const toAddMinor = ['feat'];
    const toRemovePatch = ['revert'];
    if (exists(toAddMinor, prefix)) {
        minor++;
        patch = 0;
    }
    if (exists(toAddPatch, prefix)) {
        patch++;
    }
    if (exists(toRemovePatch, prefix)) {
        patch++;
    }
    if (exists(toAddMajor, prefix)) {
        major++;
        minor = 0;
        patch = 0;
    }
    return { major, minor, patch };
}

function exists(toList, value) {
    return toList.some(item => value.includes(item));
}

module.exports = { generateSemanticVersion };