import {key_data} from '../data/key_data.js';

document.addEventListener('DOMContentLoaded', () => {
    init();
});

const sampleText = `The quick brown fox jumped over the lazy black bear. 
This created a problem for the poor bear, who got so excited that he zipped
his big black fist up and splatted the fox\'s skull all over the prairie.
Here are a few examples of text that a programmer might need to type out:
a[0] = 10;
a[1] = 20;
a[2] = 30'
`

let lastTime = new Date().getTime();
const MAX_INTERVAL = 1000;
const FAST_COLOR = {
    red: 200,
    green: 200,
    blue: 200
}
const SLOW_COLOR = {
    red: 98,
    green: 62,
    blue: 57
}

function init() {
    const keyMap = createKeyMap();
    const textArea = document.getElementById('sample_text');
    textArea.value += sampleText;
    const keyDownLabel = document.getElementById('key_down');
    const keyUpLabel = document.getElementById('key_up');
    const locationLabel = document.getElementById('location');

    document.addEventListener('keydown', (event) => {
        event.preventDefault();
        const currentTime = new Date().getTime();
        const timeSinceLastKey = currentTime - lastTime;
        lastTime = currentTime;
        const timeLabel = document.getElementById('time_since_last');
        timeLabel.innerHTML = timeSinceLastKey;
        keyDownLabel.innerHTML = event.key;
        locationLabel.innerHTML = event.location;
        const data = keyMap[event.location][event.key]
        data.averageList.push(timeSinceLastKey);
        calculateAverage(data);
        drawKey(data, true);
    });

    document.addEventListener('keyup', (event) => {
        keyDownLabel.innerHTML = '';
        locationLabel.innerHTML = '';
        keyUpLabel.innerHTML = event.key
        const data = keyMap[event.location][event.key]
        drawKey(data, false);
        window.setTimeout(() => {
            keyUpLabel.innerHTML = "";
        }, 1000);
    });

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let item in key_data){
        let data = key_data[item];
        drawKey(data, false);
    }
}

function calculateAverage(data) {
    let total = 0;
    for (let item of data.averageList) {
        total += item < MAX_INTERVAL ? item : MAX_INTERVAL;
    }
    let average = total / data.averageList.length;
    data.average = average;
}

function drawKey(data, highlighted) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    if (highlighted) {
        ctx.fillStyle = '#3438a8';
    } else {
        const colorRatio = data.average / MAX_INTERVAL;
        const redRange = SLOW_COLOR.red - FAST_COLOR.red;
        const red = FAST_COLOR.red + redRange * colorRatio;
        const greenRange = SLOW_COLOR.green - FAST_COLOR.green;
        const green = FAST_COLOR.green + greenRange * colorRatio;
        const blueRange = SLOW_COLOR.blue - FAST_COLOR.blue;
        const blue = FAST_COLOR.blue + blueRange * colorRatio;
        ctx.fillStyle = `rgb(${red},${green},${blue})`;
    }
    ctx.font = '20px Georgia';
        ctx.lineWidth = 1;
    if (data.key === 'Enter' && data.location === 0) {
        ctx.beginPath();
        ctx.moveTo(data.path[0][0], data.path[0][1])
        for (let point of data.path){
            ctx.lineTo(point[0], point[1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillText(data.mainLabel, data.xPos + 5, data.yPos + 20);
    } else {
        ctx.fillRect(data.xPos, data.yPos, data.xSize, data.ySize);
        ctx.strokeRect(data.xPos, data.yPos, data.xSize, data.ySize);
        ctx.fillStyle = '#000';
        if (data.upperLabel === '') {
            ctx.fillText(data.mainLabel, data.xPos + 5, data.yPos + 30);
        } else {
            ctx.fillText(data.mainLabel, data.xPos + 5, data.yPos + 45);
            //ctx.font = '14px Georgia';
            ctx.fillText(data.upperLabel, data.xPos + 5, data.yPos + 20);
        }
    }
}

function createKeyMap() {
    const keyMap = {};
    keyMap['0'] = {};
    keyMap['1'] = {};
    keyMap['2'] = {};
    keyMap['3'] = {};

    console.log(keyMap);

    for (let item in key_data) {
        let data = key_data[item];
            let obj = keyMap[data.location]
            obj[data.key] = data;
            if (data.upperLabel != ''){
                obj[data.upperLabel] = data
            }
            data['averageList'] = []
            data['average'] = 0
    }
    return keyMap;
}