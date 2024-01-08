require("dotenv").config({path: __dirname + "/spotify.env"});
let fs = require("fs");
let os = require("os");
/**
 * automatically updates the bearer token every 55 minutes, if updateNow is true, it will update immediately and then every 55 minutes
 * @param {boolean} updateNow 
 * @returns {void}
 */
async function updateBearer(updateNow=false) {    
    if(updateNow) {
        call();
    }
    setInterval(call,3300000); // update every 55 minutes


    async function call() {
        let res = await fetch("https://accounts.spotify.com/api/token",{
            "method": "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            "body": `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
        }).then(response => response.json())

        _setEnvValue("BEARER", res.access_token);
    }
}

/**
 * given a string artist, returns an array of song objects by artist
 * @param {string} artist
 * @returns {Promise<Array<{id: string, name: string, preview_url: string, spotify_url: string}>>}
 */
async function getSongs(artist) {
    return await getSongsFromAlbums(await getAlbumsByArtistID(await getArtistID(artist)))
}


/**
 * given a string artist, returns a random song objects by the artist
 * @param {string} artist
 * @returns {Promise<{id: string, name: string, preview_url: string, spotify_url: string}>}
 */
async function getRandomSong(artist) {
    let songs = await getSongs(artist);
    if(songs.length == 0) {
        return [];
    }
    return songs[Math.floor(Math.random()*songs.length)];
}



async function getArtistID(artist) {
    let res = await fetch("https://api.spotify.com/v1/search?q="+ artist +"&type=artist&market=US&limit=1", {
        headers: {
            "Authorization": "Bearer " + process.env.BEARER
        }
    })

    res = await res.json();
    try{
        return res.artists.items[0].id;
    } catch(e) {
        console.log("could not find items in getArtistID");
        return "";
    }

}

async function getAlbumsByArtistID(artistID) {
    let res = await fetch("https://api.spotify.com/v1/artists/"+ artistID +"/albums?include_groups=album&market=US&limit=50", {
        headers: {
            "Authorization": "Bearer " + process.env.BEARER
        }
    })

    res = await res.json();
    try{
        let output =  res.items;
        let albums = {};
        for(let i = 0; i < output.length; i++) {
            if(Object.keys(albums).includes(output[i].name) || output[i].total_tracks < 5 || output[i].name.includes("Deluxe") || output[i].name.includes("Remix") || output[i].name.includes("Remastered") || output[i].name.includes("Live") || output[i].name.includes("Acoustic") || output[i].name.includes("Instrumental") || output[i].name.includes("Demo") || output[i].name.includes("Edit") || output[i].name.includes("Version") || output[i].name.includes("Mix")) {
                continue;
            }
            albums[output[i].name] = output[i];
        }
        return albums
    } catch(e) {
        console.log("could not find items in getAlbumsByArtist");
        return [];
    }


}

async function getSongsFromAlbums(albums) {
    let keys = Object.keys(albums);
    let ret = [];
    for(let i = 0; i < keys.length; i++) {
        let res = await fetch("https://api.spotify.com/v1/albums/"+ albums[keys[i]].id +"/tracks?market=US&limit=50", {
            headers: {
                "Authorization": "Bearer " + process.env.BEARER
            }
        })
        res = (await res.json()).items;
        for(let i = 0; i<res.length; i++) {
            if(res[i].preview_url == null || res[i].duration_ms < 60000 || res[i].name.includes("Remix") || res[i].name.includes("Remastered") || res[i].name.includes("Live") || res[i].name.includes("Acoustic") || res[i].name.includes("Instrumental") || res[i].name.includes("Demo") || res[i].name.includes("Edit") || res[i].name.includes("Version") || res[i].name.includes("Mix")) {
                continue;
            }
            ret.push({
                id:res[i].id, 
                name:res[i].name, 
                preview_url:res[i].preview_url, 
                spotify_url:res[i].external_urls.spotify
            });
        }
        
    }
    return ret;
}

async function getSongImg(song_id) {
    let img = fetch("https://api.spotify.com/v1/tracks/"+ song_id, {
        headers: {
            "Authorization": "Bearer " + process.env.BEARER
        }
    }).then(res => res.json()).then(res => {
        return res.album.images[0].url;
    
    });

    return img;
}

// found this function on stack overflow, it's not mine
function _setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync(__dirname + "/spotify.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync(__dirname + "/spotify.env", ENV_VARS.join(os.EOL));

}


module.exports = {updateBearer,getSongs,getRandomSong,getSongImg};