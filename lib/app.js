const https = require("https");
const fs = require('node:fs');

let token = undefined;
let repo = undefined;

async function main() {

  const params = process.argv.slice(2);

  token = params[0];
  if (token === undefined || token === "") {
    console.log("parameter token not found");
    return;
  }

  repo = params[1];
  if (repo === undefined || repo === "") {
    console.log("parameter repository not found");
    return;
  }

  const maxPage = await getMaxPages();

  let page = maxPage;
  let existsVersion = {};
  let version = { major: 1, minor: 0, patch: 0 };
  while (existsVersion) {
    if (page<=0){
      break;
    }
    existsVersion = await getCommits(page);
    if (existsVersion) {
      version.major = version.major + existsVersion.major;
      version.minor = version.minor + existsVersion.minor;
      version.patch = version.patch + existsVersion.patch;
      page--;
    }
  }
  console.log(version);
  fs.writeFileSync('version.json', JSON.stringify(version));
}


function getMaxPages() {
  return new Promise(function (myResolve, myReject) {
    const options = {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${repo}/commits?per_page=100`,
      headers: {
        "User-Agent": "MeuApp/1.0.0",
        "Authorization": "Bearer " + token
      },
    };
    try {
      const req = https.request(options, (res) => {
        try{
          const linkHeader = response.headers.get("Link");
          if (!linkHeader) {
            console.log("Nenhuma paginação encontrada. Apenas uma página disponível.");
            return;
          }    
          const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
          const totalPages = match ? parseInt(match[1], 10) : 1;   
          myResolve(totalPages);            
        } catch(e){
          myResolve(1);
        }
      });
      req.end();
    } catch (e) {
      myReject(e);
    }
  });
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
          if (statusCode !== 200) {
            console.log(`status code: ${statusCode}`);
            console.log(commits);
            return;
          }
          let major = 0;
          let minor = 0;
          let patch = 0;
          if (commits.length > 0) {
            let idxCommit = commits.length-1;
            while(idxCommit > 0) {
              const version = generateSemanticVersion(commits[idxCommit].commit, major, minor, patch);
              if (version) {
                major = version.major;
                minor = version.minor;
                patch = version.patch;
              }
              idxCommit--;
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
  const toAddMajor = ['BREAKING CHANGE', '!']
  const toAddPatch = ['fix', 'refactor', 'perf', 'docs', 'style', 'chore'];
  const toAddMinor = ['feat'];
  const toRemovePatch = ['revert'];
  if (exists(toAddMinor, prefix)){
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


exports.main = main;