const express = require("express"); //sets the name of a package to be used
const app = express(); //creates an object called app using the class of the package

app.get("/", (req, res) => { //req is the incoming request, res is the outgoing response.
  res.send("Hello, this is the backend"); // executes a response for the res
});

app.listen(4000, () => { // starts up a live server instance hosted at port 4000
  console.log("Server running on port 4000"); // outputs a print statement to the console log
});