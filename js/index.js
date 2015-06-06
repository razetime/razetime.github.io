var main = function() {
  /* Push the body and the nav over by 285px over */
  $('.icon-menu').click(function() {
      if($('.menu').css("left", "285px") && $('body').css("left", "0px")) {
        $('.menu').animate({
          left: "0px"
        }, 200);

        $('body').animate({
          left: "285px"
        }, 200);
      }
      $('.menu').animate({
            left: "-285px"
          }, 200);

      $('body').animate({
            left: "0px"
          }, 200);
  });

  /* Then push them back */
  $('.icon-close').click(function() {
    $('.menu').animate({
      left: "-285px"
    }, 200);

    $('body').animate({
      left: "0px"
    }, 200);
  });
};


$(document).ready(main);
