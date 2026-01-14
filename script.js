const apiKey = "496fa98373fdce909b4ce998a9fff0bc";
const output = document.getElementById("output");

  const greetings = [
    "😁 Welcome back. I hope the weather behaves better than your WiFi.",
    "😎 Hey! Ready to check if you'll melt, freeze, or get blown away?",
    "🤔 Enter a city and let's see if the sky is behaving today!",
    "☁️ Time to predict whether you need sunglasses or a submarine.",
    "😆 Hello Human. Let's check whether the sky is friendly today or planning an attack.",
    "🤪 Reporting for duty. Weather predictions loaded. Accuracy not guaranteed.",
    "🙃 Initializing weather scan. Warning: results may cause happiness or disappointment.",
    "😜 Scanning atmosphere. If it starts raining suddenly, it wasn't my fault.",
    "🤫 Weather assistant online. I promise not to judge your city name spelling.",
    "😁 Ready to explore the weather? Don't worry, I won't blame you if it's terrible.",
    "🤫 Processing weather data. If it's bad, pretend I never told you.",
    "😀 Checking weather… if it's raining, go blame the clouds, not me."
  ];

 function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const cleanText = text.substring(1).trim();
  const utter = new SpeechSynthesisUtterance(cleanText);
  utter.pitch = 0.2;
  utter.rate = 0.7;
  utter.volume = 0.8;

  window.speechSynthesis.speak(utter);
}

window.speechSynthesis.onvoiceschanged = () => {
  console.log('Voices loaded');
};

  function funnyPrompt(condition) {
    condition = condition.toLowerCase();
    const prompts = {
      clear: [
        "😎 The sun is out! Don't forget your shades unless you enjoy squinting.",
        "🌞 Perfect weather to pretend you're in a slow-motion movie scene."
      ],
      clouds: [
        "☁️ Cloudy skies… looks like the clouds are silently judging you.",
        "🌥 Cloudy—just like your thoughts on Monday mornings."
      ],
      rain: [
        "🌧 It's raining! Perfect excuse to cancel all your plans.",
        "☔ Hope you brought an umbrella… or maybe a small boat."
      ],
      snow: [
        "❄️ Snow! Time to become a human popsicle.",
        "⛄ Snowy weather: nature’s way of saying ‘stay in bed’."
      ],
      thunderstorm: [
        "⛈ Thunderstorms! Even the sky is yelling today.",
        "⚡ Stay inside unless you want accidental superpowers."
      ],
      drizzle: [
        "🌦 Drizzle—like rain but too shy to commit."
      ],
      mist: [
        "🌫 Misty... looks like a low-budget horror movie outside."
      ],
      default: [
        "🧐 Weather status: undefined. Possibly controlled by aliens.",
        "🐒 Looks like the weather forecast was written by a confused monkey again.",
        "🤨 The weather is being mysterious today even Google is confused."
      ]
    };

    for (let key in prompts) {
      if (condition.includes(key)) {
        return prompts[key][Math.floor(Math.random() * prompts[key].length)];
      }
    }
    return prompts.default[0];
  }
  function speakCurrentWeather(data) {
    const text = `Weather in ${data.name}, ${data.sys.country}. ${data.weather[0].main}, ${data.weather[0].description}. Temperature is ${data.main.temp} degrees Celsius. Feels like ${data.main.feels_like} degrees Celsius. Humidity is ${data.main.humidity} percent. Wind speed is ${(data.wind.speed * 3.6).toFixed(1)} kilometers per hour.`;
    speak(text);
  }
  window.onload = () => {
    const greet = greetings[Math.floor(Math.random() * greetings.length)];
    output.innerHTML = `
      <div class="funny-message">
        ${greet}
        <div class="replay-button" onclick="speak('${greet.replace(/'/g, "")}')">🔊 Replay</div>
      </div>
    `;
    speak(greet);
  };

function showFunnyMessage(weatherType, data = null) {
    const msg = funnyPrompt(weatherType);
    output.innerHTML = `
      <div class="funny-message">
        ${msg}
        <div class="replay-button" onclick="speak('${msg.replace(/'/g, "")}')">🔊 Replay</div>
      </div>
    `;
    speak(msg);
    if (data) {
      setTimeout(() => {
        speakCurrentWeather(data);
      }, 6000); 
    }
  }

  document.getElementById("check").addEventListener("click", getWeatherByCity);
  document.getElementById("get-weather-btn").addEventListener("click", getWeatherByLocation);

  function getWeatherByCity() {
    const city = document.getElementById("city").value.trim();
    if (!city) {
      output.innerHTML = "<p>Please enter a city name.</p>";
      return;
    }
    output.innerHTML = "<p>Loading...</p>";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
      .then(res => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
      })
      .then(data => {
        showFunnyMessage(data.weather[0].main, data); 
        showWeatherData(data);
        getForecast(data.coord.lat, data.coord.lon);
      })
      .catch(err => {
        output.innerHTML = `<p>Error: ${err.message}</p>`;
      });
  }

  function getWeatherByLocation() {
    output.innerHTML = "<p>Fetching your location...</p>";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
            .then(res => {
              if (!res.ok) throw new Error("Unable to fetch weather");
              return res.json();
            })
            .then(data => {
              showFunnyMessage(data.weather[0].main, data);
              showWeatherData(data);
              getForecast(latitude, longitude);
            })
            .catch(err => {
              output.innerHTML = `<p>Error: ${err.message}</p>`;
            });
        },
        () => {
          output.innerHTML = "<p>Location access denied.</p>";
        }
      );
    } else {
      output.innerHTML = "<p>Geolocation not supported.</p>";
    }
  }

  function showWeatherData(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    output.innerHTML += `
      <div class="current-weather">
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}" alt="Weather icon">
        <div class="weather-details">
          <p><strong>${data.weather[0].main}</strong> (${data.weather[0].description})</p>
          <p>🌡 Temp: ${data.main.temp}°C</p>
          <p>🤔 Feels like: ${data.main.feels_like}°C</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>💨 Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/h</p>
        </div>
      </div>
    `;
  }

  function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(res => res.json())
      .then(data => {
        showHourlyForecast(data);
        showFiveDayForecast(data);
      });
  }

  function showHourlyForecast(data) {
    const hourly = data.list.slice(0, 8);
    let html = `<div class="forecast-container"><h3>🌦 Hourly Forecast (Next 24h)</h3><div class="hourly-scroll">`;
    hourly.forEach(item => {
      const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit" });
      html += `
        <div class="hour-card">
          <p>${time}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="">
          <p>${item.main.temp}°C</p>
        </div>
      `;
    });
    html += "</div></div>";
    output.innerHTML += html;
  }

  function showFiveDayForecast(data) {
    const days = [];
    for (let i = 0; i < data.list.length; i += 8) {
      days.push(data.list[i]);
    }
    let html = `<div class="forecast-container"><h3>📅 5-Day Forecast</h3><div class="five-day-grid">`;
    days.forEach(day => {
      const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      html += `
        <div class="forecast">
          <p><strong>${date}</strong></p>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
          <p>${day.weather[0].main}</p>
          <p>${day.main.temp}°C</p>
        </div>
      `;
    });
    html += "</div></div>";
    output.innerHTML += html;
  }
