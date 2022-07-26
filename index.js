//const { json } = require("express");
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb, connectToDb } = require("./db");

// init app & middleware
const app = express();
app.use(express.json());

//db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
    db = getDb();
  }
});

//routes

app.get("/books", (req, res) => {
  const page = req.query.page || 0;
  const bookPerPage = 3;
  let books = [];
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * bookPerPage)
    .limit(bookPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not fetch documents" });
    });
  //   res.json({ msg: "welcome to the api !" });
});

app.get("/books/:id", (req, res) => {
  let id = req.params.id;

  if (ObjectId.isValid(id)) {
    db.collection("books")
      .findOne({ _id: ObjectId(id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch documents" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create new document" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete documents" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});

app.patch("/books/:id", (req, res) => {
  const updateds = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updateds })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not update documents" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});
