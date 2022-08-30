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

function init() {
    const keyMap = createKeyMap();
    const textArea = document.getElementById('sample_text');
    textArea.value += sampleText;
    const keyDownLabel = document.getElementById('key_down');
    const keyUpLabel = document.getElementById('key_up');
    const locationLabel = document.getElementById('location');

    document.addEventListener('keydown', (event) => {
        event.preventDefault();
        keyDownLabel.innerHTML = event.key;
        locationLabel.innerHTML = event.location;
        const data = keyMap[event.location][event.key]
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

function drawKey(data, highlighted) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.fillStyle = highlighted ? '#ffa' : '#aaa';
    ctx.font = '20px Georgia';
        ctx.lineWidth = 1;
    if (data.key !== 'Enter') {
        ctx.fillRect(data.xPos, data.yPos, data.xSize, data.ySize);
        ctx.strokeRect(data.xPos, data.yPos, data.xSize, data.ySize);
        ctx.fillStyle = '#000';
        ctx.fillText(data.mainLabel, data.xPos + 5, data.yPos + 20);
    } else {
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
    }
    return keyMap;
}