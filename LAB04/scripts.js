document.getElementById('weatherButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        getCurrentWeather(city);
        getForecastWeather(city);
    } else {
        alert('Proszę wprowadzić nazwę miasta');
    }
});

function getCurrentWeather(city) {
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayCurrentWeather(data);
        } else {
            alert('Błąd, nie udało się pobrać pogody');
        }
    };
    xhr.send();
}

function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById('currentWeather');
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherDiv.innerHTML = `
        <h2>Bieżąca Pogoda dla ${data.name}</h2>
        <div id="weatherNow" style="display: flex; align-items: center; justify-content: center;">
            <img src="${iconUrl}" alt="Ikona pogody" style="margin-right: 10px;">
            <div>
                <p>Temperatura: ${data.main.temp}°C</p>
                <p>Opis: ${data.weather[0].description}</p>
                <p>Wilgotność: ${data.main.humidity}%</p>
                <p>Prędkość wiatru: ${data.wind.speed} m/s</p>
            </div>
        </div>
    `;
    console.log(weatherDiv);
}

function getForecastWeather(city) {
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Błąd, nie udało się pobrać pogody');
            return response.json();
        })
        .then(data => displayForecastWeather(data))
        .catch(error => alert(error.message));
}

function displayForecastWeather(data) {
    console.log('Wyświetlanie prognozy pogody:', data);
    const forecastDiv = document.getElementById('forecastWeather');
    forecastDiv.innerHTML = `<h2>Prognoza 5-dniowa dla ${data.city.name}</h2>`;

    data.list.forEach((item, index) => {
        if (index % 8 === 0) {
            const date = new Date(item.dt_txt);
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            forecastDiv.innerHTML += `
                <div id="forecast5">
                    <img src="${iconUrl}" alt="Ikona pogody" style="margin-right: 10px;">
                    <div>
                        <h3>${date.toLocaleDateString('pl-PL')}</h3>
                        <p>Temperatura: ${item.main.temp}°C</p>
                        <p>Opis: ${item.weather[0].description}</p>
                        <p>Wilgotność: ${item.main.humidity}%</p>
                        <p>Prędkość wiatru: ${item.wind.speed} m/s</p>
                    </div>
                </div>
            `;
        }
    });
    console.log(forecastDiv);
}
