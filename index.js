require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")

const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
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

    // Database collection
    const moviesCollection = client.db("movieManiaDB").collection("movies")

    // Post a movie
    app.post("/movies", async(req,res)=>{
        const movie = req?.body;
        const result = await moviesCollection.insertOne(movie)
        res.send(result)
    })

    // Get movies on based on users
    app.get("/movies", async(req,res)=>{
        const email = req?.query?.email
        const result = await moviesCollection.find({email: email}).toArray()
        res.send(result)
    })

    // Delete a movie
    app.delete("/movie/:id", async(req,res)=>{
        const id = req?.params?.id;
        const query = {_id: new ObjectId(id)}
        const result = await moviesCollection.deleteOne(query)
        res.send(result);
    })






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res)=>{
    res.send("Movie Mania is working")
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})