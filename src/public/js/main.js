document.addEventListener("DOMContentLoaded", () => {
  // Find the button and the links menu
  const navbarToggle = document.querySelector("#navbarToggle");
  const navbarLinks = document.querySelector("#navbarLinks");

  // Add a click event listener to the button
  if (navbarToggle) {
    navbarToggle.addEventListener("click", () => {
      // Toggle the .active class on the links menu
      navbarLinks.classList.toggle("active");
    });
  }
});
