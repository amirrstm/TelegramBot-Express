const isValidIranianNationalCode = (input) => {
  if (!/^\d{10}$/.test(input)) return false;

  var check = +input[9];
  var sum = 0;
  var i;
  for (i = 0; i < 9; ++i) {
    sum += +input[i] * (10 - i);
  }
  sum %= 11;

  return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
};

module.exports = isValidIranianNationalCode;
