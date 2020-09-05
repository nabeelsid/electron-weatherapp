const electron = require("electron");
const path = require("path");
const BrowserWindow = electron.remote.BrowserWindow;
let list = document.querySelectorAll("#city");
let inputfield = document.getElementById("cityInput");
let initialText = document.getElementById("first-start");
let cityList = [];
let curtmp;
let skyCondition;
let cityCount = 0;
let firstRun = true;

//function to make first letter uppercase
function stringNormalize(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
      if (op <= 0.1){
          clearInterval(timer);
          element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= op * 0.1;
  }, 50);
}

function unfade(element) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
      if (op >= 1){
          clearInterval(timer);
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op += op * 0.1;
  }, 10);
}
unfade(initialText);

//function to add a new city to list
function addCity(cityName, position) {
  cityList.push(cityName);
  const div = document.createElement("div");
  div.className = "box";
  div.style.opacity = 0.1
  div.innerHTML =
    `<h1 id="city">` +
    stringNormalize(cityName) + `<img class="graphic" id="skyCondition` +position + `" src="../assets/images/question.svg" alt=""></img>` + 
    `<span class="currentTemp" id="currentTemp` +
    position +
    `"> </span></h1>
    <span id="min` +
    position +
    `" class="min">Min: </span> <span id="max` +
    position +
    `" class="max">Max: </span>`;
  document.body.appendChild(div);
  
  unfade(div);
  cityCount++;
  console.log("im called!")
}

//iterate over each one in the list and extract the city name
for (i = 0; i < list.length; i++) {
  let city = list[i].textContent;
  let stringSplit = city.split(" ");
  cityList[i] = stringSplit;
  console.log(stringSplit[0]);
}

//getJSON function
function getJSON(url, callback) {
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
  }
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
      console.log(data.weather[0].main);
      skyCondition = data.weather[0].main;
      curtmp = Math.round(data.main["temp"] - 273.0);
      mintmp = Math.round(data.main["temp_min"] - 273);
      maxtmp = Math.round(data.main["temp_max"] - 273);
      document.getElementById("currentTemp" + position).innerText = 
        curtmp + String.fromCharCode(176) + "c";

      document.getElementById("min" + position).innerText =
        "Min: " + mintmp + String.fromCharCode(176) + "c";

      document.getElementById("max" + position).innerText =
        "Max: " + maxtmp + String.fromCharCode(176) + "c";
      if(skyCondition === "Clouds"){
        document.getElementById("skyCondition" + position).src = "../assets/images/clouds.svg";
      }
      else if(skyCondition === "Haze" || skyCondition === "Fog" || skyCondition === "Smog"){
        document.getElementById("skyCondition" + position).src = "../assets/images/haze-fog-smog.svg";
      }
      else if(skyCondition === "Partly Cloudy"){
        document.getElementById("skyCondition" + position).src = "../assets/images/partly-cloudy.svg";
      }
      else if(skyCondition === "Clear"){
        document.getElementById("skyCondition" + position).src = "../assets/images/clear.svg";
      }
      else if(skyCondition === "Rain"){
        document.getElementById("skyCondition" + position).src = "../assets/images/snow.svg";
      }
      else if(skyCondition === "Snow"){
        document.getElementById("skyCondition" + position).src = "../assets/images/snow.svg";
      }
    }
  });
}

document.getElementById("addButton").addEventListener("click", function () {

  console.log("clicked");
  unfade(inputfield);
  inputfield.style.visibility='visible';
  inputfield.focus();
});

inputfield.addEventListener("keydown", function(e){
  if(e.key === 'Enter'){
    if(firstRun){
      initialText.remove();
      firstRun = false;
    }
    addCity(inputfield.value, cityCount);
    getData(inputfield.value, cityCount-1);
    fade(inputfield);
    // inputfield.style.visibility='hidden';
    inputfield.value = '';
  }
});

function updateWeather(){
  // go through all of the city list and call getData function on each on of them
  for (i = 0; i < cityList.length; i++) {
    getData(cityList[i], i);
  }
}

setTimeout(updateWeather, 60000);
