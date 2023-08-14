const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log(req.body.cityName);
  const query = req.body.cityName;
  const apiKey = "a48cb4f6190c10230746b33704f3a944";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const tempKelvin = weatherData.main.temp;
      const tempCelsius = tempKelvin - 273.15; // Convert from Kelvin to Celsius
      const weatherDescription = weatherData.weather[0].description;
      const iconCode = weatherData.weather[0].icon;
      const iconURL =
        "http://openweathermap.org/img/wn/" + iconCode + ".png"; // Updated URL format
      res.write(
        "<p>The weather is currently " + weatherDescription + "</p>"
      );
      res.write(
        "<h1>The temperature in " +
          query +
          " is " +
          tempCelsius.toFixed(2) +
          " degrees Celsius</h1>"
      );
      res.write('<img src="' + iconURL + '" alt="Weather Icon">'); // Updated image tag
      res.send();
    });
  }).on("error", function (error) {
    console.error("Error retrieving weather data:", error);
    res.send("An error occurred while retrieving weather data.");
  });
});

app.listen(3000, function (req, res) {
  console.log("The server has been started on port 3000");
});
