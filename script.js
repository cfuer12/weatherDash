// start the page function
function cityList(searchList) {
  // create list for the searched cities
  $("#areaList").empty();

  var keys = Object.keys(searchList);
  for (var i = 0; i < keys.length; i++) {
    var entry = $("<button>");
    entry.addClass("group-item group-item-action");
    // string function for the cities...get help from tutor. make searched cities into buttons to click back to later
    var string = keys[i].toLowerCase().split(" ");
    for (var k = 0; k < string.length; k++) {
      string[k] =
        string[k].charAt(0).toUpperCase() + string[k].substring(1);
    }
    var cityTitle = string.join(" ");
    entry.text(cityTitle);

    $("#areaList").append(entry);
  }
}


function cityWeather(city, searchList) {
  cityList(searchList);
  //   input api key here at end of link APPID=111111
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=9850d494532b546817fe638bf2c569e6&q=" +
    city;

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=9850d494532b546817fe638bf2c569e6&q=" +
    city; 8

  var latitude;

  var longitude;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // we then store the info into the weather function
    .then(function (weather) {
      // log the queryURL
      console.log(queryURL);

      // then log the resulting object
      console.log(weather);

      var current = moment();
      // display the current weather for the city
      var displayCity = $("<h3>");
      $("#placeName").empty();
      $("#placeName").append(
        displayCity.text("(" + current.format("M/D/YYYY") + ")")
      );

      // display the current city name
      var cityName = $("<h3>").text(weather.name);
      $("#placeName").prepend(cityName);
      // display the current weather image icon
      var weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );

      $("#imageNow").empty();
      $("#imageNow").append(weatherIcon);
      // pulls the info from the API to display temperature, hudidity and wind speed, displays onto current
      $("#temp").text("Temperature: " + weather.main.temp + " °F");
      $("#humidity").text("Humidity: " + weather.main.humidity + "%");
      $("#wind").text("Wind Speed: " + weather.wind.speed + " MPH");

      latitude = weather.coord.lat;
      longitude = weather.coord.lon;
      // calling the api for the UV index this time around
      var queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=9850d494532b546817fe638bf2c569e6&q=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET"
        // store all info from server into uvIndex
      }).then(function (uvIndex) {
        console.log(uvIndex);
        // makes un-usable button displaying UV index by danger color "red"
        var uvDisplay = $("<button>");
        uvDisplay.addClass("btn btn-danger");

        // displays the UV index into the current weather
        $("#uv").text("UV Index: ");
        $("#uv").append(uvDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        // calling to forecast api
        $.ajax({
          url: queryURL2,
          method: "GET"

        }).then(function (forecast) {
          console.log(queryURL2);
          // calling back to URL2 and forecast
          console.log(forecast);

          // Loop through the forecast list array and display a single forecast entry/time for each of the 5 days...need help**
          for (var i = 6; i < forecast.list.length; i += 8) {

            var foreDate = $("<h5>");

            var foreArrange = (i + 2) / 8;
            // inputs the date of the next 5 days...need help with this
            console.log("#foreDate" + foreArrange);

            $("#foreDate" + foreArrange).empty();
            $("#foreDate" + foreArrange).append(
              foreDate.text(current.add(1, "days").format("M/D/YYYY"))
            );

            // input the icon image of the current weather into rows
            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
              forecast.list[i].weather[0].icon +
              ".png"
            );
              // inpiuts image icon in the rows
            $("#fore-img" + foreArrange).empty();
            $("#fore-img" + foreArrange).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);
            // inputs the temperature of the next five days in the rows
            $("#temp" + foreArrange).text(
              "Temp: " + forecast.list[i].main.temp + " °F"
            );
            // inputs humidity for the next five days in the rows
            $("#humidity" + foreArrange).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );

          }
        });
      });
    });
}

$(document).ready(function () {
  // loop through the list of cities and store them when searched...
  var stringCities = localStorage.getItem("searchList");

  var searchList = JSON.parse(stringCities);

  if (searchList == null) {
    searchList = {};
  }
  // hide function to not display the cards displaying weather info for current and 5 day
  cityList(searchList);

  $("#current").hide();
  $("#forecast").hide();


  // search button click function 
  $("#search").on("click", function (event) {
    event.preventDefault();
    var city = $("#cityInput")
      .val()
      .trim()
      .toLowerCase();

    if (city != "") {

      // grabs stored city search from local storage 
      searchList[city] = true;
      localStorage.setItem("searchList", JSON.stringify(searchList));

      cityWeather(city, searchList);
      // displays the current and 5 day forecast for weather on dashboard
      $("#current").show();
      $("#forecast").show();
    }
  });

  // makes past search list items searchable again in list
  $("#areaList").on("click", "button", function (event) {
    event.preventDefault();
    var city = $(this).text();

    cityWeather(city, searchList);

    $("#current").show();
    $("#forecast").show();
  });
});