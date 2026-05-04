const background = document.getElementById("background");

async function getBackground() {
  const url =
    "https://api.nasa.gov/planetary/apod?api_key=D4yqAVuKu7gDddL2buOBT4qNdGm0KK2iEUiRb9D3";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    if (result.media_type === "image") {
      return result.url;
    }
    return "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920";
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

window.onload = function () {
  getBackground().then(function (imageUrl) {
    if (!imageUrl) return;
    console.log(imageUrl);
    if (background) {
      background.style["background-image"] = `url('${imageUrl}')`;
    }
  });
  updateWeather();
  updateFact();
};

setInterval(() => {
  const time = document.getElementById("time");
  let dateObject = new Date();
  let utc = dateObject.getTime();
  let local = dateObject.getTimezoneOffset() * 60 * 1000;
  let ttime = utc - local;
  let totalSeconds = Math.floor(ttime / 1000);
  let seconds = totalSeconds % 60;
  let minutes = Math.floor(totalSeconds / 60) % 60;
  let hours = Math.floor(totalSeconds / 3600) % 24;
  seconds = seconds.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  hours = hours.toString().padStart(2, "0");
  time.innerText = `${hours}:${minutes}:${seconds}`;
}, 1000);

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    );
  });
}

async function getWeather() {
  try {
    const coords = await getLocation();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

function updateWeather() {
  const weatherElement = document.getElementById("weather");
  getWeather().then((data) => {
    if (!data || !data.current_weather) return;
    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;
    weatherElement.innerText = `${temp}°C ${wind} km/h`;
  });
}

async function getFact() {
  try {
    const url = `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

function updateFact() {
  const factElement = document.getElementById("fact");
  getFact().then((data) => {
    if (!data || !data.text) return;
    const text = data.text;
    factElement.innerText = text;
  });
}
