const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.get("/destination", async (req, res) => {
      const result = await destinationsCollection.find().toArray();
      res.send(result);

    })

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      const result = await destinationsCollection.insertOne(destinationData);

      res.send(result);
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
