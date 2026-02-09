let shown = false;

document.getElementById("button").onclick = function () {
  let p = document.getElementById("text");

  if (shown) {
    p.innerHTML = "";
    p.style.backgroundColor = "";
  } else {
    p.innerHTML = "dont touch me!";
    p.style.backgroundColor = "red";
  }

  shown = !shown;
};
