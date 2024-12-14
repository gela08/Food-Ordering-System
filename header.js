// Sticky Navbar Background
const header = document.querySelector(".header");
const tabs = document.querySelectorAll(".header__tab");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("header-sticky");
    } else {
        header.classList.remove("header-sticky");
    }
});

// Handle active tab state
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove("active"));

        // Add active class to the clicked tab
        tab.classList.add("active");
    });
});

// Hamburger Menu Toggle
function myFunction() {
    const tabContainer = document.querySelector(".header__tabs");
    tabContainer.classList.toggle("show");
}



