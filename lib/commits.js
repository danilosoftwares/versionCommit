const { executeRequest } = require("./request");
const { generateSemanticVersion } = require("./semantic");

function getOptions(repo, token, branch, page) {
  const bch = branch ? `&sha=${branch}` : '';
    return {
      hostname: "api.github.com",
      port: 443,
      path: `/repos/${repo}/commits?${page ? 'page=' + page : ''}&per_page=100${bch}`,
      headers: {
        "User-Agent": "MeuApp/1.0.0",
        "Authorization": "Bearer " + token
      },
    };
  }

const getMaxPages = (repo, token, branch) => {
  return executeRequest(getOptions(repo, token, branch), (res, resolve, reject) => {
    try {
      const linkHeader = res.headers.link;
      if (!linkHeader) {
        resolve(1);
      }
      const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
      const totalPages = match ? parseInt(match[1], 10) : 1;
      resolve(totalPages);
    } catch (e) {
      resolve(1);
    }
  });
}

const getCommits = (repo, token, branch, page) => {
  return executeRequest(getOptions(repo, token, branch, page), (res, resolve, reject) => {
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
        let idxCommit = commits.length - 1;
        while (idxCommit > 0) {
          const version = generateSemanticVersion(commits[idxCommit].commit, major, minor, patch);
          if (version) {
            major = version.major;
            minor = version.minor;
            patch = version.patch;
          }
          idxCommit--;
        }
        resolve({ major, minor, patch });
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = { getMaxPages, getCommits };