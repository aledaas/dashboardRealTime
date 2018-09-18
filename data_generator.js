const fetch = require('node-fetch');

const getPopularToppingsWebhook = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/dashboard-jhhpc/service/PizzaOrderAPI/incoming_webhook/addOrder?secret=yummypizza";

const chance = require("chance").Chance(); // Package for random variables

// Seeds for the random data
const LOCATIONS = ["Caballito", "Floresta", "Palermo"];
const TOPPINGS = [
    "Pepperoni",
    "Napolitana",
    "Pollo BBQ",
    "Tropical",
    "Hawaiiana",
    "Americana",
    "Fugazza",
    "Cuatro Estaciones",
    "Vegetariana",
    "Roquefort"
];
const SIZES = ["Individual", "Mediana", "Grande", "Extra Grande", "X-Metro"];

generateReceipts();

function generateReceipts() {
  // Create a random pizza order
  const receipt = {
    timestamp: Date.now(),
    customerName: chance.name({ nationality: "en" }),
    cardNumber: chance.cc(),
    location: chance.weighted(LOCATIONS, [2, 5, 3]),
    size: chance.weighted(SIZES, [1, 2, 3, 4, 5]),
    topping: chance.weighted(TOPPINGS, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
    total: parseFloat(chance.normal({ mean: 20, dev: 3 }).toFixed(2))
  };

  // Post the order to the addOrder webhook
  
  fetch(getPopularToppingsWebhook, {
    method: "POST",
    mode: "CORS",
    // The webhook handler expects the body to be stringified JSON
    body: JSON.stringify(receipt)
  })
    .then(response => response.json())
    .then(res => {
      // Log a successful order and generate another
      console.log(res);
      randomDelay(generateReceipts);
    })
    .catch(err => console.error(err));
}

function randomDelay(fn) {
  // Wait for up to one second before executing the given function
  setTimeout(fn, chance.integer({ min: 0, max: 4000 }));
}
