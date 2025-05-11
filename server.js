const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB connection URI
const uri = "mongodb://admin:password@mongo-svc:27017/mydb?authSource=admin";
//const uri = "mongodb://admin:password@host.docker.internal:32000/mydb?authSource=admin";

const dbName = "mydb";
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
}

connectToDB();

app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.send("Server is up and running");
});

// CREATE
app.post("/items", async (req, res) => {
  try {
    const result = await db.collection("items").insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get("/items", async (req, res) => {
  try {
    const items = await db.collection("items").find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/items/:id", async (req, res) => {
  try {
    const result = await db.collection("items").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/items/:id", async (req, res) => {
  try {
    const result = await db.collection("items").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
