$('#loader').show();

$(document).ready(function() {
    // Initialize collapse button
    $(".button-collapse").sideNav();
    $('.scrollspy').scrollSpy();
})

$(window).scroll(function(){
    $(".fadescroll").css("opacity", 1 - $(window).scrollTop() / 750);
  });

$(window).on('load', function() {
    $('#loader').hide();
})
