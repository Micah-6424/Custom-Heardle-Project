// require packages
require("dotenv").config();
let fs = require("fs");
let express = require("express");
const { getSongs, updateBearer,getRandomSong } = require("./modules/Spotify");

// setup app instance
let app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
let port = process.env.PORT || 3000;



// routes
app.get("/", (req, res) => {
    res.render("home");
});

app.post("/", async (req, res) => {
    console.log("post");
    let songs = await getSongs(req.body.artist);
    res.status(200).json({songs});
});



// start server
app.listen(port,() => {
    console.log(`server started on port ${port}`)
})
