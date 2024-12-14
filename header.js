// Sticky Navbar bg

const header = () => {
  if(document.body.classList.contains("menu")) {
    const header = document.querySelector(".menu-header");
  
    window.addEventListener("scroll", () => {
      if(window.scrollY > 50) {
        header.classList.add("menu-header-sticky");
      }
      else {
        header.classList.remove("menu-header-sticky");
      }
    });
  } else {
      const header = document.querySelector(".header");
    
      window.addEventListener("scroll", () => {
        if(window.scrollY > 50) {
          header.classList.add("header-sticky");
        }
        else {
          header.classList.remove("header-sticky");
        }
      });
  }
}
  
export default header;