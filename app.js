// require packages
require("dotenv").config();
let fs = require("fs");
let express = require("express");
const { getSongs, updateBearer,getSongImg} = require("./modules/Spotify");

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
    
    let song_names = songs.map(song => song.name);
    // get a random song using math.random
    let the_song = songs[Math.floor(Math.random()*songs.length)];
    the_song["img"] = await getSongImg(the_song.id);
    // render the game page
    res.render("game",{song_names,the_song,artist});
});


// start server
app.listen(port,() => {
    console.log(`server started on port ${port}`)
})
