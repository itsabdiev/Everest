var layer1 = document.getElementById('layer1');
var scroll = window.pageYOffset;
document.addEventListener('scroll', function(e){
  var offset = window.pageYOffset;
  scroll = offset;
  layer1.style.width = (100 + scroll/5) + '%'
});

var layer2 = document.getElementById('layer2');
var scroll = window.pageYOffset;
document.addEventListener('scroll', function(e){
  var offset = window.pageYOffset;
  scroll = offset;
  layer2.style.width = (100 + scroll/5) + '%';
  layer2.style.left = scroll/50 + '%'
});

var text = document.getElementById('text');
var scroll = window.pageYOffset;
document.addEventListener('scroll', function(e){
  var offset = window.pageYOffset;
  scroll = offset;
  text.style.top = -scroll/20 + '%'
})