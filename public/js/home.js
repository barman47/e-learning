$(document).ready(function () {

        $('.pushpin').pushpin({
            top: $('.pushpin').offset().top,
            
        });
        $('.sidenav').sidenav();
        $('.dropdown-trigger').dropdown({hover: true});
        $('.parallax').parallax();
        $('.collapsible').collapsible();
//     window.onscroll = function () {
//         stick();
//     }

//     var navbar = document.getElementById('menu');
//     var sticky = navbar.offsetTop;

//     function stick () {
//         if (window.pageYOffset >= sticky) {
//             navbar.classList.add('sticky');
//         } else {
//             navbar.classList.remove('sticky');
//         }
//     } 
});