goalArray = ["lines_cleared", "single", "double", "triple", "tetris", "tspin", "tspin_single", "tspin_double", "tspin_triple", "b2b", "pc", "combo"]
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var userData = JSON.parse(localStorage.getItem('userData'));
document.getElementById("gameCode").setAttribute("difficulty", urlParams.get("difficulty"))
document.getElementById("gameCode").setAttribute("setup", urlParams.get("setup"))
document.getElementById("title").innerHTML = urlParams.get("setup")
var controls = localStorage.getItem("controls");
controls = JSON.parse(controls);
if (controls["restart"][1] === " ") {
  document.getElementById("restartKey").innerHTML =  "Space";
} else {
  document.getElementById("restartKey").innerHTML = controls["restart"][1]
}



function deletePuzzle() {
  var password = prompt("Please enter the password");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var http = new XMLHttpRequest();
  http.open("POST", "delete.php", true);
  http.setRequestHeader('Content-Type', 'application/json');
    http.addEventListener('load', function() {
  if (http.status === 200) {
    // The request was successful, and you can access the response here
    var response = http.responseText;
    Swal.fire(response);
    // Do something with jsonResponse
  } else {
    // The request failed; handle the error here
    Swal.fire('Request failed with status: ' + http.status);
  }
});
  http.send(JSON.stringify({
      "difficulty": urlParams.get("difficulty"),
      "setup": urlParams.get("setup"),
      "password": password
  }));
}