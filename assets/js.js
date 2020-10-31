$("#home").click(function() {
    $('html, body').animate({
        scrollTop: $("#intro").offset().top
    }, 2300);
});



$("#services").click(function() {
    $('html, body').animate({
        scrollTop: $("#service").offset().top
    }, 2300);
});


$("#blog").click(function() {
    $('html, body').animate({
        scrollTop: $("#footer").offset().top
    }, 2300);
});


$("#contact27").click(function() {
    $('html, body').animate({
        scrollTop: $("#cucum").offset().top
    }, 2300);
});





$(document).ready(function() {

    $('.search').each(function() {
        var self = $(this);
        var div = self.children('div');
        var placeholder = div.children('input').attr('placeholder');
        var placeholderArr = placeholder.split(/ +/);
        if(placeholderArr.length) {
            var spans = $('<div />');
            $.each(placeholderArr, function(index, value) {
                spans.append($('<span />').html(value + '&nbsp;'));
            });
            div.append(spans);
        }
        self.click(function() {
            self.addClass('open');
            setTimeout(function() {
                self.find('input').focus();
            }, 750);
        });
        $(document).click(function(e) {
            if(!$(e.target).is(self) && !jQuery.contains(self[0], e.target)) {
                self.removeClass('open');
            }
        });
    });

});


