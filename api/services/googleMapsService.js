const axios = require('axios')

const googleMapsURL = "https://maps.googleapis.com/maps/api/geocode/json";

class GoogleMaps {
    async getCoordinates(zipCode){
        let coordinates = [];
        await axios.get(googleMapsURL, {
            params: {
                address: zipCode+'montevideo'+'uruguay',
                key: process.env.API_KEY_SERVER
            }
        }).then((response)=>{
            const data = response.data;
            coordinates = [
                data.results[0].geometry.location.lng,
                data.results[0].geometry.location.lat
            ]
        }).catch((error)=>{
            throw new Error(error);
        })
        return coordinates;
    }
}

module.exports = GoogleMaps;