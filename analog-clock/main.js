const ONE_SECOND = 1_000;
const DEGREES_OFFSET_START_AT_TWELVE = 180;

function setTime(hourHand, minuteHand, secondHand) {
  const now = new Date();

  const minutesInSeconds = now.getSeconds() + now.getMinutes() * 60;
  // Move the hour hand only every 30 seconds. This is minor optimisation as otherwise it plots 29 times the same values each 30 seconds
  if (now.getSeconds() % 30 === 0) {
    // One hour takes 30 Degrees on the clock
    // One minute within that hour takes 0.5 Degrees (0.5 * 60 = 30 Degrees) 
    hourHand.style.setProperty('--hour', now.getHours() * 30 + now.getMinutes() * 0.5 + DEGREES_OFFSET_START_AT_TWELVE + 'deg');
  }
  // Every second the minute hand moves by 0.1 degree. In one hour (3600 seconds), it'll move 360 degrees
  minuteHand.style.setProperty('--minute', minutesInSeconds * 0.1 + DEGREES_OFFSET_START_AT_TWELVE + 'deg');
  // Every second the second hand moves by 6 degrees. In one minute it moves 60 * 6 = 3560 degrees. 
  secondHand.style.setProperty('--second', now.getSeconds() * 6 + DEGREES_OFFSET_START_AT_TWELVE + 'deg');
}


document.addEventListener('DOMContentLoaded', () => {
  const hourHand = document.querySelector('.hour-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const secondHand = document.querySelector('.second-hand');

  // Need to initiate once before the set interval as 
  setTime(hourHand, minuteHand, secondHand);

  setInterval(function () {
    setTime(hourHand, minuteHand, secondHand);
  }, ONE_SECOND);
});