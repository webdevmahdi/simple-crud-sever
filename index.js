const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('app is running ')
}) // mahdihasan0170525 b067Q5y1IYpNJg1b
const uri = "mongodb+srv://mahdihasan0170525:b067Q5y1IYpNJg1b@cluster0.asfvn6h.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    console.log('Database is connecting')

    const database = client.db("insertDB");
    const userData = database.collection("userData");

    app.get('/users', async (req, res) => {
      let cursor = userData.find();
      let result = await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:id', async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id)}
      let result = await userData.findOne(query);
      res.send(result)
    })

    app.put('/users/:id', async (req, res) => {
      let id = req.params.id;
      let updatedData = req.body;
      console.log(updatedData)
      let filter = { _id: new ObjectId(id)}
      let options = { upsert: true }
      let updatedUser = {
        $set: {
          name: updatedData.name,
          email: updatedData.email
        }
      }
      let result = await userData.updateOne(filter, updatedUser, options)
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      let user = req.body;
      console.log(req.body);
      const result = await userData.insertOne(user);
      res.send(result)

    })

    app.delete('/users/:id', async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id)}
      let result = await userData.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     let database = client.db('userDB')
//     let userData = database.collection('userData');

//     app.post('/user', async (req, res) => {
//       let user = req.body;
//       console.log(user)
//       let result = await userData.insertOne(user);
//       res.send(result)
//     })


//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


app.listen(port, () => {
  console.log(`App is running port: ${port}`)
})