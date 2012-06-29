$ () ->
  
  KEY_CODE =
    'min_num': 48
    'max_num': 57
    1: 49
    2: 50
    3: 51
    4: 52
    5: 53
    6: 54
    7: 55
    8: 56
    9: 57
    0: 48
    'backspace': 8
    'delete': 46
    'minus': 45 
    'plus': 43 # Needs Shift
    'divide': 47
    'equals': 61
    'multiply': 42 # Needs Shift
    'paren_open' : 57 # Needs Shift
    'paren_close' : 48 # Needs Shift
    'space': 32
    'return': 13
    'esc': 27

  clickPos = 
    x: null
    y: null

  selectedElement = null
  activeStatement = $('.statement')[0]
  currElement = null

  # Taken from the Raphael clock example
  # paper = Raphael(10, 50, 1000, 1000)
  # R = 50
  # alpha = 180
  # a = (90 - alpha) * Math.PI / 180
  # x = 300 + R * Math.cos(a)
  # y = 300 - R * Math.sin(a)
  # circle = paper.path([["M", 300, 300 - R], ["A", R, R, 0, + (alpha > 180), 1, x, y]])
  # circle.attr('stroke-width',20)
  # circle.attr('stroke','#f00')
  # circle.attr('fill', 'none')

  getLastNonCommentElement = () ->
    # Includes currElement
    if $(currElement).hasClass('number') or $(currElement).hasClass('operator') or currElement == null
      return currElement
    lastNonComment = null
    while !lastNonComment? or $(lastNonComment).hasClass('comment')
      lastNonComment = currElement.previousSibling
    if $(lastNonComment).hasClass('number') or $(lastNonComment).hasClass('operator')
      return lastNonComment
    else
      return null

  deleteCurrElementAndBacktrack = () ->
    elementToDelete = currElement 
    currElement = currElement.previousSibling
    if !$(currElement).hasClass('number') and 
       !$(currElement).hasClass('operator') and 
       !$(currElement).hasClass('comment')
      currElement = null 
    $(elementToDelete).remove()

  $(window).keydown (e) ->
    # Handle special control keys.
    if !e.shiftKey and !e.metaKey and !e.ctrlKey and !e.altKey 
      switch e.which
        when KEY_CODE['backspace']
          if $(currElement).hasClass('comment') or $(currElement).hasClass('number')
            v = $(currElement).html()
            if v.length > 1
              $(currElement).html(v.substring(0,v.length-1))
            else
              deleteCurrElementAndBacktrack()
          else if $(currElement).hasClass('operator')
            deleteCurrElementAndBacktrack()
          updateComp()
        when KEY_CODE['delete']
          deleteCurrElementAndBacktrack()
          updateComp()

  $(window).keypress (e) ->
    if !e.metaKey and !e.ctrlKey and !e.altKey
      # Decimal numbers
      if (KEY_CODE['min_num'] <= e.which <= KEY_CODE['max_num']) and !e.shiftKey
        if !$(currElement).hasClass('number')
          currElement = newNumber()
        v = $(currElement).html() + (e.which - KEY_CODE['min_num'])
        $(currElement).html(v)
      else 
        operatorHelper = (op) ->
          if !getLastNonCommentElement()
            if op == '-' # allow us to have negative numbers
              currElement = newNumber()
              $(currElement).html('-')
            else
              currElement = newOperator(op)
          else if $(getLastNonCommentElement()).hasClass('number')
            currElement = newOperator(op)
          else if $(getLastNonCommentElement()).hasClass('operator')
            if op == '-' # allow us to have negative numbers
              currElement = newNumber()
              $(currElement).html(op)
            else if $(currElement).hasClass('comment') 
              currElement = newOperator(op)
            else
              $(currElement).html(op)
      
        if $(currElement).hasClass('number') and $(currElement).html() == '-'
          $(currElement).removeClass('number').addClass('operator')
        switch e.which
          # The operators          
          when KEY_CODE['plus']
            if e.shiftKey
              operatorHelper ('+')
          when KEY_CODE['minus']
            if !e.shiftKey
              operatorHelper ('-')
          when KEY_CODE['divide']
            if !e.shiftKey
              operatorHelper ('/')
          when KEY_CODE['multiply']
            if e.shiftKey
              operatorHelper('*')
          when KEY_CODE['equals']
            newComparator('=') 
          else
            if e.which != 0 and e.charCode != 0
              if !$(currElement).hasClass('comment')
                currElement = newComment()
              v = $(currElement).html() + String.fromCharCode(e.which)
              $(currElement).html(v)

    updateComp()
  
  $(window).mousemove (e) ->
    #console.log('MOVING '+ e.button)
    if clickPos.x? and clickPos.y? and selectedElement? and $(selectedElement).hasClass('number')
      v = ((Number) $(selectedElement).html())
      d = Math.round((e.screenX - clickPos.x)) 
      $(selectedElement).html(d + v)
      updateEvaluationForStatement(selectedElement.parentNode)
      clickPos.x = e.screenX
      clickPos.y = e.screenY

  $(window).mouseup (e) ->
    selectedElement = null

  newNumber = () ->
    e = document.createElement('span')
    $(e).addClass('element')
    $(e).addClass('number')
    $(e).appendTo(activeStatement)
    
    $(e).mousedown (e) ->
      this.preventDefault
      selectedElement = this
      clickPos.x = e.screenX
      clickPos.y = e.screenY
      false
    e

  newOperator = (op) ->
    e = document.createElement('span')
    $(e).html(op)
    $(e).addClass('element')
    $(e).addClass('operator')
    $(e).appendTo(activeStatement)
    
    $(e).mousedown (e) ->
      this.preventDefault
      selectedElement = this
      clickPos.x = e.screenX
      clickPos.y = e.screenY
      false
    e

  newComparator = (cmp) ->
    e = document.createElement('span')
    $(e).html(cmp)
    $(e).addClass('element')
    $(e).addClass('comparator')
    $(e).insertAfter(activeStatement.parentNode)
    
    $(e).mousedown (e) ->
      this.preventDefault
      selectedElement = this
      clickPos.x = e.screenX
      clickPos.y = e.screenY
      false
    e

    activeStatement = newStatement()
    currElement = null

  newStatement = () ->
    container = document.createElement('span')
    $(container).addClass('statement-container')
    
    statement = document.createElement('div')
    $(statement).addClass('statement')

    evl = document.createElement('div')
    $(evl).addClass('eval')

    $(statement).appendTo(container)
    $(evl).appendTo(container)

    $(container).appendTo(activeStatement.parentNode.parentNode)

    return statement

  newComment = () ->
    e = document.createElement('span')
    $(e).addClass('element')
    $(e).addClass('comment')
    $(e).appendTo(activeStatement)
    
    $(e).mousedown (e) ->
      this.preventDefault
      selectedElement = this
      clickPos.x = e.screenX
      clickPos.y = e.screenY
      false
    e

  clearStatementProblems = (statement) ->
    $(statement).removeClass('error')

  statementProblem = (statement) ->
    # TODO: Add more Params
    $(statement).addClass('error')

  getEquationTokensForStatement = (statement) ->
    eqnString = ""
    for e in $(statement).children()
      if $(e).hasClass('element') and !$(e).hasClass('comment')
        eqnString += $(e).html() + ' '
    tokens = eqnString.tokens()
    lastToken = null
    eqnTokens = []
    for t in tokens
      if lastToken? and lastToken.type == 'operator' and t.type == 'number' and lastToken.value == '-'
        if (eqnTokens.length > 1 and eqnTokens[eqnTokens.length - 2].type == 'operator') or
           eqnTokens.length == 1 
            eqnTokens.pop()
            t.value = '-' + t.value
      if t.type != 'name'
        eqnTokens.push(t)
        lastToken = t
    return eqnTokens

  evaluateSolution = (tokens) ->
    eqnString = ""
    for t in tokens
      eqnString += t.value + ' ' if t.type != 'name'
    e = eval(eqnString) 
    return e if e?
    return ''

  updateEvaluationForStatement = (statement) ->
    # TODO: When raising error, pass elements, not tokens to error function
    err = false
    clearStatementProblems(statement)
    tokens = getEquationTokensForStatement(statement)
    if tokens.length > 0
      lastNonComment = null
      lastToken = null      
      for t in tokens
        if t.type != 'name' # Equivalent to comment for now
          if !lastNonComment 
            if t.type == 'operator'
              # Invalid eqn
              # statements can't start with an operator
              console.log("statements can't start with an operator")
              statementProblem(statement, t, 'A Number is Missing')
              err = true 
          else 
            if lastNonComment.type == 'operator' and t.type == 'operator'
              # Invalid eqn
              # statements can't have two operators without a number between them
              console.log("statements can't have two operators without a number between them")
              statementProblem(statement, lastNonComment, lastToken, t, 'A Number is Missing')
              err = true            
            else if lastNonComment.type == 'number' and t.type == 'number'
              # Invalid eqn
              # statements can't have two numbers without an operator between them
              console.log("statements can't have two numbers without an operator between them")
              statementProblem(statement, lastNonComment, lastToken, t, 'An Operator is Missing')
              err = true
          lastNonComment = t
        lastToken = t
      if lastNonComment.type == 'operator'
        # Invalid eqn
        # statements can't end with operators
        console.log("statements can't end with operators")
        statementProblem(statement, lastNonComment, 'A Number is Missing')
        err = true

    res = null
    if !err
      res = evaluateSolution(tokens)
      $(statement).siblings('.eval').html(res)
      console.log('no error')
    else
      $(statement).siblings('.eval').html('!')
    return res    

  updateComp = () ->
    updateEvaluationForStatement(activeStatement)

