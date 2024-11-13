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

// Biến HP ban đầu
let takoHP = 100;
const hpBar = document.querySelector('.hp-bar');
const hpBarInner = document.getElementById('hp-bar-inner');

// Cập nhật HP
function updateHP(amount) {
    takoHP += amount;
    if (takoHP > 100) takoHP = 100;
    if (takoHP < 0) takoHP = 0;

    hpBarInner.style.width = `${takoHP}%`;
    hpBarInner.style.backgroundColor = takoHP > 20 ? '#66923d' : '#e5652e';

    if (takoHP === 0) {
        console.log('Tako đã chết!');
    }
}

// Giảm HP khi bị đánh
function reduceHP() {
    updateHP(-20); // Giảm 20 HP
}

// Hồi phục HP khi ăn bánh quy
function restoreHP() {
    updateHP(20); // Tăng 20 HP
}

// Ẩn thanh máu khi chưa click vào Tako
hpBar.style.display = 'none';

// Hiển thị thanh máu và đánh Tako
function hitTako() {
    hpBar.style.display = 'block';
    reduceHP();
    playGifAnimation(); // Chạy animation takogif khi đánh
}

// Sự kiện click đầu tiên vào Tako
function handleClick() {
    clickCount++;
    if (clickCount === 1) {
        hpBar.style.display = 'block'; // Hiển thị thanh máu ngay từ lần click đầu tiên
        reduceHP(); // Giảm HP từ lần click đầu tiên

        gsap.to(tako, { width: 100, height: 100, duration: 0.5, onComplete: () => {
            tako.style.display = 'none';
            takoGif.style.display = 'block';
            feedTakoText.style.display = 'none'; // Ẩn ban đầu

            setTimeout(() => {
                takoGif.style.display = 'none';
                tako3.style.display = 'block';
                enableDragging();
                tako3.addEventListener('click', showFeedTakoText);
                tako3.addEventListener('click', hitTako); // Thêm sự kiện đánh vào tako3
            }, 1000);

            // Biến đổi các từ thành cookie
            transformWordsToCookies();
        }});
    } else {
        hitTako();
    }
}

tako.addEventListener('click', handleClick);

// Hiển thị text "Feed the Tako" khi click vào tako3
function showFeedTakoText() {
    feedTakoText.style.display = 'block';
    setTimeout(() => {
        feedTakoText.style.display = 'none';
    }, 2000); // Hiển thị trong 2 giây
}

// Biến đổi các từ thành cookie
function transformWordsToCookies() {
    const words = document.querySelectorAll('.word');
    words.forEach(word => {
        word.classList.add('cookie');
    });
}

// Kéo thả cookie cho Tako ăn
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

                    // Hiển thị animation ăn
                    showEatingAnimation(tako3, () => {
                        restoreHP(); // Hồi phục HP khi ăn cookie

                        // Tăng kích thước của tako3
                        gsap.to(tako3, { width: `+=10px`, height: `+=10px`, onUpdate: function() {
                            takoSize.width = tako3.clientWidth;
                            takoSize.height = tako3.clientHeight;
                        }});

                        if (wordCount >= 3) {
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

// Hiển thị animation ăn
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
    }, 1500); // Điều chỉnh thời gian theo nhu cầu
}

// Chạy animation takogif khi bị đánh
function playGifAnimation() {
    tako3.style.display = 'none';
    takoGif.style.display = 'block';

    setTimeout(() => {
        takoGif.style.display = 'none';
        tako3.style.display = 'block';
    }, 1000); // Thời gian chạy animation có thể điều chỉnh
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

                    // Hiển thị animation ăn
                    showEatingAnimation(tako, () => {
                        // Tăng kích thước của Tako
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


