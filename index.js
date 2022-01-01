const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

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
    const servicesCollection = database.collection("services");
    const orderCollection = database.collection("bookings");

    // for Booking collection
    app.get("/Bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const Booking = await orderCollection.findOne(query);
      console.log("load user with id: ", id);
      res.send(Booking);
    });

    //GET API for Home
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
      console.log(services);
    });

    app.get("/product", async (req, res) => {
      const cursor = servicesCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    //post api for Product add from services
    app.post("/addProduct", async (req, res) => {
      const services = req.body;
      const result = await servicesCollection.insertOne(services);

      res.json(result);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // Add orders from purchase
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.json(result);
    });
    // My orders
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await orderCollection.find(filter).toArray();
      res.send(result);
    });

    //all edit profile data send to database
    app.post("/profiles", async (req, res) => {
      const profile = req.body;
      const result = await profileCollection.insertOne(profile);
      res.json(result);
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
  res.send("Welcome to bazar maynaguri !");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
