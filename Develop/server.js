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

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/workout',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

app.get("/", function(req, res) {
  res.json(path.join(__dirname, "public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(__dirname + '/public/exercise.html', (err) => {
    if (err) throw err;
  })
});

app.get("/stats", (req, res) => {
  res.sendFile(__dirname + '/public/stats.html', (err) => {
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

app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({})
  .then(data => {
    console.log("Data retireved for dashboard");
    res.json(data);
  })
  .catch(({message}) => {
    res.json(message);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});