var express = require("express");
var bodyParser = require("body-parser");
var Request = require("request");
var cors = require('cors');
var app = express();
app.use(bodyParser.json());
//app.use(cors());
var db;


const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require("bson");
const uri = "mongodb+srv://zmmadewell:sYjauy6CuiaTPMgd@cluster0.via3r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("zmmadewell").collection("zmmadewell");
  const submissions = client.db("submissions").collection("submissions");
  console.log("Connected to DB");
  
  db = client.db();
});

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});

const corsOptions = {
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }

  app.use(cors(corsOptions));

app.get('/', (req, res) => res.send('Quiz App. Connect to an endpoint. (Postman.)'));

app.get("/quizzes/", function(req, res) {
    db.collection("zmmadewell").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get quizzes.");
        } else {
            res.status(200).json(docs);
        }
    });
});


app.get("/quizzes/:id", function(req, res) {

    let id = req.params.id
    db.collection('zmmadewell').findOne({_id: ObjectId(id) }, function(err, quiz) {
        if (err) {
            handleError(res, err.message, "Failed to get quiz.");
        } else {
            res.status(200).json(quiz);
        }
    });
});

app.post("/new/", function(req, res) {
    let body = (req.body);
	console.log(body);
	db.collection("zmmadewell").insertOne(body, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to create new quiz.");
		} else {
			res.status(201).send(JSON.stringify(body));
		}
	});
  }
);

app.post("/quiz/:id", function(req, res) {
    let body = (req.body);
	console.log(body);

    var submission = {
        quiz_id: req.params.id, //referenc quiz id 
        answers: req.body.answers // user answers 
    }

	db.collection("submissions").insertOne(submission, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to create new submission.");
		} else {
			res.status(201).send(doc);

		}
	});
  }
);

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}