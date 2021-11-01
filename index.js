const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sta54.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("services");
        const servicesCollection = database.collection("service");
        const purchaseCollection = database.collection("purchaseHistory");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            console.log(services);
            res.json(services);
        })
        app.get('/myOrder', async (req, res) => {
            const cursor = purchaseCollection.find({});
            const purchaseHistories = await cursor.toArray();
            console.log(purchaseHistories);
            res.json(purchaseHistories);
        })
        app.post('/user', (req, res) => {
            console.log("hit user");
            res.json(req.body)
        })
        // GET API Example
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await servicesCollection.findOne(query);
            console.log(user);

            res.json(user)
        })

        // POST API
        app.post('/purchaseService', async (req, res) => {
            console.log("Hitting Post", req.body);
            // res.json(req.body);
            const newPurchase = req.body;
            const result = await purchaseCollection.insertOne(newPurchase);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })
        // Post API Example
        app.post('/users', async (req, res) => {
            console.log("Hitting Post", req.body);
            const newUser = req.body;
            const result = await servicesCollection.insertOne(newUser);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })

        // DELETE API
        app.delete('/updateMyOrder/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await purchaseCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
            console.log(result);
            res.json(result)
        })
        // DELETE API Example
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




// GET API
app.get('/', (req, res) => {
    res.send("Running...")
})


// Listening to the server
app.listen(port, () => console.log("Server running on port:", 5000))