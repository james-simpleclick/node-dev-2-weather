const express = require("express");
// const fs = require("fs");
const hbs = require('express-hbs');
const { registerHelpers } = require('./hbs-helpers');
const { searchWeather } = require('./utils/weather.js')

const path = require("path");
const app = express();

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, "/../views/partials")
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/../views'));

// Load helpers
registerHelpers(hbs);

// /public (static)
app.use(express.static(
    path.join(__dirname, "/../public")
));

// templated routes
app.get("", (req, res) => {
    res.render("index", {
        pageTitle: "Home",
        path: req.path,
    });
});
app.get("/about", (req, res) => {
    res.render("about", {
        pageTitle: "About",
        path: req.path
    });
});
app.get("/help", (req, res) => {
    console.log("QUERY:", req.query)
    res.render("help", {
        pageTitle: "Help",
        path: req.path,
        helpText: "this is the help text"
    });
});

// /weather (json api)
app.get("/weather", async (req, res) => {
    const { address } = req.query;
    let error, data;
    if (!address) {
        error = {error: "Missing required parameter: 'search'"};
    } else {
        data = {
            search: address,
            ...await searchWeather(address)
        };
    }
    if (error) { res.status(400); }
    res.contentType("application/json");
    res.send(JSON.stringify(error ?? data, null, "\t"));
})

// default error
app.get("*", (req, res) => {
    res.status(404);
    res.render("404", {
        pageTitle: "404",
        path: req.path,
        paths: req.path.split("/").filter(Boolean)
    });
});

app.listen(3030, () => { console.log("App listening on port 3030")});