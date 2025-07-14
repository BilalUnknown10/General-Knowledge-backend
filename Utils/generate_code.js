
const generate4DigitCode = () => {
  return  Math.floor(1000 + Math.random() * 9000); // Always 4-digit
};

module.exports = {generate4DigitCode};