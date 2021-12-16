const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f2bxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("bazarMaynaguri");
    const usersCollection = database.collection("users");
    const profileCollection = database.collection("profiles");

    //all edit profile data send to database
    app.post("/profiles", async (req, res) => {
      const profile = req.body;
      const result = await profileCollection.insertOne(profile);
      res.json(result);
      console.log(result);
    });
    app.get("/profiles", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = profileCollection.find({});
      const profiles = await cursor.toArray();
      res.json(profiles);
    });

    //all users data send to database

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.json(result);
      console.log(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome bazar maynaguri !");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
