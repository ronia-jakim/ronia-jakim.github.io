function handle_zadanie(iid) {
  var zad_div = document.getElementById(iid+"-div");
  var zad_btn = document.getElementById(iid+"-btn");

  if (zad_div.style.display == "block") {
    zad_div.style.display = "none";
  }
  else {
    zad_div.style.display = "block";
  }
  zad_btn.classList.toggle("rotate-90");
}
