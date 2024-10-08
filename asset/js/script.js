// js/script.js

// GSAP Animation Setup
gsap.registerPlugin(Draggable);

// Split the intro text into draggable word spans
const introText = document.querySelector('.intro');
let introWords = introText.innerHTML.split(' ');
introText.innerHTML = introWords.map(word => `<span class="word">${word}</span>`).join(' ');

const tako = document.getElementById('tako');
const takoGif = document.getElementById('tako-gif');
const tako2 = document.getElementById('tako2');
const feedTakoText = document.getElementById('feed-tako');

let clickCount = 0;
let wordCount = 0;
let takoSize = { width: 200, height: 200 }; // Initial size

// Show GIF and then Tako2 after several clicks
function handleClick() {
    clickCount++;
    if (clickCount >= 3) {
        gsap.to(tako, { width: 100, height: 100, duration: 0.5, onComplete: () => {
            tako.style.display = 'none';
            takoGif.style.display = 'block';
            feedTakoText.style.display = 'block';

            setTimeout(() => {
                takoGif.style.display = 'none';
                tako2.style.display = 'block';
                feedTakoText.style.display = 'none';
                enableDragging();
            }, 3000); // Adjust timing as needed

            // Transform words into cookies
            transformWordsToCookies();
        }});
    }
}

tako.addEventListener('click', handleClick);

// Transform words into cookies
function transformWordsToCookies() {
    const words = document.querySelectorAll('.word');
    words.forEach(word => {
        word.classList.add('cookie');
    });
}

// Enable dragging after showing the message
function enableDragging() {
    const words = document.querySelectorAll('.cookie');
    words.forEach(word => {
        Draggable.create(word, {
            bounds: 'body',
            onDragEnd: function() {
                const rect1 = this.target.getBoundingClientRect();
                const rect2 = tako2.getBoundingClientRect();

                if (rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
                    this.target.style.display = 'none';
                    wordCount++;

                    // Increase the size of Tako2
                    gsap.to(tako2, { width: `+=20px`, height: `+=20px`, onUpdate: function() {
                        takoSize.width = tako2.clientWidth;
                        takoSize.height = tako2.clientHeight;
                    }});

                    if (wordCount >= 5) {
                        tako2.style.display = 'none';
                        tako.style.display = 'block';
                        tako.style.width = `${takoSize.width}px`;
                        tako.style.height = `${takoSize.height}px`;
                        enableDraggingForTako();
                    }
                }
            }
        });
    });
}

function enableDraggingForTako() {
    const words = document.querySelectorAll('.cookie');
    words.forEach(word => {
        Draggable.create(word, {
            bounds: 'body',
            onDragEnd: function() {
                const rect1 = this.target.getBoundingClientRect();
                const rect2 = tako.getBoundingClientRect();

                if (rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
                    this.target.style.display = 'none';

                    // Increase the size of Tako
                    gsap.to(tako, { width: `+=20px`, height: `+=20px`, onUpdate: function() {
                        takoSize.width = tako.clientWidth;
                        takoSize.height = tako.clientHeight;
                    }});
                }
            }
        });
    });
}
