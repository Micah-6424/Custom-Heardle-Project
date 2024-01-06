let fs = require("fs");
const { getSongs, updateBearer,getRandomSong } = require("./modules/Spotify");

(async () => {
    let songs = await getRandomSong("Marina");
    console.log(songs);
})();
