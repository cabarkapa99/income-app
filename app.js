const express = require('express');
const path = require('path');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/incomeApp', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const routerPrihodi = require('./routers/prihodi');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/prihodi', routerPrihodi);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
    // Obrada gresaka ide ovde
    console.log("Greska na serveru!");
    console.log(err);
    res.status(500).json(err.message);
});


module.exports = app;