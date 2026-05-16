const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("wanderlust");
    const destinationsCollection = db.collection("destinations");
    const bookingsCollection = db.collection("bookings");

    app.get("/destination", async (req, res) => {
      const result = await destinationsCollection.find().toArray();
      res.json(result);

    })

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      const result = await destinationsCollection.insertOne(destinationData);

      res.json(result);
    })

    app.get("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationsCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    })

    app.patch("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await destinationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.json(result);
    })

    app.delete("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationsCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    })

    app.get("/booking/:userId", async (req, res) =>{
      const { userId } = req.params;
      const result = await bookingsCollection.find({ userId }).toArray();
      res.json(result);
    })

    app.post("/booking", async (req, res) =>{
      const bookingData = req.body;
      const result = await bookingsCollection.insertOne(bookingData);
      res.json(result); 
    })

    app.delete("/booking/:bookingId", async (req, res) =>{
      const { bookingId } = req.params;
      const result = await bookingsCollection.deleteOne({ _id: new ObjectId(bookingId) });
      res.json(result); 
    })
    



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
