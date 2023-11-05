
        const API_KEY = '57541ca2c68a40c507fab512fc83873d';


        $(document).ready(function() {
            $("#searchButton").click(function() 
            {
                var vall=$("#cityInput").val();
                if(vall!=="")
                {
                    getWeather(vall);
                    document.getElementsByClassName('weather-details')[0].style.backgroundColor = "powderblue";
                    document.getElementsByClassName('weather-details')[0].style.textAlign = "center";
                }
            });

            $("#currentLocationButton").click(function() {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        const { latitude: lat, longitude: lon } = position.coords;
                        getWeatherByCoordinates(lat, lon);
                    });
                } else {
                    alert("Geolocation is not supported by your browser.");
                }
            });
        });


        function getWeather(query) {
            const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`;
            fetchWeatherData(API_URL);
        }


        function getWeatherByCoordinates(lat, lon) {
            const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
            fetchWeatherData(API_URL);
        }


        function fetchWeatherData(url) {
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    $("#cityName").text(data.name);
                    $("#temperature").text(`${(data.main.temp - 273.15).toFixed(2)}°C`);
                    $("#description").text(data.weather[0].description);
                    $("#icon").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
                    const forecastAPI_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${API_KEY}`;
                    fetch(forecastAPI_URL)
                        .then((response) => response.json())
                        .then((forecastData) => {
                            displayForecast(forecastData.list);
                        });
                })
                .catch((error) => {
                    console.error('An error occurred while fetching weather data:', error);
                });
        }


        function displayForecast(forecastList) {
            const forecastContainer = $(".forecast");
            forecastContainer.html('');
            for (let i = 0; i < forecastList.length; i += 8) {
                const forecast = forecastList[i];
                const date = new Date(forecast.dt * 1000);
                const forecastCard = $("<div>").addClass("forecast-card").html(`
                    <h3>${formatDate(date)}</h3>
                    <p>${(forecast.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>${forecast.weather[0].description}</p>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
                `);
                forecastContainer.append(forecastCard);
            }
        }


        function formatDate(date) {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
