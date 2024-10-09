// js/script.js

// GSAP Animation Setup
gsap.registerPlugin(Draggable);

// Split the intro text into draggable word spans
const introText = document.querySelector('.intro');
let introWords = introText.innerHTML.split(' ');
introText.innerHTML = introWords.map(word => `<span class="word">${word}</span>`).join(' ');

const tako = document.getElementById('tako');
const takoGif = document.getElementById('tako-gif');
const tako3 = document.getElementById('tako3');
const takoEat = document.getElementById('tako-eat');
const feedTakoText = document.getElementById('feed-tako');

let clickCount = 0;
let wordCount = 0;
let takoSize = { width: 200, height: 200 }; // Initial size

// Show GIF and then tako3 after several clicks
function handleClick() {
    clickCount++;
    if (clickCount >= 3) {
        gsap.to(tako, { width: 100, height: 100, duration: 0.5, onComplete: () => {
            tako.style.display = 'none';
            takoGif.style.display = 'block';
            feedTakoText.style.display = 'none'; // Hide initially

            setTimeout(() => {
                takoGif.style.display = 'none';
                tako3.style.display = 'block';
                enableDragging();
                tako3.addEventListener('click', showFeedTakoText);
            }, 3000); // Adjust timing as needed

            // Transform words into cookies
            transformWordsToCookies();
        }});
    }
}

tako.addEventListener('click', handleClick);

// Show feed text when clicking on tako3
function showFeedTakoText() {
    feedTakoText.style.display = 'block';
    setTimeout(() => {
        feedTakoText.style.display = 'none';
    }, 2000); // Display for 2 seconds
}

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
                const rect2 = tako3.getBoundingClientRect();

                if (rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
                    this.target.style.display = 'none';
                    wordCount++;

                    // Show eating animation
                    showEatingAnimation(tako3, () => {
                        // Increase the size of tako3
                        gsap.to(tako3, { width: `+=10px`, height: `+=10px`, onUpdate: function() {
                            takoSize.width = tako3.clientWidth;
                            takoSize.height = tako3.clientHeight;
                        }});

                        if (wordCount >= 5) {
                            tako3.style.display = 'none';
                            tako.style.display = 'block';
                            tako.style.width = `${takoSize.width}px`;
                            tako.style.height = `${takoSize.height}px`;
                            enableDraggingForTako();
                        }
                    });
                }
            }
        });
    });
}

// Show eating animation
function showEatingAnimation(takoElement, callback) {
    const takoRect = takoElement.getBoundingClientRect();
    takoEat.style.width = `${takoRect.width}px`;
    takoEat.style.height = `${takoRect.height}px`;
    takoElement.style.display = 'none';
    takoEat.style.display = 'block';

    setTimeout(() => {
        takoEat.style.display = 'none';
        takoElement.style.display = 'block';
        callback();
    }, 1500); // Adjust timing as needed
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

                    // Show eating animation
                    showEatingAnimation(tako, () => {
                        // Increase the size of Tako
                        gsap.to(tako, { width: `+=20px`, height: `+=20px`, onUpdate: function() {
                            takoSize.width = tako.clientWidth;
                            takoSize.height = tako.clientHeight;
                        }});
                    });
                }
            }
        });
    });
}
