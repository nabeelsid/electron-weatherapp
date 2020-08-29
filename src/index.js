const electron = require("electron");
const path = require("path");
const BrowserWindow = electron.remote.BrowserWindow;
let list = document.querySelectorAll("#city");
let cityList = [];
let curtmp;

//function to add a new city to list
function addCity(cityName, position) {
  cityList.push(cityName);
  const div = document.createElement("div");
  div.className = "box";
  div.innerHTML =
    `<h1 id="city">` +
    cityName +
    `<span class="currentTemp" id="currentTemp` +
    position +
    `">Loading..</span></h1>
    <span id="min` +
    position +
    `" class="min">Min: 19 C</span> <span id="max` +
    position +
    `" class="max">Max: 26 C</span>`;
  document.body.appendChild(div);
}

//iterate over each one in the list and extract the city name
for (i = 0; i < list.length; i++) {
  let city = list[i].textContent;
  let stringSplit = city.split(" ");
  cityList[i] = stringSplit;
  console.log(stringSplit[0]);
}

addCity("Mississauga", 0);
addCity("Toronto", 1);
addCity("Dubai", 2);
addCity("Mumbai", 3);
addCity("Los Angeles", 4);

//getJSON function
var getJSON = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

//a function that takes city name and position it is at in the html document
function getData(cityName, position) {
  var myURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=94f833994ddbbc5e6c563669a6ea5bb4";

  //get data from JSON response
  getJSON(myURL, function (err, data) {
    if (err !== null) {
      alert("Something went wrong: " + err);
    } else {
      curtmp = Math.round(data.main["temp"] - 273.0);
      mintmp = Math.round(data.main["temp_min"] - 273);
      maxtmp = Math.round(data.main["temp_max"] - 273);
      document.getElementById("currentTemp" + position).innerText =
        curtmp + String.fromCharCode(176) + "c";
      document.getElementById("min" + position).innerText =
        "Min: " + mintmp + String.fromCharCode(176) + "c";
      document.getElementById("max" + position).innerText =
        "Max: " + maxtmp + String.fromCharCode(176) + "c";
    }
  });
}

//go through all of the city list and call getData function on each on of them
for (i = 0; i < cityList.length; i++) {
  getData(cityList[i], i);
}

document.getElementById("addButton").addEventListener("click", function () {
  console.log("clicked");
  var inputfield = document.getElementById("cityInput");
  inputfield.style.visibility='visible';
  inputfield.addEventListener("keypress", function(e){

    if(e.key === 'Enter'){

      addCity(inputfield.value, 5);
      getData(inputfield.value,5);
      // console.log(inputfield.value);
      inputfield.style.visibility='hidden';
      // console.log("enter pressed");
    }
    
  })
});

// document.getElementById("addButton").addEventListener("click", function () {
//   console.log("clicked");
//   const modalPath = path.join("file://", __dirname, "add.html");
//   let win = new BrowserWindow({
//     frame: true,
//     width: 400,
//     height: 200,
//     webPreferences: {
//       enableRemoteModule: true,
//     },
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });
//   // win.webContents.openDevTools();
//   win.on("close", function () {
//     win = null;
//   });
//   win.loadURL(modalPath);
//   win.show();
// });