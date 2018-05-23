$(document).ready(function() {
    $('#codin').click(function() {
        $('.card').fadeOut();
        $('.code').fadeIn();
    });
    $('#writin').click(function() {
        $('.card').fadeOut();
        $('.write').fadeIn();
    });
    $('#musin').click(function() {
        $('.card').fadeOut();
        $('.music').fadeIn();
    });
    $('#meme').click(function() {
      $('.card').fadeOut();
      $('.meme').fadeIn();
    });
    $('#all').click(function() {
        $('.card').fadeIn();
    });
});
