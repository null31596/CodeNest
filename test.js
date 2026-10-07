let timer = null;
let startTime = 0;
let isRunning = false;
let elapsdTime = 0;


const start = () => {
    if (!isRunning) {
        startTime = Date.now();
        timer = setInterval(update, 10)
        isRunning = true;
        console.log(timer)
    }

}
const stop = () => {
    if (isRunning) {
        clearInterval(timer)
        elapsdTime = Date.now() - startTime;
        isRunning=false
    }
}

function update() {
    elapsdTime = Date.now() - startTime


    let hour = Math.floor(elapsdTime / (1000 * 60 * 60))

    let minut = Math.floor(elapsdTime / (1000 * 60) % 60)
    let second = Math.floor(elapsdTime / 1000 % 60)
    console.log(`${hour}:${minut}:${second}`)
}


