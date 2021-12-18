const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
// const { ObjectID, ObjectId } = require('bson');
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
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");
        const usersCollection = database.collection("users");

        // GET all products
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //Get single product
        app.get('/products/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await productsCollection.findOne(query);
          res.send(result);
        })

        // post api (insert orders)
        app.post('/order', async(req, res) => {
          const doc = req.body;
          const result = await ordersCollection.insertOne(doc);
          res.send(result);
        })

        // post user
        app.post('/users', async(req, res) => {
          const cursor = req.body;
          const result = await usersCollection.insertOne(cursor);
          res.send(result);
        })

        //get api (admin or not)
        app.get('/users/:email', async(req, res) => {
          const email = req.params.email;
          const query = {email: email};
          const result = await usersCollection.findOne(query);
          let isAdmin = false;
          if(result?.role === 'admin'){
            isAdmin = true;
          }
          res.json({admin: isAdmin});
        })

        // update user 
        app.put('/users', async(req, res) => {
          const user = req.body;
          const filter = {email: user.email};
          const updateDoc = {$set: {role: 'admin'}}
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.send(result);
        })

        //get by email
        app.get('/orders/:email', async(req, res) => {
          const email = req.params.email;
          const filter = {email: email}
          const result = await ordersCollection.find(filter).toArray();
          res.send(result);
        });

        // delete an order
        app.delete('/orders/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await ordersCollection.deleteOne(query);
          res.json(result);
        });

        // post a review
        app.post('/review', async(req, res) => {
          const review = req.body;
          const result = await reviewsCollection.insertOne(review);
          res.json(result);
        });

        // post a product
        app.post('/products', async(req, res) => {
          const product = req.body;
          const result = await productsCollection.insertOne(product);
          res.json(result);
        })

        // get all orders
        app.get('/orders', async(req, res) => {
          const cursor = ordersCollection.find({});
          const result = await cursor.toArray();
          res.send(result);
        })

        // update an order status
        app.put('/orders/:id', async(req, res) => {
          const id = req.params.id;
          const filter = {_id: ObjectId(id)}
          const updateDoc = { $set: {status: 'shipped'}}
          const result = await ordersCollection.updateOne(filter, updateDoc);
          res.json(result);
      })

      app.get('/review', async(req, res) => {
        const reviews = reviewsCollection.find({});
        const result = await reviews.toArray();
        res.send(result);
    });

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