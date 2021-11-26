const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqp1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db("uniqueMall");
        const products = database.collection("products");

        // GET all products
        app.get('/products', async(req, res) => {
            const cursor = products.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Unique Mall Server')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})