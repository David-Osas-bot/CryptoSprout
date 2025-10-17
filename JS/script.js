// window.addEventListener("scroll", function() {
//   const header = document.getElementById("header");
//   header.classList.toggle("scrolled", window.scrollY > 50);
// });




// $('.logo-slider').slick({
//     slidesToShow: 5,
//     autoplay: true,
//     autoplaySpeed: 0,     // No pause between slides
//     speed: 2000,          // Takes 2 seconds to move
//     cssEase: 'linear',    // Continuous smooth scroll
//     arrows: false,
//     infinite: true
// });



// $(document).ready(function () {
//     // Initialize the slider WITHOUT autoplay
//     const $slider = $('.logo-slider').slick({
//         slidesToShow: 5,
//         autoplay: false,   // Turn off built-in autoplay
//         arrows: false,
//         infinite: true,
//     });

//     // Function to manually advance slide every X ms
//     function slideWithTimeout() {
//         setTimeout(function () {
//             $slider.slick('slickNext');  // Move to the next slide
//             slideWithTimeout();          // Repeat the process
//         }, 1000); // Change 1000 to your desired interval in ms
//     }

//     // Start the loop
//     slideWithTimeout();
// });
 