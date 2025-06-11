window.addEventListener('load', function() {
  
  var checkForFountain = function() {
    var fountainBlocks = document.body.getElementsByClassName('fountain')
    var windowsFountainBlocks = document.body.getElementsByClassName('language-fountain')
    if (fountainBlocks[0]) {
      parseFountain(fountainBlocks[0].innerHTML);
    } else if (windowsFountainBlocks[0]){
      parseFountain(windowsFountainBlocks[0].innerHTML);
    } else {
      showDocumentation(); 
    }
  }
  
  var getContents = function() {
    var documentCodeBlocks = document.body.getElementsByTagName('code')
    var contents = documentCodeBlocks[0].innerHTML
    return(contents)
  }
  
  var parseFountain = function(contents) {
    var parsedFountain = fountain.parse(contents);
    document.querySelector('body').innerHTML = '<div class="title-page">' + parsedFountain.html.title_page + '</div><div style="page-break-before: always;"></div>' + parsedFountain.html.script;
  }
  
  var showDocumentation = function() {
    document.querySelector('body').innerHTML = '<p style="margin-top:15em; text-align: center;">Please use a file with a .fountain extension.</p><p style="text-align: center;">Visit <a href="https://ia.net/topics/ia-writer-screenplay-template">ia.net</a> for tips to get started.</p>';
  }
  
  document.body.addEventListener('ia-writer-change', function() {
    checkForFountain();
  })
})