/*Collapse*/

$("[data-collapse]").on("click",function(event) {
    event.preventDefault();
    
    var $this = $(this),
        blockId = $this.data('collapse');
    $this.toggleClass("active");
  
    
})

/*Smooth scroll*/
$("[data-scroll]").on("click",function(event) {
    event.preventDefault();
    
   var blockId = $(this).data('scroll'),
       blockOffset = $(blockId).offset().top;

    $("html,body").animate({
       scrollTop: blockOffset
    }, 500);
});