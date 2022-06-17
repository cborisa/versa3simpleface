// To-do:
// On wrist check for heart sensor
// Battery display when low percentage on the top
// Cycle display for hear and steps (and include empty one)
// Add week day text


import clock from "clock"; // needed to have a clock!
import * as document from "document"; // needed to access the labels used to display values
import { preferences } from "user-settings"; // needed to get the user preference 12h or 24h
import * as util from "../common/utils"; // import user function zeroPad
import { battery } from "power"; // import battery level
import { HeartRateSensor } from "heart-rate"; // import HR reading from sensor
import { display } from "display";
import { today as userActivity } from "user-activity";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const timeDisplay = document.getElementById("timeDisplay");
const dateDisplay = document.getElementById("dateDisplay");
const stepsDisplay = document.getElementById("stepsDisplay");
const heartRateDisplay = document.getElementById("heartRateDisplay");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let month = today.getMonth();
  let year = today.getFullYear();
  let day = today.getDate();
  month = util.zeroPad(month);
  day = util.zeroPad(day);
  timeDisplay.text = `${hours}:${mins}`;
  dateDisplay.text = `${year}-${month}-${day}`;

  // Heart rate sensor
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    //Update heart rate here.
    heartRateDisplay.text = "\u2665 " + `${hrm.heartRate}`;
  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    if (display.on) {
      hrm.start();
    }
    else {
      hrm.stop();
    }
  });
  hrm.start();
  
  //Steps label
  let stepsCount = userActivity.adjusted.steps;
  stepsDisplay.text = `${stepsCount}`;
}