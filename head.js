var today = new Date()
var curHr = today.getHours()
var time = null;

if (curHr < 12) {
  var time = "Morning";
} else if (curHr < 18) {
  var time = "Afternoon";
} else {
  var time = "Evening";
}

document.getElementById("time").innerHTML = time;