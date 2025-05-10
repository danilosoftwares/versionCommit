const { getParametersInput } = require("./input");
const { getMaxPages, getCommits } = require("./commits");
const { clean, setPercentage } = require("./screen");
const { saveJSON } = require("./output");

async function main() {
  const input = getParametersInput();
  const token = input.tk;
  const repo = input.rp;
  const branch = input.branch;

  const maxPage = await getMaxPages(repo, token, branch);

  let page = maxPage;
  let version = { major: 1, minor: 0, patch: 0 };
  let blocks = [];
  while (page > 0) {
    blocks.push(getCommits(repo, token, branch, page));
    setPercentage(page, maxPage);
    if (blocks.length === 20) {
      version = await getVersionBlock(blocks, version);
      blocks = [];
    }
    page--;
  }
  if (blocks.length > 0) {
    version = await getVersionBlock(blocks, version);
  }
  clean();
  console.log(version);
  saveJSON(input.outputPath, version);
}

async function getVersionBlock(blocks,version) {
  const resultVersion = await Promise.all(blocks);
  const existsVersion = resultVersion.reduce((acc, obj) => {
    Object.keys(obj).forEach(key => acc[key] = (acc[key] || 0) + obj[key]);
    return acc;
  }, {});
  if (existsVersion) {
    version.major = version.major + existsVersion.major;
    version.minor = version.minor + existsVersion.minor;
    version.patch = version.patch + existsVersion.patch;
  }  
  return version;
}

exports.main = main;