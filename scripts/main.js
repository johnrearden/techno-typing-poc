import { key_data } from '../data/key_data.js';

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

let lastTime = 0;
const MAX_INTERVAL = 500;
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

const fgMainColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--fg-main');
const fgLightColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--fg-light');
const bgDeepColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg-deep');
const bgMediumColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg-medium');
const bgLightColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg-light');

function init() {
    const keyMap = createKeyMap();
    const textArea = document.getElementById('sample_text');
    textArea.value += sampleText;
    const keyDownLabel = document.getElementById('key_down');
    const keyUpLabel = document.getElementById('key_up');
    const locationLabel = document.getElementById('location');

    document.addEventListener('keydown', (event) => {
        //event.preventDefault();
        const currentTime = new Date().getTime();
        const timeSinceLastKey = lastTime === 0 ? 0 : currentTime - lastTime;
        lastTime = currentTime;
        const timeLabel = document.getElementById('time_since_last');
        timeLabel.innerHTML = timeSinceLastKey;
        keyDownLabel.innerHTML = event.key;
        locationLabel.innerHTML = event.location;
        const keyIsLetter = event.key.match(/[a-z]/i) && event.key.length === 1;
        let key = keyIsLetter ? event.key.toLowerCase() : event.key;
        const data = keyMap[event.location][key]
        data.averageList.push(timeSinceLastKey);
        calculateAverage(data);
        drawKey(data, true);
    });

    document.addEventListener('keyup', (event) => {
        keyDownLabel.innerHTML = '';
        locationLabel.innerHTML = '';
        keyUpLabel.innerHTML = event.key
        const keyIsLetter = event.key.match(/[a-z]/i) && event.key.length === 1;
        let key = keyIsLetter ? event.key.toLowerCase() : event.key;
        const data = keyMap[event.location][key]
        drawKey(data, false);
        window.setTimeout(() => {
            keyUpLabel.innerHTML = "";
        }, 1000);
    });

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgDeepColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let item in key_data) {
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
    let single_char_label = true;
    if (data.mainLabel.length > 1) {
        single_char_label = false;
    }
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = fgMainColor;
    ctx.font = single_char_label ? '20px Kanit' : '14px Kanit';
    ctx.lineWidth = 1;

    // Draw side of key
    if (data.key === 'Enter' && data.location === 0) {
        ctx.beginPath();
        ctx.moveTo(data.path[0][0], data.path[0][1])
        for (let point of data.path) {
            ctx.lineTo(point[0], point[1]);
        }
        ctx.closePath();
        ctx.fillStyle = highlighted ? fgMainColor : bgLightColor;
        ctx.fill();
        ctx.strokeStyle = bgMediumColor;
        ctx.stroke();
    } else {
        ctx.fillStyle = highlighted ? fgMainColor : bgLightColor;
        ctx.fillRect(data.xPos, data.yPos, data.xSize, data.ySize);
        ctx.strokeStyle = bgMediumColor;
        ctx.strokeRect(data.xPos, data.yPos, data.xSize, data.ySize);
    }

    // Draw face of key
    if (data.key === 'Enter' && data.location === 0) {
        ctx.beginPath();
        ctx.moveTo(data.path[0][0], data.path[0][1])
        for (let point of data.path) {
            ctx.lineTo(point[0], point[1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else {
        let x = data.xPos + 3;
        let y = data.yPos + 3;
        let w = data.xSize - 6;
        let h = data.ySize - 6;
        let r = 5;
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
        ctx.fillStyle = bgMediumColor;
        ctx.fill();
        ctx.fillStyle = fgMainColor;
    }

    // Draw text on key
    ctx.fillStyle = highlighted ? fgMainColor : fgLightColor;
    if (data.upperLabel === '') {
        ctx.fillText(data.mainLabel, data.xPos + 10, data.yPos + 30);
    } else {
        ctx.fillText(data.mainLabel, data.xPos + 10, data.yPos + 42);
        ctx.fillText(data.upperLabel, data.xPos + 10, data.yPos + 22);
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
        if (data.upperLabel != '') {
            obj[data.upperLabel] = data
        }
        data['averageList'] = []
        data['average'] = 0
    }
    return keyMap;
}