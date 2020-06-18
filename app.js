const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose')
const app = express()
const port = 3000
const Store = require('./api/models/store')
const axios = require('axios')


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})
// mongodb://localhost:27017/google_map_api_store
mongoose.connect(`mongodb+srv://sebauru87:${process.env.PASSWORD}@yelpcamp-ijcji.mongodb.net/stores?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json({
    limit: '50mb'
}));

app.post('/api/stores', (req, res) => {
    let dbStores = [];
    let stores = req.body;

    stores.forEach((store) => {
        dbStores.push({
            name: store.name,
            latitude: store.latitude,
            longitude: store.longitude
        })
    })

    Store.create(dbStores, (err, stores) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(stores);
        }
    })

})

app.get('/api/stores', (req, res) => {

    const zipCode = req.query.zip_code;
    const googleURL = "https://maps.googleapis.com/maps/api/geocode/json";
    axios.get(googleURL, {
        params: {
            address: zipCode+'montevideo'+'uruguay',
            key: process.env.API_KEY_SERVER
        }
    }).then((response) => {
        const data = response.data;
        const coordinates = [
            data.results[0].geometry.location.lng,
            data.results[0].geometry.location.lat
        ]
        console.log(response.data);
        console.log(coordinates);
    }).catch((error) => {
        console.log(error);
    })

    Store.find({}, (err, stores) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(stores);
        }
    })

})

app.delete('/api/stores', (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(200).send(err);
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))