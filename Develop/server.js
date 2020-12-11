const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.get("/exercise", (req, res) => {
  res.sendFile(__dirname + '/public/exercise.html', (err) => {
    if (err) throw err;
  })
});

app.get('/api/workouts', (req, res) => {
  db.Workout.find({})
  .then(data => {
    console.log("Last workout retrieved from database");
    res.json(data);
  })
  .catch(({message}) => {
    res.json(message);
  });
});

app.post("/api/workouts", (req, res) => {
  db.Workout.create(req.body)
  .then(data => {
    console.log("workout created.");
    res.json(data);
  })
  .catch(({message}) => {
    console.log(message);
  });
});

app.put("/api/workouts/:id", (req, res) => {
  console.log(req.body);
  db.Workout.updateOne({_id: req.params.id}, {$push: { exercises: req.body}})
    .then(data => {
      console.log("exercise added");
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

// app.get("/books", (req, res) => {
//   db.Book.find({})
//     .then(dbBook => {
//       res.json(dbBook);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// app.get("/library", (req, res) => {
//   db.Library.find({})
//     .then(dbLibrary => {
//       res.json(dbLibrary);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// app.get("/populated", (req, res) => {
//   db.Library.find({})
//     .populate("books")
//     .then(dbLibrary => {
//       res.json(dbLibrary);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});