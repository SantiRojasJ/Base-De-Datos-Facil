const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const time = document.getElementById("time");


playBtn.addEventListener("click", () => {

    if(audio.paused){
        audio.play();
        playBtn.textContent = "⏸";
    }else{
        audio.pause();
        playBtn.textContent = "▶";
    }

});


audio.addEventListener("timeupdate", () => {

    progress.max = audio.duration;

    progress.value = audio.currentTime;

    const minutos = Math.floor(audio.currentTime / 60);
    const segundos = Math.floor(audio.currentTime % 60);

    time.textContent =
        `${String(minutos).padStart(2,"0")}:${String(segundos).padStart(2,"0")}`;

});


progress.addEventListener("input", () => {

    audio.currentTime = progress.value;

});