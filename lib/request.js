const https = require("https");

const executeRequest = (options, f) => {
  return new Promise(function (myResolve, myReject) {
    try {
      const req = https.request(options,(res) => f(res,myResolve, myReject));
      req.end();
    } catch (e) {
      myReject(e);
    }
  });
}

module.exports = { executeRequest };