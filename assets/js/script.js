// Tagging first variables from the html file using jquery.
const searchInput = $('#search-input');
const searchBtn = $('#search-button');
const forecastToday = $("#today");
const forecastFiveDays = $("#forecast");
let latitude = "";
let longitude = "";

let todayDate = dayjs();
let dayOne = todayDate.add(1, "day").format("DD/MM/YYYY");
let dayTwo = todayDate.add(2, "day").format("DD/MM/YYYY");
let dayThree = todayDate.add(3, "day").format("DD/MM/YYYY");
let dayFour = todayDate.add(4, "day").format("DD/MM/YYYY");
let dayFive = todayDate.add(5, "day").format("DD/MM/YYYY");
const fiveDayCardsArr = [dayOne, dayTwo, dayThree, dayFour, dayFive];

const apiKey = 'fbc1b02ed9e4fe4daa6746f1768c4146'

//Set search history array
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

createButtons()

function renderSearchHistoryBtns() {
  //Generate Buttons for City Search History
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  for (let i = 0; i < 10; i++) {
    if (i === searchHistory.length) {
      break;
    }
    const cityButton = $(`<button >${searchHistory[i]}</button>`);
    cityButton.addClass("btn btn-primary m-1");

    cityButton.on("click", () => {
      getWeather(searchHistory[i]);
    });
    $("#forecastHistory").prepend(cityButton);
  }
}


// Add event listener to search button
searchBtn.on("click", (event) => {
  event.preventDefault();
  var citySearched = searchInput.val();
  getWeather(citySearched);
  searchInput.val('')
});

function saveToStorage(citySearched) {
  if (searchHistory.includes(citySearched)) {
    return;
  }
  searchHistory.unshift(citySearched);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  createButtons();
}


function createButtons() {
  $("#forecastHistory").empty()
  for (let i = 0; i < searchHistory.length; i++) {
    const cityButton = $(`<button>${searchHistory[i]}</button>`);
    cityButton.addClass("btn btn-primary m-1");
    cityButton.on('click', function(){
      getWeather($(this).text())
    })
    $("#forecastHistory").append(cityButton);
  }
}

function printWeatherInfo() {

}


function getWeather(citySearched) {
  $("#today").empty();
  $("#forecast").empty();

  const queryUrlCityCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&limit=5&appid=fbc1b02ed9e4fe4daa6746f1768c4146`;

  fetch(queryUrlCityCoordinates)
    .then(function (resp) {
      console.log(queryUrlCityCoordinates)
      return resp.json();
    })
    .then(function (data) {
      latitude = data[0].lat.toFixed(4);
      longitude = data[0].lon.toFixed(4);


      const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&&lon=${longitude}&appid=fbc1b02ed9e4fe4daa6746f1768c4146`;

      fetch(queryURL)
        .then((resp) => {
          console.log(queryURL)
          return resp.json();
        })
        .then((data) => {

          saveToStorage(data.city.name);



          const forecastHeading = $(
            `<h2>${
              data.city.name
            } ${todayDate.format(
              "(DD/MM/YYYY)"
            )} <img src="http://openweathermap.org/img/w/${
              data.list[0].weather[0].icon
            }.png"></h2>`
          );
          const forecastTemp = $(
            `<p>Temp: ${(data.list[0].main.temp - 273.15).toFixed(
              2
            )} &deg;C</p>`
          );
          const forecastWind = $(`<p>Wind: ${data.list[0].wind.speed} KPH</p>`);
          const forecastHumidity = $(
            `<p>Humidity: ${data.list[0].main.humidity}%</p>`
          );

          forecastToday.append(
            forecastHeading,
            forecastTemp,
            forecastWind,
            forecastHumidity
          );

          const fiveDayHeader = $(`<h4>5-Day Forecast</h4>`);
          forecastFiveDays.append(fiveDayHeader);

          let fiveDayCardData = [7, 15, 23, 31, 39];

          for (let i = 0; i < fiveDayCardData.length; i++) {
            const fiveDayCard = $(`<div class="card col-2 m-1">
            <div class="card-body">
                <h6>${fiveDayCardsArr[i]} </h6>
                <img id="pic" src="http://openweathermap.org/img/w/${
                  data.list[fiveDayCardData[i]].weather[0].icon
                }.png">
                <p id= "temp" class= "card-text">Temp: ${(
                  data.list[fiveDayCardData[i]].main.temp - 273.15
                ).toFixed(2)} &deg;C</p>
                <p id= "wind" class= "card-text">Wind: ${
                  data.list[fiveDayCardData[i]].wind.speed
                } KPH</p>
                <p id= "humidity" class= "card-text">Humidity: ${
                  data.list[fiveDayCardData[i]].main.humidity
                }%</p>
            </div>  
            </div>`);

            forecastFiveDays.append(fiveDayCard);
          }
        });
    });
}