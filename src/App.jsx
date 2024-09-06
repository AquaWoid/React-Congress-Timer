import { useState } from 'react'
import './App.css'
import { DatabaseID, CollectionID, DocumentID, databases, client} from '../lib/appwrite'
import { Client } from 'appwrite'


var count = 0
let counter = 0;

var timerSeconds = 0;
var timeRunningG = false;

let localTime = 60;

let isHosting = false;
let autoSyncOn = false;

let autoSyncSeconds = 10;

if(!localTime <= 0)
setInterval(timerLogic, 1000);

syncTime("client");

//Subscribe to Realtime Updates
client.subscribe(`databases.${DatabaseID}.collections.${CollectionID}.documents.${DocumentID}`, resp => {
  //console.log(resp);
    if(!isHosting)
    syncTime("client")

})

//Syncing time between all Clients
async function syncTime(userState){

  if(userState == "host") {
  databases.updateDocument(DatabaseID,CollectionID,DocumentID,{"Seconds":localTime})
  console.log("Synchronized time to Database");
  const time = new Date().toLocaleString()
  document.getElementById("globalValues").innerHTML = `Last Synced to DB: ${time}`;
  }

  if(userState == "client") {

    const timefromDB = (await getDBDoc()).sec;

    //console.log(timefromDB);
    if(localTime != timefromDB) {
      localTime = timefromDB;
      console.log("synchronized time from Database")
    }

  }

}

//Timer Calculations
async function timerLogic(){

  //const runStatus = await getDBDoc();
  
  console.log(autoSyncOn)

  console.log(counter);
  if(isHosting && counter == autoSyncSeconds && timeRunningG && autoSyncOn) {
    //console.log("Synced")
    syncTime("host")

  }
  if(counter > autoSyncSeconds)
    counter = 0;

  counter++


  const Mins = Math.floor(localTime / 60);
  let Secs = localTime % 60;

 // if(!time <= 0)
  if(timeRunningG)
  localTime--;
  


  document.getElementById("timertext").innerHTML = `${Mins}:${Secs}`;
  document.getElementById("timerTotal").innerHTML = `Total: ${localTime} Autsync Time ${autoSyncSeconds}`;
  //document.getElementById("globalValues").innerHTML = `timeRunningG: ${timeRunningG} Is Hosting: ${isHosting}`;
}

//Get Data from Database Document
async function getDBDoc() {

  count++;
 
  const result = await databases.listDocuments(DatabaseID,CollectionID);

  //const minutes = result.documents[0].Minutes;
  const seconds = result.documents[0].Seconds;
  const timeRunning = result.documents[0].TimeRunning;

  //timerMinutes = result.documents[0].Minutes;
  timerSeconds = result.documents[0].Seconds;
  timeRunningG = result.documents[0].TimeRunning;

  return {
    sec : seconds,
    tr : timeRunning
  }

}

//Adds time to the Database
function addTimeToDB(value) {
  localTime += value
  syncTime("host")
}


//Start Timer
function toggleStart() {
  timeRunningG = true;
  syncTime("host");
  databases.updateDocument(DatabaseID,CollectionID,DocumentID,{"TimeRunning":true})

}

//Stop Timer
function toggleStop() {
  timeRunningG = false;
  syncTime("host");
  databases.updateDocument(DatabaseID,CollectionID,DocumentID,{"TimeRunning":false})

}

const toggleAutoSync = (isChecked) => {

  autoSyncSeconds = parseInt(document.getElementById("autoSyncInput").value)

  autoSyncOn = isChecked;
  console.log(isChecked);
  //console.log("toggled auto sync with code: " + document.getElementById("autoSyncInput").checked)
  //autoSyncOn = document.getElementById("autoSyncInput").checked;


}

function changeAutoSyncTime() {
  const t = document.getElementById("autoSyncInput").value

  if(t >= 1) {
    autoSyncSeconds = t;
  } 

}

//Check if the User is Host or Client
async function toggleHostCheck(condition) {
  const isHost = condition; 
  console.log(isHost)

  if(!isHost) {

    isHosting = false;

    document.getElementById("btnTimeMinus").style.visibility = "hidden";   
    document.getElementById("btnTimePlus").style.visibility = "hidden";  
    document.getElementById("btnStart").style.visibility = "hidden";  
    document.getElementById("btnStop").style.visibility = "hidden";  
    document.getElementById("btnHost").style.visibility = "hidden";  
    document.getElementById("btnClient").style.visibility = "hidden";  

    document.getElementById("btnSync").style.visibility = "hidden";   
    document.getElementById("autoSyncInput").style.visibility = "hidden";  
    document.getElementById("autoSyncToggle").style.visibility = "hidden";  
    document.getElementById("timerTotal").style.visibility = "hidden";  
    document.getElementById("globalValues").style.visibility = "hidden";  
    document.getElementById("textAutoSync").style.visibility = "hidden"; 

    
 


  } else {


    isHosting = true;

    document.getElementById("btnTimeMinus").style.visibility = "visible";   
    document.getElementById("btnTimePlus").style.visibility = "visible";  
    document.getElementById("btnStart").style.visibility = "visible";  
    document.getElementById("btnStop").style.visibility = "visible";  
    document.getElementById("btnHost").style.visibility = "hidden";  
    document.getElementById("btnClient").style.visibility = "hidden";    
  }
}

//Main Frontend
function App() {


  return (
    <>
      <div>
      <button id="btnHost" onClick={() => toggleHostCheck(true)}>
          Host
        </button>
        <button id="btnClient" onClick={() => toggleHostCheck(false)}>
          Client
        </button>
      </div>
      <div className="card">
        <button id="btnTimeMinus" onClick={() => addTimeToDB(-600)}>
          -10
        </button>
        <button id="btnTimePlus" onClick={() => addTimeToDB(600)}>
          +10
        </button>
        <button id="btnStart" onClick={() => toggleStart()}>
          Start
        </button>
        <button id="btnStop" onClick={() => toggleStop()}>
          Stop
        </button>
        <div>
      <button id="btnSync" onClick={() => syncTime("host")}>
          Sync
        </button>
        <p id="textAutoSync">Auto Sync</p>
        <input type='text' className="autoSync" id="autoSyncInput" defaultValue="10" onChange={() => changeAutoSyncTime()}></input>    
        <input type='checkbox' id="autoSyncToggle" onChange={(event) => toggleAutoSync(event.target.checked)}></input>     
      </div>        
      </div>
      <h1 id="timertext">
        Timer 
      </h1>
      <p id="timerTotal">Total</p>
      <p id="globalValues">Global Variables</p>

    </>
  )
}




export default App
