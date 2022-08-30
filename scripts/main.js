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
    textArea = document.getElementById('sample_text');
    textArea.value += sampleText;
    keyDownLabel = document.getElementById('key_down');
    keyUpLabel = document.getElementById('key_up');
    locationLabel = document.getElementById('location');
    document.addEventListener('keydown', (event) => {
        event.preventDefault();
        keyDownLabel.innerHTML = event.key;
        locationLabel.innerHTML = event.location;
    });
    document.addEventListener('keyup', (event) => {
        keyDownLabel.innerHTML = '';
        locationLabel.innerHTML = '';
        keyUpLabel.innerHTML = event.key
        window.setTimeout(() => {
            keyUpLabel.innerHTML = "";
        }, 1000);
    });
}