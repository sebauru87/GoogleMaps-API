const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose')
const app = express()
const port = 3000
const Store = require('./api/models/store')



// mongodb://localhost:27017/google_map_api_store
mongoose.connect(`mongodb+srv://sebauru87:${process.env.PASSWORD}@yelpcamp-ijcji.mongodb.net/stores?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json({ limit: '50mb' }));

app.post('/api/stores', (req, res)=>{
    let dbStores = req.body;

    console.log(dbStores);
    // let store = new Store({
    //     name: "La Pasiva Pocitos",
    //     latitude: -34.9140478,
    //     longitude: -56.1490158
    // });
    // store.save();
    res.send('poooooosted');
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))