const { MongoClient } = require("mongodb");
const express = require("express");
// Constants
const hostname = "0.0.0.0";
const port = 8080;
const url = "mongodb://mongodb:27017";
const dbName = "mock-database";
const { ObjectId } = require("mongodb");

// App
const app = express();
app.use(express.json()); // This will allow us to parse JSON body data
app.use(express.urlencoded({ extended: true })); // This will allow us to parse x-www-form-urlencoded body data


// GET method route
app.get("/", function (req, res) {
  res.send("GET request to the homepage");
});

// POST method route
app.post("/", function (req, res) {
  res.send("POST request to the homepage");
});

// GET method route
app.get("/secret", function (req, res, next) {
  res.send("I told my wife she should embrace her mistakes..She gave me a hug.!");
  console.log("This is a console.log message.");
});

// // Connect to mongodb server
// const MongoClient = require("mongodb").MongoClient;
// /* Your url connection to mongodb container */

// GET method route
// Retrieve all documents in collection
app.get("/api/users", async function (req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("users");
    const users = await col.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error al recuperar los usuarios");
  } finally {
    client.close();
  }
});

// GET method route
// Query by a certain field(s)
app.get("/api/usersby", async function (req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("users");

    // Convertir los valores "true" y "false" a booleanos
    for (let key in req.query) {
      if (req.query[key].toLowerCase() === "true") req.query[key] = true;
      else if (req.query[key].toLowerCase() === "false") req.query[key] = false;
      else if (!isNaN(req.query[key])) req.query[key] = Number(req.query[key]);
    }
    console.log(req.query);
    const users = await col.find(req.query).toArray();
    res.json(users);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error al recuperar los usuarios");
  } finally {
    client.close();
  }
});

/* PUT method. Modifying the message based on certain field(s). 
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
app.put("/api/users/:id", async function (req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("users");
    const result = await col.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { upsert: true }
    );
    if (result.upsertedCount > 0) {
      res.status(201).json({ message: 'User created' });
    } else {
      res.status(200).json({ message: 'User updated' });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error updating user");
  } finally {
    client.close();
  }
});
// PUT a user by any parameter
app.put("/api/users", async function (req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("users");
    const result = await col.updateOne(
      req.query,
      { $set: req.body },
      { upsert: true }
    );
    if (result.upsertedCount > 0) {
      res.status(201).json({ message: 'User created' });
    } else if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'User updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error updating user");
  } finally {
    client.close();
  }
});

// DELETE a user by ID
app.delete("/api/users/:id", async function (req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("users");
    const result = await col.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted' });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error deleting user");
  } finally {
    client.close();
  }
});
// DELETE a user by any parameter
app.delete("/api/users", async function (req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("users");
    const result = await col.deleteOne(req.query);
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted' });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error deleting user");
  } finally {
    client.close();
  }
});





app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);