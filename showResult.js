// Enable strict mode
"use strict";

function showResult(numberChosen, numberCorrect) {
  let numberAbbreviated = numberAbbreviator(numberChosen);
  if(numberChosen == numberCorrect)
  {
    window.alert(numberAbbreviated + 'Hz is correct!\nLet\'s try another one!');
    window.location.href=window.location.href;
  }
  else
  {
    window.alert(numberAbbreviated + 'Hz is not correct.\nPlease try again.');
  }
};

function numberAbbreviator(number) {
  if(number == 100)
  {
    return '100 ';
  }
  if(number == 400)
  {
    return '400 ';
  }
  if(number == 1600)
  {
    return '1.6 k';
  }
  if(number == 6300)
  {
    return '6.3 k';
  }
};
