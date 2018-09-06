// Enable strict mode
"use strict";

function showResult(numberChosen, numberCorrect) {
  if(numberChosen == numberCorrect)
  {
    window.alert(numberChosen + 'Hz is correct!\nLet\'s try another one!');
    window.location.href=window.location.href;
  }
  else
  {
    window.alert(numberChosen + 'Hz is not correct.\nPlease try again.');
  }
};
