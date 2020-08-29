const electron = require('electron')
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const addBtn = document.getElementById('addBtn'); //id of the HTML tag that contains the new city name
const closeBtn = document.getElementById('closeBtn');


closeBtn.addEventListener('click', function(event){
    console.log("message from add");
    var window = remote.getCurrentWindow();
    window.close();
})

addBtn.addEventListener('click', function () {
    
  ipc.send('newCityName', document.getElementById('newCity').value);
  var window = remote.getCurrentWindow();
  window.close();
});

