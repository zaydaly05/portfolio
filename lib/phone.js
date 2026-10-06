/** Phone-number helpers shared by the WhatsApp modules. */
const digits = (value) => String(value || "").replace(/[^0-9]/g, "");

/**
 * True when two numbers are the same subscriber, tolerating a missing country code or leading zero
 * (compares the last 9 digits). An empty/short number never matches anything.
 */
function sameNumber(a, b) {
  const x = digits(a);
  const y = digits(b);
  if (x.length < 9 || y.length < 9) return false;
  return x.slice(-9) === y.slice(-9);
}

module.exports = { digits, sameNumber };
