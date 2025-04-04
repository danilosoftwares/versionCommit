const setPercentage = (value, max) => {
    let percentual = Math.round(((max - value) / max) * 100);
    process.stdout.write(`\rProgress: ${percentual}%`);
  }

const exit = () => {
    process.exit(0);
}

const clean = () => {
    process.stdout.write("\r" + " ".repeat(50) + "\r");
}

module.exports = { exit, clean, setPercentage };