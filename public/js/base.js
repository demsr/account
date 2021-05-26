document.getElementById("btn-toggle-nav").addEventListener("click", toggleNav);

function toggleNav() {
  let header = document.getElementsByTagName("header")[0];
  header.classList.toggle("Details--on");
}
