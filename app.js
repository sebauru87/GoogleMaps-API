const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const app = express();
const Store = require('./api/models/store');
const axios = require('axios');
const GoogleMapsService = require('./api/services/googleMapsService');
const googleMapsService = new GoogleMapsService();


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})
// mongodb://localhost:27017/google_map_api_store
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
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
            location: {
                type: 'Point',
                coordinates: [
                    store.longitude,
                    store.latitude
                ]
            }
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
    googleMapsService.getCoordinates(zipCode)
    .then((coordinates) => {

        Store.find({
            location: {
                $near: {
                    $maxDistance: 3000,
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    }
                }
            }
        }, (err, stores)=>{
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(stores);
            }
        })

        console.log(coordinates);
    }).catch((error) => {
        console.log(error);
    })


})

app.delete('/api/stores', (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(200).send(err);
    })
})

app.listen(process.env.PORT || 3000, () => console.log(`app server started`))