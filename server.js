const express = require("express");
const app = express();
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT;

//---- DB Mongo og Mongoose
//------------------------------------------------------------
const mongoose = require("mongoose");
//mongoose.connect(process.env.DB_LOCAL_URL, {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,asdasd
//});
mongoose.connect(process.env.DB_REMOTE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log("FEJL: " + error));
db.once("open", () =>
  console.log("/// ---> så er der hul igennem til databasen!")
);

//----APP-----------------------------------------------------
//------------------------------------------------------------
app.use(cors())                                //alle har adgang hvis man ikke skriver noget
app.use(express.json());                       //håndtere json
app.use(express.urlencoded({extended: true})); //håndtere urlencoded
app.use(express.static("public"))              //adgang til statiske filer f.eks img udefra sendes ind i public mappen

//---- GET serverens endpoint: http://localhost:5000
//------------------------------------------------------------
app.get("/", async (req, res) => {
  console.log("Der var et request til serverens endpoint/startpoint");

  res.status(200).json({
    message: "Velkommen til serverens start-endpoint",
  });
});

//----ROUTES
//---------------------------------------------------------------
app.use("/haveservice", require("./routes/haveservice.routes"));

//---- NO MATCH
//---------------------------------------------------------------
app.get("*", async (req, res) => {
  res.status(404).json({ message: "siden findes ikke" });
});

//----LISTEN - starter server
//--------------------------------------------------------------------
app.listen(PORT, () =>
  console.log("/// ----> her er din server som lytter på port:" + PORT)
);
