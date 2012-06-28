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
  activeStatement = $('#statement')
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

  deleteCurrElementAndBacktrack = () ->
    elementToDelete = currElement 
    currElement = currElement.previousSibling
    console.log(currElement)
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
          if $(currElement).hasClass('comment')
            v = $(currElement).html()
            if v.length > 1
              $(currElement).html(v.substring(0,v.length-1))
            else
              deleteCurrElementAndBacktrack()
          else if $(currElement).hasClass('number')
            deleteCurrElementAndBacktrack()
          else if $(currElement).hasClass('operator')
            deleteCurrElementAndBacktrack()

  $(window).keypress (e) ->
    if !e.metaKey and !e.ctrlKey and !e.altKey
      # Decimal numbers
      if (KEY_CODE['min_num'] <= e.which <= KEY_CODE['max_num']) and !e.shiftKey
        if !$(currElement).hasClass('number')
          currElement = newNumber()
        console.log('Plain Number')
        v = $(currElement).html() + (e.which - KEY_CODE['min_num'])
        $(currElement).html(v)

      else 

        operatorHelper = (op) ->
          if $(currElement).hasClass('number') or $(currElement).hasClass('comment') 
            currElement = newOperator(op)
          else if $(currElement).hasClass('operator')
            $(currElement).html(op)
        
        console.log(e.which)
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
          else
            console.log('Here we are again')
            console.log(e)
            if e.which != 0 and e.charCode != 0
              if !$(currElement).hasClass('comment')
                currElement = newComment()
              v = $(currElement).html() + String.fromCharCode(e.which)
              $(currElement).html(v)
  
  $(window).mousemove (e) ->
    #console.log('MOVING '+ e.button)
    if clickPos.x? and clickPos.y? and selectedElement? and $(selectedElement).hasClass('number')
      v = ((Number) $(selectedElement).html())
      d = Math.round((e.screenX - clickPos.x)) 
      $(selectedElement).html(d + v)
      clickPos.x = e.screenX
      clickPos.y = e.screenY

  $(window).mouseup (e) ->
    selectedElement = null

  newNumber = () ->
    e = document.createElement('span')
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
    $(e).addClass('operator')
    $(e).appendTo(activeStatement)
    
    $(e).mousedown (e) ->
      this.preventDefault
      selectedElement = this
      clickPos.x = e.screenX
      clickPos.y = e.screenY
      false
    e

  newComment = () ->
    e = document.createElement('span')
    $(e).addClass('comment')
    $(e).appendTo(activeStatement)
    
    $(e).mousedown (e) ->
      this.preventDefault
      selectedElement = this
      clickPos.x = e.screenX
      clickPos.y = e.screenY
      false
    e
