// Navbar Toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Toggle menu and animate bars
menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open");
});

// Close when clicking outside
document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");
    }
});

// Optional: Navbar scroll color effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("scrolled", window.scrollY > 50);
});


// document.addEventListener("DOMContentLoaded", function () {
//     const menuToggle = document.getElementById("menu-toggle");
//     const navLinks = document.getElementById("nav-links");

//     menuToggle.addEventListener("click", function () {
//         menuToggle.classList.toggle("open");
//         navLinks.classList.toggle("active");
//     });
// });
