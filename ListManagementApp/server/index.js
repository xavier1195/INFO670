// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const dbName   = process.env.DB_NAME;

let dbClient, traitsCollection;

async function startServer() {
  dbClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
  await dbClient.connect();
  const db = dbClient.db(dbName);
  traitsCollection = db.collection("traits");
  console.log("✅ Connected to MongoDB");

  // GET /api/traits?common_name=Blue%20Jay
  app.get("/api/traits", async (req, res) => {
  const { common_name } = req.query;
  if (!common_name) return res.status(400).json({ error: "Missing common_name" });

  // Case-insensitive search in MongoDB’s traits collection
  const doc = await traitsCollection.findOne(
    { common_name: { $regex: new RegExp(`^${common_name}$`, "i") } },
    {
      projection: {
        _id: 0,
        common_name: 1,
        Beak_Length_Culmen: 1,
        Beak_Width: 1,
        Wing_Length: 1,
        Tail_Length: 1,
        Mass: 1,
        Trophic_Level: 1,
        Trophic_Niche: 1,
        Habitat: 1,
      },
    }
  );
  if (!doc) return res.status(404).json({ error: "Not found" });
  return res.json(doc);
});

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bird‐traits API listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
