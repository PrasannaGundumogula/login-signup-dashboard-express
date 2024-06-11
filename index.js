const express = require("express");
const app = express();
const PORT =process.env.PORT||3000;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");


app.get("/signin", (req, res) => {
  res.render("signin");
});

 app.use(express.static(__dirname + "/img"));


app.get("/signinsubmit", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;  
  db.collection('users')
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.render("web");
      }
      else {
        res.send("<h1>Login failed ,correct the login credentials</h1>");
      }
    });
});

app.get("/signupsubmit", (req, res) => {
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  const password = req.query.password;
  db.collection('users')
    .add({
      name: firstname + lastname,
      email: email,
      password: password,
    })
    .then(() => {
      res.render("signin");
    });
});


app.get("/navsubmit", (req, res) => {
    res.render("signin")
});

app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/web", (req, res) => {
  res.render("web");
});



app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "views/index.ejs"));
});

app.listen(PORT,()=>{ console.log(`Listening on http://localhost:${PORT}`)});