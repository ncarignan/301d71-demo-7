/*
  Updating heroku
  we need to get the api keys onto heroku
*/

// ============== Packages ==============================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent'); // fetches data from other servers, it stores it in response.body
require('dotenv').config();

// ============== App ===================================

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3009;
const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
console.log(process.env.candy);


// ============== Routes ================================


app.get('/location', handleGetLocation);
function handleGetLocation(req, res){
  // const dataFromTheFile = require('./data/location.json'); // in an express server, we can synchronously
  // TODO: go to the internet and get data
  // we need superagent: npm install -S superagent
  // TODO: make this dynamic using what the client is searching for (req.query.city);

  const city = req.query.city;
  const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATION_API_KEY}&q=${city}&format=json`;
  superagent.get(url).then(stuffThatComesBack => {
    console.log(stuffThatComesBack.body); // anytime this week that data comes back it will be in the body
    // dataFromTheFile === stuffThatComeBAck.body so we can replace dataFromTheFile
    const output = new Location(stuffThatComesBack.body, req.query.city);

    res.send(output);
  });


}


function Location(dataFromTheFile, cityName){
  this.search_query = cityName;
  this.formatted_query = dataFromTheFile[0].display_name;
  this.latitude = dataFromTheFile[0].lat;
  this.longitude = dataFromTheFile[0].lon;
}



app.get('/restaurants', handleGetRestaurants);

function handleGetRestaurants(req, res){
  const restaurantJSON = require('./data/restaurants.json');

  const output = [];
  for (let i = 0; i < restaurantJSON.nearby_restaurants.length; i++){
    output.push(new Restaurant(restaurantJSON.nearby_restaurants[i].restaurant));
  }

  res.send(output);
}


function Restaurant(object){
  {
    this.name = object.name;
    this.area = object.location.locality_verbose;
    this.cuisines = object.cuisines;
  }
}


// ============== Initialization ========================

// I can visit this server at http://localhost:3009
app.listen(PORT, () => console.log(`app is up on port http://localhost:${PORT}`)); // this is what starts the server
