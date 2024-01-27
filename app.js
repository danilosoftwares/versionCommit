const https = require("https");
const fs = require('node:fs');

let token = undefined;
let repo = undefined;

async function main() {
  let page = 1;
  let existsVersion = {};
  let version = { major: 1, minor: 0, patch: 0 };
  while (existsVersion) {
    existsVersion = await getCommits(page);
    if (existsVersion) {
      version.major = version.major + existsVersion.major;
      version.minor = version.minor + existsVersion.minor;
      version.patch = version.patch + existsVersion.patch;
      page++;
    }
  }
  console.log(version);
  fs.writeFileSync('version.json', JSON.stringify(version));
}

function getCommits(page) {
  return new Promise(function (myResolve, myReject) {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${repo}/commits?page=${page}&per_page=100`,
      headers: {
        "User-Agent": "MeuApp/1.0.0",
        "Authorization": "Bearer " + token
      },
    };
    try {
      const req = https.request(options, (res) => {
        const statusCode = res.statusCode;         
        const body = [];
        res.on("data", (chunk) => {
          body.push(chunk);
        });
        res.on("end", () => {
          const commits = JSON.parse(Buffer.concat(body));
          if (statusCode !== 200){
            console.log(`status code: ${statusCode}`);
            console.log(commits);
            return;
          }
          let major = 0;
          let minor = 0;
          let patch = 0;
          if (commits.length > 0) {
            for (const commit of commits) {
              const version = generateSemanticVersion(commit.commit, major, minor, patch);
              if (version) {
                major = version.major;
                minor = version.minor;
                patch = version.patch;
              }
            }
            myResolve({ major, minor, patch });
          } else {
            myResolve(null);
          }
        });
      });
      req.end();
    } catch (e) {
      myReject(e);
    }
  });
}

function generateSemanticVersion(commit, major, minor, patch) {
  const prefix = commit.message.split(":")[0].trim();
  const toAddPatch = ['fix', 'refactor', 'perf', 'docs', 'style', 'chore'];
  const toAddMajor = ['feat'];
  const toRemovePatch = ['revert'];
  if (exists(toAddMajor, prefix))
    major++;
  else if (exists(toAddPatch, prefix))
    patch++;
  else if (exists(toRemovePatch, prefix))
    patch--;
  return { major, minor, patch };
}

function exists(toList, value) {
  return toList.join(';').toLowerCase().indexOf(value.toLowerCase()) > -1;
}

const params = process.argv.slice(2);

token = params[0];
if (token === undefined || token === ""){
  console.log("parameter token not found");
  return;
}

repo = params[1];
if (repo === undefined || repo === ""){
  console.log("parameter repository not found");
  return;
}



main();
