const { exit } = require("./screen");

const getParametersInput = () => {
  const args = process.argv.slice(2);
  let outputPath = "version.json";
  let tk = undefined;
  let rp = undefined;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-o":
        outputPath = args[i + 1] || outputPath;
        i++;
        break;
      case "-t":
        tk = args[i + 1] || tk;
        i++;
        break;
      case "-r":
        rp = args[i + 1] || rp;
        i++;
        break;
      case "-help":
        showHelp();
        break;
    }
  }
  if (!tk || !rp) {
    showHelp();
  }  
  return {
    outputPath,
    tk,
    rp,
  }
};

function showHelp() {
  console.log(`Version-Commit
Opções:
-o <path>         Output file path (e.g., ./src/assets/version.json)
-t <token>        Token used in the operation
-r <repository>   Repository in the format user/repo (e.g., danilo/servidorliso)
-help             Displays this help message
`);
  exit();
}

module.exports = { getParametersInput };