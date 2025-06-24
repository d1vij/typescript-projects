import { DateLogicHandler } from "./DateLogicHandler.js";
const LowerButton = document.querySelector("button#earlier");
const HigherButton = document.querySelector("button#later");
const CurrentDateText = document.querySelector("span#current-date");
const earlierDatesList = document.querySelector("ul#earlier-dates-list-elm");
const laterDatesList = document.querySelector("ul#later-dates-list-elm");
const TriesDisplay = document.querySelector("span#tries-display");
const DLH = new DateLogicHandler();
let tries = 0;
function setCurrentDate(date) {
    CurrentDateText.innerText = date;
}
function earlierEventListener() {
    DLH.updateDates("earlier");
    laterDatesList.innerHTML += `<li>${DateLogicHandler.dateString(DLH.currDate)}</li>`;
    setCurrentDate(DateLogicHandler.dateString(DLH.randomDate()));
    updateTries();
}
function laterEventListener() {
    DLH.updateDates("later");
    earlierDatesList.innerHTML += `<li>${DateLogicHandler.dateString(DLH.currDate)}</li>`;
    setCurrentDate(DateLogicHandler.dateString(DLH.randomDate()));
    updateTries();
}
function updateTries() {
    tries++;
    TriesDisplay.innerText = (tries).toString();
}
function main() {
    LowerButton.addEventListener("click", earlierEventListener);
    HigherButton.addEventListener("click", laterEventListener);
    updateTries();
    setCurrentDate(DateLogicHandler.dateString(DLH.randomDate()));
}
main();
/**@d1vij */
