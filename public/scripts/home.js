// global variables
let artist_input = document.getElementById("artist_input");
let submit = document.getElementById("submit");


// event listeners
submit.addEventListener("click", submitArtist);
artist_input.addEventListener("keypress", key => key.key == "Enter" && submitArtist());

// functions
async function submitArtist() {
    // disable the submit btn
    submit.disabled = true;
    
    let artist = artist_input.value;
    
    if(artist.trim() == "") { //if artist value is not given
        alert("Please input an artist.");
        submit.disabled = false;
        return;
    }

    // fetch from server
    let songs_found = await fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({artist})
    }).then(response => (response.status == 200));


    // if no songs are found
    if(!songs_found) {
        alert("No songs found.");
        submit.disabled = false;
        return;
    } 

    // if songs were found, redirect to /Artist-Name-In-Caps
    window.location.href = "/" + artist.split(" ").map(word => word[0].toUpperCase() + word.substring(1)).join("-");
    submit.disabled = false;
}

// // plays the song url for the first time seconds
// function playSong(song,time) {
//     let audio = new Audio(song);
//     audio.play();
//     setTimeout(() => {
//         audio.pause();
//         submit.disabled = false;
//     }, time*1000);
// }