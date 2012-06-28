// Generated by CoffeeScript 1.3.3
(function() {

  $(function() {
    var KEY_CODE, activeStatement, clearStatementProblems, clickPos, currElement, deleteCurrElementAndBacktrack, evaluateSolution, getEquationTokens, getLastNonCommentElement, newComment, newNumber, newOperator, selectedElement, statementProblem, updateComp;
    KEY_CODE = {
      'min_num': 48,
      'max_num': 57,
      1: 49,
      2: 50,
      3: 51,
      4: 52,
      5: 53,
      6: 54,
      7: 55,
      8: 56,
      9: 57,
      0: 48,
      'backspace': 8,
      'delete': 46,
      'minus': 45,
      'plus': 43,
      'divide': 47,
      'multiply': 42,
      'paren_open': 57,
      'paren_close': 48,
      'space': 32,
      'return': 13,
      'esc': 27
    };
    clickPos = {
      x: null,
      y: null
    };
    selectedElement = null;
    activeStatement = $('#statement');
    currElement = null;
    getLastNonCommentElement = function() {
      var lastNonComment;
      if ($(currElement).hasClass('number') || $(currElement).hasClass('operator') || currElement === null) {
        return currElement;
      }
      lastNonComment = null;
      while (!(lastNonComment != null) || $(lastNonComment).hasClass('comment')) {
        lastNonComment = currElement.previousSibling;
      }
      if ($(lastNonComment).hasClass('number') || $(lastNonComment).hasClass('operator')) {
        return lastNonComment;
      } else {
        return null;
      }
    };
    deleteCurrElementAndBacktrack = function() {
      var elementToDelete;
      elementToDelete = currElement;
      currElement = currElement.previousSibling;
      if (!$(currElement).hasClass('number') && !$(currElement).hasClass('operator') && !$(currElement).hasClass('comment')) {
        currElement = null;
      }
      return $(elementToDelete).remove();
    };
    $(window).keydown(function(e) {
      var v;
      if (!e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.which) {
          case KEY_CODE['backspace']:
            if ($(currElement).hasClass('comment')) {
              v = $(currElement).html();
              if (v.length > 1) {
                $(currElement).html(v.substring(0, v.length - 1));
              } else {
                deleteCurrElementAndBacktrack();
              }
            } else if ($(currElement).hasClass('number')) {
              deleteCurrElementAndBacktrack();
            } else if ($(currElement).hasClass('operator')) {
              deleteCurrElementAndBacktrack();
            }
            return updateComp();
          case KEY_CODE['delete']:
            deleteCurrElementAndBacktrack();
            return updateComp();
        }
      }
    });
    $(window).keypress(function(e) {
      var operatorHelper, v, _ref;
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (((KEY_CODE['min_num'] <= (_ref = e.which) && _ref <= KEY_CODE['max_num'])) && !e.shiftKey) {
          if (!$(currElement).hasClass('number')) {
            currElement = newNumber();
          }
          v = $(currElement).html() + (e.which - KEY_CODE['min_num']);
          $(currElement).html(v);
        } else {
          operatorHelper = function(op) {
            if (!getLastNonCommentElement()) {
              if (op === '-') {
                currElement = newNumber();
                return $(currElement).html('-');
              } else {
                return currElement = newOperator(op);
              }
            } else if ($(getLastNonCommentElement()).hasClass('number')) {
              return currElement = newOperator(op);
            } else if ($(getLastNonCommentElement()).hasClass('operator')) {
              if (op === '-') {
                currElement = newNumber();
                return $(currElement).html('-');
              } else {
                return $(currElement).html(op);
              }
            }
          };
          switch (e.which) {
            case KEY_CODE['plus']:
              if (e.shiftKey) {
                operatorHelper('+');
              }
              break;
            case KEY_CODE['minus']:
              if (!e.shiftKey) {
                operatorHelper('-');
              }
              break;
            case KEY_CODE['divide']:
              if (!e.shiftKey) {
                operatorHelper('/');
              }
              break;
            case KEY_CODE['multiply']:
              if (e.shiftKey) {
                operatorHelper('*');
              }
              break;
            default:
              if (e.which !== 0 && e.charCode !== 0) {
                if (!$(currElement).hasClass('comment')) {
                  if ($(currElement).hasClass('number') && $(currElement).html() === '-') {
                    $(currElement).removeClass('number').addClass('operator');
                  }
                  currElement = newComment();
                }
                v = $(currElement).html() + String.fromCharCode(e.which);
                $(currElement).html(v);
              }
          }
        }
      }
      return updateComp();
    });
    $(window).mousemove(function(e) {
      var d, v;
      if ((clickPos.x != null) && (clickPos.y != null) && (selectedElement != null) && $(selectedElement).hasClass('number')) {
        v = Number($(selectedElement).html());
        d = Math.round(e.screenX - clickPos.x);
        $(selectedElement).html(d + v);
        updateComp();
        clickPos.x = e.screenX;
        return clickPos.y = e.screenY;
      }
    });
    $(window).mouseup(function(e) {
      return selectedElement = null;
    });
    newNumber = function() {
      var e;
      e = document.createElement('span');
      $(e).addClass('element');
      $(e).addClass('number');
      $(e).appendTo(activeStatement);
      $(e).mousedown(function(e) {
        this.preventDefault;
        selectedElement = this;
        clickPos.x = e.screenX;
        clickPos.y = e.screenY;
        return false;
      });
      return e;
    };
    newOperator = function(op) {
      var e;
      e = document.createElement('span');
      $(e).html(op);
      $(e).addClass('element');
      $(e).addClass('operator');
      $(e).appendTo(activeStatement);
      $(e).mousedown(function(e) {
        this.preventDefault;
        selectedElement = this;
        clickPos.x = e.screenX;
        clickPos.y = e.screenY;
        return false;
      });
      return e;
    };
    newComment = function() {
      var e;
      e = document.createElement('span');
      $(e).addClass('element');
      $(e).addClass('comment');
      $(e).appendTo(activeStatement);
      $(e).mousedown(function(e) {
        this.preventDefault;
        selectedElement = this;
        clickPos.x = e.screenX;
        clickPos.y = e.screenY;
        return false;
      });
      return e;
    };
    clearStatementProblems = function() {
      $(activeStatement).removeClass('error');
      return $('#result').removeClass('error');
    };
    statementProblem = function() {
      return $(activeStatement).addClass('error');
    };
    getEquationTokens = function() {
      var e, eqnString, eqnTokens, lastToken, t, tokens, _i, _j, _len, _len1, _ref;
      eqnString = "";
      _ref = $(activeStatement).children();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if ($(e).hasClass('element') && !$(e).hasClass('comment')) {
          eqnString += $(e).html() + ' ';
        }
      }
      tokens = eqnString.tokens();
      lastToken = null;
      eqnTokens = [];
      for (_j = 0, _len1 = tokens.length; _j < _len1; _j++) {
        t = tokens[_j];
        if ((lastToken != null) && lastToken.type === 'operator' && t.type === 'number' && lastToken.value === '-') {
          if ((eqnTokens.length > 1 && eqnTokens[eqnTokens.length - 2].type === 'operator') || eqnTokens.length === 1) {
            eqnTokens.pop();
            t.value = '-' + t.value;
          }
        }
        if (t.type !== 'name') {
          eqnTokens.push(t);
          lastToken = t;
        }
      }
      return eqnTokens;
    };
    evaluateSolution = function(tokens) {
      var eqnString, t, _i, _len;
      eqnString = "";
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        t = tokens[_i];
        if (t.type !== 'name') {
          eqnString += t.value + ' ';
        }
      }
      return eval(eqnString);
    };
    return updateComp = function() {
      var err, lastNonComment, lastToken, t, tokens, _i, _len;
      err = false;
      clearStatementProblems();
      tokens = getEquationTokens();
      if (tokens.length > 0) {
        lastNonComment = null;
        lastToken = null;
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          t = tokens[_i];
          if (t.type !== 'name') {
            if (!lastNonComment) {
              if (t.type === 'operator') {
                console.log("statements can't start with an operator");
                statementProblem(t, 'A Number is Missing');
                err = true;
              }
            } else {
              if (lastNonComment.type === 'operator' && t.type === 'operator') {
                console.log("statements can't have two operators without a number between them");
                statementProblem(lastNonComment, lastToken, t, 'A Number is Missing');
                err = true;
              } else if (lastNonComment.type === 'number' && t.type === 'number') {
                console.log("statements can't have two numbers without an operator between them");
                statementProblem(lastNonComment, lastToken, t, 'An Operator is Missing');
                err = true;
              }
            }
            lastNonComment = t;
          }
          lastToken = t;
        }
        if (lastNonComment.type === 'operator') {
          console.log("statements can't end with operators");
          statementProblem(lastNonComment, 'A Number is Missing');
          err = true;
        }
      }
      if (!err) {
        return $('#result').html(evaluateSolution(tokens));
      } else {
        return $('#result').html('!').addClass('error');
      }
    };
  });

}).call(this);
