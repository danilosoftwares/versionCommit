const fs = require('node:fs');

function saveJSON(path, content) {
    fs.writeFileSync(path, JSON.stringify(content));
}

module.exports = { saveJSON };