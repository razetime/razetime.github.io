$(document).ready(function() {
    // Initialize collapse button
    $(".button-collapse").sideNav();
})

$(window).scroll(function(){
    $(".fadescroll").css("opacity", 1 - $(window).scrollTop() / 250);
  });
