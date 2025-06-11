
window.addEventListener('load', function() {

  var checkForPGN = function() {
    var pgnBlocks = document.body.getElementsByClassName('pgn')
    var windowsPGNBlocks = document.body.getElementsByClassName('language-pgn')
    if (pgnBlocks[0]) {
      main(pgnBlocks[0].innerHTML)
    } else if (windowsPGNBlocks[0]){
      main(windowsPGNBlocks[0].innerHTML)
    } else {
      showDocumentation()
    }
  }
  
  var getContents = function() {
    var documentCodeBlocks = document.body.getElementsByTagName('code')
    var contents = documentCodeBlocks[0].innerHTML
    return(contents)
  }
  
  var showDocumentation = function() {
    document.querySelector('body').innerHTML = '<p style="margin-top:15em; text-align: center;">Please use a file with a .pgn extension.</p><p style="text-align: center;">Visit <a href="https://ia.net/topics/chess-template-for-ia-writer">ia.net</a> for tips to get started.</p>';
  }
  
  var getMovesAsFENs = function(chessObj) {
    var moves = chessObj.history()
    var newGame = new Chess()
    var fens = []
    var movelist = []
    var comments = []
    for (var i = 0; i < moves.length; i++) {
      newGame.move(moves[i])
      movelist.push(moves[i])
      comments.push(newGame.getComments())
      fens.push(newGame.fen())
    }
    const moveMap = new Map()
    moveMap.set('fens', fens)
    moveMap.set('movelist', movelist)
    moveMap.set('comments', comments)
    return moveMap;
  }
  
  // Movelist for web
  var composeAllMoves = function(moves, gameresult, target) {
    var movelistHTML = ""
    for (var i = 0; i < moves.length; i++) {
      if (i % 2 == 0) {
        movelistHTML = movelistHTML + '<span class="move-number">' + [(i / 2) + 1] + '.</span><span><span class="clickable-move" style="cursor: pointer;" id="' + [i] + '">' + moves[i] + '</span></span>'
        
      } else {
        movelistHTML = movelistHTML + '<span><span class="clickable-move" style="cursor: pointer;" id="' + [i] + '">' + moves[i] + '</span></span>'
      }
    }
    movelistHTML = movelistHTML + '<span id="game-result">' + gameresult + '</span>'
    document.getElementById(target).innerHTML = movelistHTML
  }
  
  // Movelist for PDF
  var composeAllPrintedMoves = function(movelist, moves, comments, gameresult, target) {
    var movelistHTML = "<p>"
    if (comments.length > 0){
      if ('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' == comments[0].fen) {
      movelistHTML = movelistHTML + comments[0].comment + '</p><p>'
      }  
    }
    
    // Build the HTML
    for (var i = 0; i < movelist.length; i++) {
      if (i % 2 == 0) {
        // print white moves
        if (i == movelist.length - 1) {
          movelistHTML = movelistHTML + [(i / 2) + 1] + '. ' + movelist[i] + ' ' + gameresult
          // check for comments
          if (comments.length > 1) {
            for (var j = 0; j < comments.length; j++) {
              if (moves[i] == comments[j].fen){
                movelistHTML = movelistHTML + '</p><div class="board-and-comment-wrapper"><div id="commentboard' + j + '" style="width: 120px"></div><p class="pdfcomment" >' + comments[j].comment + '</p></div><p>' 
              }
            }
          }
        } else {
          movelistHTML = movelistHTML + [(i / 2) + 1] + '. ' + movelist[i] + ' '
          // check for comments
          if (comments.length > 1) {
            for (var j = 0; j < comments.length; j++) {
              if (moves[i] == comments[j].fen){
                movelistHTML = movelistHTML + '</p><div class="board-and-comment-wrapper"><div id="commentboard' + j + '" style="width: 120px"></div><p class="pdfcomment" >' + comments[j].comment + '</p></div><p>' + [(i / 2) + 1] + '. ..'
              }
            }
          }
        }
      } else {
        // print black moves
        if (i == movelist.length - 1) {
          movelistHTML = movelistHTML + movelist[i] + ' ' + gameresult
          // check for comments
          if (comments.length > 1) {
            for (var j = 0; j < comments.length; j++) {
              if (moves[i] == comments[j].fen){
                movelistHTML = movelistHTML + '</p><div class="board-and-comment-wrapper"><div id="commentboard' + j + '" style="width: 120px"></div><p class="pdfcomment" >' + comments[j].comment + '</p></div><p>'
              }
            }
          }
        } else {
          movelistHTML = movelistHTML + movelist[i] + ' '  
          // check for comments
          if (comments.length > 1) {
            for (var j = 0; j < comments.length; j++) {
              if (moves[i] == comments[j].fen){
                movelistHTML = movelistHTML + '</p><div class="board-and-comment-wrapper"><div id="commentboard' + j + '" style="width: 120px"></div><p class="pdfcomment" >' + comments[j].comment + '</p></div><p>'  
              }
            }
          }
        }
      }
      
    }
    movelistHTML = movelistHTML + '</p>'
    document.getElementById(target).innerHTML = movelistHTML
    
    // Instantiate the comment boards
    for (var i = 0; i < movelist.length; i++) {
      // check for comments
      if (comments.length > 1) {
        for (var j = 0; j < comments.length; j++) {
          if (moves[i] == comments[j].fen){
            var commentboard = 'commentboard' + j
            Chessboard(commentboard, {position: moves[i], showNotation: false})
          }
        }
      }
    }
   
  }
  
  var updateMovePostionInList = function (moveInList) {
    // Get all the elements with the 'clickable-move' class
    const items = document.querySelectorAll(".clickable-move");

    // Reset the 'data-selected' attribute for all clickable moves
    items.forEach(function(item) {
      item.removeAttribute("data-selected"); // Remove the 'data-selected' attribute
    });

    if (moveInList != -1) {
      // Set the 'data-selected' attribute for the clicked move
      moveInList.setAttribute("data-selected", "true"); // Add the 'data-selected' attribute
    }
  }

  
  var updateFirstComment = function(comments){
    if ('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' == comments[0].fen) {
      document.getElementById('webcomments').innerHTML = '<p>' + comments[0].comment + '</p>'
    }
  }
  
  var updateComments = function(moves, currentMove, comments) {
    var commentFound = false
    for (var i = 0; i < comments.length; i++) {
      if (moves[currentMove] == comments[i].fen ){
        document.getElementById('webcomments').innerHTML = '<p>' + comments[i].comment + '</p>'
        commentFound = true
      } 
    }
    if (!commentFound){
      document.getElementById('webcomments').innerHTML = ''  
    }
  }
  
  var scrollToBottom = function(id) {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  }
  
  var scrollToTop = function(id) {
    const element = document.getElementById(id);
    element.scrollTop = 0;  // Scrolls to the top
  }
  
  var centerMoveInScroller = function(id, mobileBreakpoint) {
    if (window.innerWidth > mobileBreakpoint){
      const element = document.getElementById(id); // Get the selected move element
      const scroller = document.getElementById("scroller"); // Get the scroller container
  
      // Get the position of the selected element relative to the scroller
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
  
      // Calculate the scroll position to center the element
      const scrollerHeight = scroller.clientHeight;
      const scrollPosition = elementTop - (scrollerHeight / 2) - (elementHeight * 5);
  
      // Scroll the scroller to the calculated position
      scroller.scrollTop = scrollPosition;
    } else {
        // Get the selected move element and webmovelist container (for horizontal scroll)
        const element = document.getElementById(id);
        const webmovelist = document.getElementById("webmovelist");
  
        // Get the position and size of the selected element
        const elementLeft = element.offsetLeft; // Horizontal position of the element
        const elementWidth = element.offsetWidth; // Width of the element
  
        // Get the width of the webmovelist container
        const webmovelistWidth = webmovelist.clientWidth;
  
        // Calculate the horizontal scroll position to center the element
        const scrollPosition = elementLeft - (webmovelistWidth / 2) + (elementWidth / 2);
  
        // Scroll the webmovelist horizontally to center the element
        webmovelist.scrollLeft = scrollPosition;
    }
  }
  
  var depressButton = function(buttonId) {
    var button = document.getElementById(buttonId);
    button.classList.add('depressed');
    button.click()
    setTimeout(function() {
      button.classList.remove('depressed');
    }, 50);
  }
  
  var playMoveSound = function() {
    var buttonSound = document.getElementById('btnSound');

    if (!buttonSound.paused) {
      buttonSound.pause();
      buttonSound.currentTime = 0;
    }

    buttonSound.play().catch(function(error) {
      console.error("Error playing sound:", error);
    });
  }
  
  var getRandomEvenInt = function(min, max) {
    
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
  
    
    let randomNum = Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
  
    // Adjust the result to be even
    if (randomNum % 2 != 0) {
      randomNum++;  
    }
    return randomNum;
  }
  
  var resizeMoves = function(mobileBreakpoint) {
    if (window.innerWidth > mobileBreakpoint){
      // Set Moves box height same as chessboard
      var chessboardHeight = document.getElementById('webboard').offsetHeight
      var scrollerElement = document.getElementById('scroller')
      scrollerElement.style.height = chessboardHeight + 'px'
    } else {
      var scrollerElement = document.getElementById('scroller')
      scrollerElement.style.height = '40px'
    }
    
  }
  
  var main = function(contents) {
    // Grab editor content
    var pgnContents = contents
    
    // Create chess object and load in the moves
    let chessObj = new Chess()
    chessObj.loadPgn(pgnContents)
    var moveMap = getMovesAsFENs(chessObj)
    var moves = moveMap.get('fens')
    var movelist = moveMap.get('movelist')
    var comments = chessObj.getComments()
    var currentMove = -1
    var pdfHero = getRandomEvenInt(5,10)
    var pdfHeroMove = pdfHero / 2 + 1
    var mobileBreakpoint = 580;
    
    
    if ('Result' in chessObj.header()) {
      const gameresult = chessObj.header().Result;
    } else {
      var gameresult = '';
    }
    
    // Replace HTML with our UI
    document.body.innerHTML = `
      <div id="webview">
        <h1 id="event"></h1>
        <h1 id="date"></h1>
        <div id="overview">
          <div id="boardandplayers">
            <h2 id="blackplayername"></h2>
            <div id="webboard"></div>
            <h2 id="whiteplayername"></h2>
          </div>
          <div id="printedmoves">
            <h2 id="moveslabel">Moves</h2>
            <div id="movesandbuttons">
              <div id="scroller">
                <div id="webmovelist"></div>
              </div>                
              <button id="flipBtn">Flip</button>              
              <button id="prevBtn">Previous</button>
              <button id="nextBtn">Next</button>
            </div>
          </div>
        </div>
        
        <div id="webcomments"></div>
      </div>
      <audio id="btnSound" src="Move.mp3"></audio>
      <div id="printview">
        
        <h1 id="event-pdf"></h1>
        <h2 id="players-pdf"></h2>          
        <h2 id="date-pdf"></h2>
        
        <div id="printboard1" style="width: 200px"></div>
        <p style="text-align: center">
          Position after ${pdfHeroMove}. ${movelist[pdfHero]}
        </p>
        <div id="pdfmovelist"></div>
      </div>
    `;
  
    
    // Set our web chessboard and movelist widths and heights based on window
    var webboard = Chessboard('webboard', {position: "start", showNotation: false})
    webboard.resize();
    resizeMoves(mobileBreakpoint)
    
    // Write out the movelist & comments
    composeAllMoves(movelist, gameresult, 'webmovelist')
    if (comments.length > 0){
      updateFirstComment(comments)  
    }
    
    
    // Listen for changes to window size and readjust our chessboard and movelist accordingly
    window.addEventListener('resize', function() {
      webboard.resize()
      resizeMoves(mobileBreakpoint)
    })
    
    // Listen for clicks on the movelist
    document.getElementById("webmovelist").addEventListener("click", function(event) {
      // Check if the clicked target has the 'clickable' class
      if (event.target && event.target.classList.contains("clickable-move")) {
        // Update List
        updateMovePostionInList(event.target)
        centerMoveInScroller(event.target.id, mobileBreakpoint)
        // Update board position
        let moveNumber = event.target.id
        webboard = Chessboard('webboard', {position: moves[moveNumber], showNotation: false})
        resizeMoves(mobileBreakpoint)
        currentMove = moveNumber
        updateComments(moves, currentMove, comments)
      }
    });
    
    
    // Populate metadata
    if ('Event' in chessObj.header()) {
      const event = chessObj.header().Event;
      document.getElementById('event').innerHTML = event;
      document.getElementById('event-pdf').innerHTML = event;
    }

    if ('Date' in chessObj.header()) {
      const date = chessObj.header().Date;
      document.getElementById('date').innerHTML = date;
      document.getElementById('date-pdf').innerHTML = date;
    }

    if ('Event' in chessObj.header() && 'Round' in chessObj.header()) {
      const event = chessObj.header().Event;
      const round = chessObj.header().Round;
      document.getElementById('event').innerHTML = event + ' — Round ' + round;
      document.getElementById('event-pdf').innerHTML = event + ' — Round ' + round;
    }

    if ('White' in chessObj.header() && 'Black' in chessObj.header()) {
      const whitePlayer = chessObj.header().White;
      const blackPlayer = chessObj.header().Black;
      document.getElementById('whiteplayername').innerHTML = whitePlayer;
      document.getElementById('blackplayername').innerHTML = blackPlayer;
      document.getElementById('players-pdf').innerHTML = whitePlayer + ' - ' + blackPlayer;
    }

    if ('ChapterName' in chessObj.header()) {
      const chapterName = chessObj.header().ChapterName;
      document.getElementById('players-pdf').innerHTML = chapterName;
    }


    
    
    
    // Setup PDF
    var printboard1 = Chessboard('printboard1', {position: moves[pdfHero], showNotation: false})
    composeAllPrintedMoves(movelist, moves, comments, gameresult, 'pdfmovelist')
    
    // Map our buttons
    $('#flipBtn').on('click', function () {
      webboard.flip()
      let swapname = document.getElementById('whiteplayername').innerHTML
      document.getElementById('whiteplayername').innerHTML = document.getElementById('blackplayername').innerHTML
      document.getElementById('blackplayername').innerHTML = swapname
    })
    
    $('#prevBtn').on('click', function () {
      
      if (currentMove == 0 || currentMove == -1 ) {
        currentMove = -1
        webboard.start()
        updateMovePostionInList(currentMove)
      } else {
        //playMoveSound()
        currentMove--
        webboard.position(moves[currentMove])  
        let moveInList = document.getElementById(currentMove)
        updateMovePostionInList(moveInList)
        centerMoveInScroller(moveInList.id, mobileBreakpoint)
      }
      updateComments(moves, currentMove, comments)
    })
    $('#nextBtn').on('click', function () {
      if (!(currentMove == moves.length - 1)) {
        //playMoveSound()
        currentMove++
        webboard.position(moves[currentMove]) 
        let moveInList = document.getElementById(currentMove)
        updateMovePostionInList(moveInList)
        centerMoveInScroller(moveInList.id, mobileBreakpoint)
        updateComments(moves, currentMove, comments)
      }
    })
    
    
    // Left and Right Arrow buttons can also be used to control the Previous and Next Buttons
    function handleKeyDown(event) {
      // Get the key code of the pressed key
      var keyCode = event.keyCode;
      
      // Check if the left arrow key was pressed (keyCode 37)
      if (keyCode === 37) {
        event.preventDefault();
        if (currentMove == 0 || currentMove == -1 ) {
        currentMove = -1
        webboard.start()
        updateMovePostionInList(currentMove)
      } else {
        //playMoveSound()
        currentMove--
        webboard.position(moves[currentMove])  
        let moveInList = document.getElementById(currentMove)
        updateMovePostionInList(moveInList)
        centerMoveInScroller(moveInList.id, mobileBreakpoint)
      }
      updateComments(moves, currentMove, comments)
      }
      
      // Check if the right arrow key was pressed (keyCode 39)
      if (keyCode === 39) {
        event.preventDefault();
        if (!(currentMove == moves.length - 1)) {
          //playMoveSound()
          currentMove++
          webboard.position(moves[currentMove]) 
          let moveInList = document.getElementById(currentMove)
          updateMovePostionInList(moveInList)
          centerMoveInScroller(moveInList.id, mobileBreakpoint)
          updateComments(moves, currentMove, comments)
        }
      }
    }
  
    // Add event listener to the document for the keydown event
    document.addEventListener("keydown", handleKeyDown);
    
  }
  
  
  document.body.addEventListener('ia-writer-change', function() {
    checkForPGN()    
  })
})

