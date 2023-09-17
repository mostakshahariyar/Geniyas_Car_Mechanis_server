const express = require('express');
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.at4k8pd.mongodb.net/?retryWrites=true&w=majority`;

// console.log(process.env)

console.log(uri);
const client = new MongoClient(uri, {
        serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
        }
});

async function run() {
        try {
                await client.connect();
                const database = client.db("carMechanic");
                const serviceCollection = database.collection("services");
                app.post('/services', async (req, res) => {
                        const service = req.body;
                        const result = await serviceCollection.insertOne(service);
                        // Print the ID of the inserted document
                        res.send(result)
                        console.log(`A document was inserted with the _id: ${result.insertedId}`);
                        console.log(service);
                })
                app.get('/services', async (req, res) => {
                        // const cursor = serviceCollection.find({});
                        const services = await serviceCollection.find({}).toArray();
                        res.send(services);

                })
                app.get('/services/:id', async (req, res) => {
                        const id = req.params.id;
                        const objectId = new ObjectId(id);
                        const query = { _id: objectId };
                        const result = await serviceCollection.findOne(query);
                        console.log(result);
                        res.send(result);                        // const services = await serviceCollection.find({}).toArray();
                        // res.send(services);

                })

        } finally {
                // Ensures that the client will close when you finish/error
                // await client.close();
        }
}
run().catch(console.dir);

app.listen(port, () => {
        console.log("port number: ", port);
})