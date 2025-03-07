const apiKey = "7d5e74e7b112e34001dc87b79a2fc7c3";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherConditionText = document.querySelector(".weather-condition"); 

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    var data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "*C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    const weatherCondition = data.weather[0].main;
    weatherConditionText.innerHTML = weatherCondition; 

    console.log(weatherCondition);


    if (weatherCondition == "Clouds") {
      weatherIcon.src = "img/clouds.png";
    } else if (weatherCondition == "Clear") {
      weatherIcon.src = "img/clear.png";
    } else if (weatherCondition == "Rain") {
      weatherIcon.src = "img/rain.png";
    } else if (weatherCondition == "Drizzle") {
      weatherIcon.src = "img/drizzle.png";
    } else if (weatherCondition == "Mist") {
      weatherIcon.src = "img/mist.png";
    } else if (weatherCondition == "Snow") {
      weatherIcon.src = "img/snow.png"
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value.trim());
  }
});

checkWeather();
