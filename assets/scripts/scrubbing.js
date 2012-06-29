// Generated by CoffeeScript 1.3.3
(function() {

  $(function() {
    var KEY_CODE, activeStatement, clearStatementProblems, clickPos, currComputation, currElement, deleteCurrElementAndBacktrack, evaluateSolution, getEquationTokensForStatement, getLastNonCommentElement, newComment, newComparator, newNumber, newOperator, newStatement, selectedElement, statementProblem, updateComp, updateEvaluationForStatement;
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
      'equals': 61,
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
    activeStatement = $('.statement')[0];
    currElement = null;
    currComputation = $('.computation')[0];
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
      var cmp, elementToDelete, statementToDelete;
      console.log(currElement);
      if (currElement != null) {
        elementToDelete = currElement;
        currElement = currElement.previousElementSibling;
        return $(elementToDelete).remove();
      } else {
        cmp = activeStatement.parentElement.previousElementSibling;
        console.log(cmp);
        if ($(cmp).hasClass('comparator')) {
          statementToDelete = activeStatement;
          activeStatement = $(cmp.previousElementSibling).children('.statement')[0];
          $(cmp).remove();
          $(statementToDelete.parentNode).remove();
          return currElement = activeStatement.lastElementChild;
        }
      }
    };
    $(window).keydown(function(e) {
      var v;
      if (!e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.which) {
          case KEY_CODE['backspace']:
            if ($(currElement).hasClass('comment') || $(currElement).hasClass('number')) {
              v = $(currElement).html();
              if (v.length > 1) {
                $(currElement).html(v.substring(0, v.length - 1));
              } else {
                deleteCurrElementAndBacktrack();
              }
            } else {
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
                return $(currElement).html(op);
              } else if ($(currElement).hasClass('comment')) {
                return currElement = newOperator(op);
              } else {
                return $(currElement).html(op);
              }
            }
          };
          if ($(currElement).hasClass('number') && $(currElement).html() === '-') {
            $(currElement).removeClass('number').addClass('operator');
          }
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
            case KEY_CODE['equals']:
              newComparator('=');
              break;
            default:
              if (e.which !== 0 && e.charCode !== 0) {
                if (!$(currElement).hasClass('comment')) {
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
        updateEvaluationForStatement(selectedElement.parentNode);
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
      if (currElement != null) {
        $(e).insertAfter(currElement);
      } else {
        $(e).appendTo(activeStatement);
      }
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
      if (currElement != null) {
        $(e).insertAfter(currElement);
      } else {
        $(e).appendTo(activeStatement);
      }
      $(e).mousedown(function(e) {
        this.preventDefault;
        selectedElement = this;
        clickPos.x = e.screenX;
        clickPos.y = e.screenY;
        return false;
      });
      return e;
    };
    newComparator = function(cmp) {
      var e;
      e = document.createElement('span');
      $(e).html(cmp);
      $(e).addClass('element');
      $(e).addClass('comparator');
      $(e).insertAfter(activeStatement.parentNode);
      $(e).mousedown(function(e) {
        this.preventDefault;
        selectedElement = this;
        clickPos.x = e.screenX;
        clickPos.y = e.screenY;
        return false;
      });
      e;

      activeStatement = newStatement();
      return currElement = null;
    };
    newStatement = function() {
      var container, evl, statement;
      container = document.createElement('span');
      $(container).addClass('statement-container');
      statement = document.createElement('div');
      $(statement).addClass('statement');
      evl = document.createElement('div');
      $(evl).addClass('eval');
      $(statement).appendTo(container);
      $(evl).appendTo(container);
      $(container).appendTo(currComputation);
      return statement;
    };
    newComment = function() {
      var e;
      e = document.createElement('span');
      $(e).addClass('element');
      $(e).addClass('comment');
      if (currElement != null) {
        $(e).insertAfter(currElement);
      } else {
        $(e).appendTo(activeStatement);
      }
      $(e).mousedown(function(e) {
        this.preventDefault;
        selectedElement = this;
        clickPos.x = e.screenX;
        clickPos.y = e.screenY;
        return false;
      });
      return e;
    };
    clearStatementProblems = function(statement) {
      return $(statement).removeClass('error');
    };
    statementProblem = function(statement) {
      return $(statement).addClass('error');
    };
    getEquationTokensForStatement = function(statement) {
      var e, eqnString, eqnTokens, lastToken, t, tokens, _i, _j, _len, _len1, _ref;
      eqnString = "";
      _ref = $(statement).children();
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
      var e, eqnString, t, _i, _len;
      eqnString = "";
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        t = tokens[_i];
        if (t.type !== 'name') {
          eqnString += t.value + ' ';
        }
      }
      e = eval(eqnString);
      if (e != null) {
        return e;
      }
      return '';
    };
    updateEvaluationForStatement = function(statement) {
      var err, lastNonComment, lastToken, res, t, tokens, _i, _len;
      err = false;
      clearStatementProblems(statement);
      tokens = getEquationTokensForStatement(statement);
      if (tokens.length > 0) {
        lastNonComment = null;
        lastToken = null;
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          t = tokens[_i];
          if (t.type !== 'name') {
            if (!lastNonComment) {
              if (t.type === 'operator') {
                console.log("statements can't start with an operator");
                statementProblem(statement, t, 'A Number is Missing');
                err = true;
              }
            } else {
              if (lastNonComment.type === 'operator' && t.type === 'operator') {
                console.log("statements can't have two operators without a number between them");
                statementProblem(statement, lastNonComment, lastToken, t, 'A Number is Missing');
                err = true;
              } else if (lastNonComment.type === 'number' && t.type === 'number') {
                console.log("statements can't have two numbers without an operator between them");
                statementProblem(statement, lastNonComment, lastToken, t, 'An Operator is Missing');
                err = true;
              }
            }
            lastNonComment = t;
          }
          lastToken = t;
        }
        if (lastNonComment.type === 'operator') {
          console.log("statements can't end with operators");
          statementProblem(statement, lastNonComment, 'A Number is Missing');
          err = true;
        }
      }
      res = null;
      if (!err) {
        res = evaluateSolution(tokens);
        $(statement).siblings('.eval').html(res);
        console.log('no error');
      } else {
        $(statement).siblings('.eval').html('!');
      }
      return res;
    };
    return updateComp = function() {
      var newVal, statement, val, _i, _len, _ref, _results;
      val = null;
      _ref = $(currComputation).children('.statement-container').children('.statement');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        statement = _ref[_i];
        newVal = updateEvaluationForStatement(statement);
        if ((val != null) && newVal !== val) {
          console.log('Equation Inconsistency!');
          $(statement).parent().prev().addClass('error');
        } else {
          $(statement).parent().prev().removeClass('error');
        }
        _results.push(val = newVal);
      }
      return _results;
    };
  });

}).call(this);
