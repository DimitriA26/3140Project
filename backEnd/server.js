const express = require("express"); //sets the name of a package to be used
const app = express(); //creates an object called app using the class of the package
const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => { //req is the incoming request, res is the outgoing response.
  res.send("Hello, this is the backend"); // executes a response for the res
});



const { getProduct } = require("./db_functions/search.js"); // imports the search function from the search.js file

getProduct("Gaming");



const { getOrderHistory } = require("./db_functions/order.js");

app.get("/orders/:userID", async (req, res) => {

  const { userID } = req.params;

  try {

    const orders = await getOrderHistory(userID);

    res.status(200).json(orders);

  } catch (error) {

    console.error("Error retrieving order history:", error);

    res.status(500).json({
      error: "Unable to retrieve order history"
    });

  }

});


app.listen(4000, () => { // starts up a live server instance hosted at port 4000
  console.log("Server running on port 4000"); // outputs a print statement to the console log
});