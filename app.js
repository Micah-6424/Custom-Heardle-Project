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
    let songs = await getSongs(req.body.artist);
    
    if(songs.length == 0) { //if no songs are found
        res.status(204).send();
        return;
    }
    // if songs were found
    res.status(200).send();
});


// app get /artist-name
app.get("/:artist", async (req, res) => {    
    let artist = req.params.artist.split("-").join(" ");
    
    let songs = await getSongs(artist)
    
    if(songs.length == 0) { //if no songs are found
        res.redirect("/");
        return;
    }
    res.json(songs);
});


// start server
app.listen(port,() => {
    console.log(`server started on port ${port}`)
})
