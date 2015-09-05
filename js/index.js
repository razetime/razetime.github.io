var main = function () {
    $('.jumbotron .container').hide();
	$('.jumbotron h1').animate({
		paddingLeft: "0px"
	},1000)
    $('.jumbotron .container').fadeIn(1000);
    
    /* Push the body and the nav over by 285px over */
    $('.icon-menu').click(function () {
        $(this).addClass("disabled");
        
        $('.menu').animate({
            left: "0px"
        }, 200);

        $('body').animate({
            left: "285px"
        }, 200);
    });

    /* Then push them back */
    $('.icon-close').click(function () {
        $('.icon-menu').removeClass("disabled");

        $('.menu').animate({
            left: "-285px"
        }, 200);

        $('body').animate({
            left: "0px"
        }, 200);
    });
    $('.jumbotron a.btn-floating').smoothScroll();

};




$(document).ready(main);
