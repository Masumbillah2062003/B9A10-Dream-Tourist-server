const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3187xgx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db('assignmentDB').collection("assignment")
    // const registerCollection = client.db('assignmentDB').collection('registerUsers')

    app.get('/assignment', async (req, res) => {
      const quary = userCollection.find()
      const result = await quary.toArray()
      res.send(result)
    })

    app.get('/assignment/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const result = await userCollection.findOne(quary)
      res.send(result)
    })


    app.post('/assignment', async (req, res) => {
      const allData = req.body;
      console.log(allData)
      const result = await userCollection.insertOne(allData);
      res.send(result)
    })

   
    // update 
    app.put("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true }
      const update = req.body;
      const updateDoc = {
        $set: {
          image: update.image,
          touristsName: update.touristsName,
          countryName: update.countryName,
          location: update.location,
          shortDescription: update.shortDescription,
          averageCost: update.averageCost,
          seasonality: update.seasonality,
          travelTime: update.travelTime,
          totalVisitors: update.totalVisitors,
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);
      console.log(result)
      res.send(result)
    })

    // delete
    app.delete('/assignment/:id', async(req, res) => {
      const id = req.params.id;
      const quary = {_id : new ObjectId(id)}
      const result = await userCollection.deleteOne(quary);
      res.send(result)
    })


    app.get("/myList/:email", async (req, res) => {
      console.log(req.params.email)
      const result = await userCollection.find({ userEmail: req.params.email }).toArray();
      console.log(result)
      res.send(result)
    })


    // register users :

    // app.get('/registerUsers', async(req, res) => {
    //   const quary = registerCollection.find();
    //   const result = await quary.toArray();
    //   res.send(result)
    // })

    // app.get('/registerUsers/:id', async(req, res) => {
    //   const id = req.params.id;
    //   const quary = {_id : new ObjectId(id)}
    //   const result = await registerCollection.findOne(quary)
    //   res.send(result)
    // })


    // app.post('/registerUsers', async(req, res) => {
    //   const users = req.body;
    //   console.log(users)
    //   const quary = await registerCollection.insertOne(users)
    //   res.send(quary)
    // })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Batch_9 Assignment_10 Server site Project')
})

app.listen(port, () => {
  console.log(`Batch_9 Assignment_10 Serversite running port : ${port}`)
})