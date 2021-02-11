const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
const numberOfParticles = 400;

//get mouse position 
const mouse = {
    x: null,
    y: null,
    radius: 100
}
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x + canvas.clientLeft / 2;
    mouse.y = event.y + canvas.clientTop / 2;
    // console.log(mouse.x, mouse.y);
});

function drawImage() {
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    class Particle {
        constructor(x, y, color, size) {
            this.x = x + canvas.width / 2 - png.width * 2,
                this.y = y + canvas.height / 2 - png.height * 2,
                this.color = color,
                this.size = 2,
                this.baseX = x + canvas.width / 2 - png.width * 2,
                this.baseY = y + canvas.height / 2 - png.height * 2,
                this.density = (Math.random() * 15) + 5;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            // collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            // max distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if (distance < mouse.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                } if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
            this.draw()

        }
    }
    function init() {
        particleArray = [];

        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," + data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                        data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color));
                }

            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize', function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
}

const png = new Image();
png.src = "data:image/png;base64,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";

window.addEventListener('load', (event) => {
    // console.log("loaded");
    ctx.drawImage(png, 0, 0);
    drawImage();
});


