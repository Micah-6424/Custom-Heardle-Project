

let {preview_url, name,img} = the_song;

let audio = new Audio(preview_url);
let audio_playing = false;

console.log(img);

document.querySelector("button").addEventListener("click", () => {
    if(audio_playing) {
        audio.pause();
        audio_playing = false;
        return;
    } else {
        //restart the audio
        audio.currentTime = 0;
        audio.play();
        audio_playing = true;
    }
});