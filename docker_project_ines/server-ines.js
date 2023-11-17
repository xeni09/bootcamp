const { MongoClient } = require("mongodb");
const express = require("express");
// Constants
const hostname = "0.0.0.0";
const port = 8080;
const url = "mongodb://mongodb:27017";
const dbName = "mock-database";

// App
const app = express();

// GET method route
app.get("/", function (req, res) {
  res.send("GET request to the homepage - I can't believe it works!");
});

// POST method route
app.post("/", function (req, res) {
  res.send("POST request to the homepage - I can't believe it works!");
});

// GET method route
app.get("/secret", function (req, res, next) {
  res.send("I told my wife she should embrace her mistakes. She gave me a hug.");
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
    const users = await col.updateOne(
      { id: req.params.id },
      {
        $set: req.body,
      },
      { upsert: true }
    );
    res.json(users);
    client.close();
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error al actualizar el usuario");
  } finally {
    client.close();
  }
});

/* DELETE method. Modifying the message based on certain field(s).
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
app.delete("/api/users/:id", async function (req, res) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("users");
    const users = await col.deleteOne({ id: req.params.id });
    res.json(users);
    client.close();
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error al eliminar el usuario");
  } finally {
    client.close();
  }
});

app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);
