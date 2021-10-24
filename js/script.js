const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Making sure the canvas covers the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// Centering the letter for my device
let adjustX = 24;
let adjustY = 1;

// Circular mouse shape init
const mouse = {
    x: null,
    y: null,
    radius: 100
}
window.addEventListener('mousemove', function(evt){
    mouse.x = evt.x;
    mouse.y = evt.y;
    mouse.radius = 100;
    // console.log(mouse.x, mouse.y);
});

ctx.font = '30px Verdana';
ctx.fillStyle = 'white';
ctx.fillText('C', 0, 30);


// ————————————————————————————— //
// ———— Scanning the canvas ———— //
// ————————————————————————————— //

// This commented code makes me see the border of the scanned area
// ctx.strokeStyle = 'white';
// ctx.strokeRect(0, 0, 100, 100);

const textCoordinates = ctx.getImageData(0, 0, 100, 100);


// Particle class
class Particle{
    // Setting the blueprint for the particles
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 2.5;

        // Saving the origin coordinates
        this.baseX = this.x;
        this.baseY = this.y;

        // How heavy the particles are
        this.density = (Math.random()*20)+1;
    }
    // This method draws a circle with the coordinates of the constructor
    draw(){
        ctx.fillStyle = 'white';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    // This method calculates the distance between mouse position and particles position.
    // If they're close enough I want particles to be pushed away
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance = Math.sqrt(dx*dx + dy*dy);

        // Creating force
        let forceDirectionX = dy/distance;
        let forceDirectionY = dy/distance;

        // This is the distance where the speed of the particles will be 0
        let maxDistance = mouse.radius;

        // Slowing down the particles far from the mouse
        let force = (maxDistance - distance) / maxDistance;

        // Changing the directions with the force action and the mass
        let directionX = forceDirectionX*force*this.density;
        let directionY = forceDirectionY*force*this.density;

        if(distance < mouse.radius){
            // Moving particles away on mouseover
            // If I multiplicate the direction *num it will make the movement faster but for me it's ok
            this.x -= directionX;
            this.y -= directionY;
        }else{
            // Return particles to original position
            // I'm dividing it by 5 - the bigger the number, the slower the action
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/5;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/5;
            }
        }
    }
}

// console.log(textCoordinates.data);


// Init the particles
function init(){
    // Setting array to empy in case it's not empty 
    particleArray = [];

    // Scanning row per row
    for(let y=0, y2 = textCoordinates.height; y<y2; y++ ){
        for(let x=0, x2 = textCoordinates.width; x<x2; x++ ){
            // Taking the 4th value because in a Uint8ClampedArray the 4th value is opacity
            if(textCoordinates.data[(y*4*textCoordinates.width) + (x*4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX*20, positionY*20));
            }
        }
    }

    // for(let i=0; i<1000; i++){
    //     // Creating two sample variables to pass to the called constructor below.
    //     // Randoming for the whole canvas area (so canvas.w and h)
    //     let x = Math.random()*canvas.width; 
    //     let y = Math.random()*canvas.height;
    //     // I'm pushing in the particle array a new object based on the constructor method of the Particle class. I'm passing attributes bc the constructor has two (x,y)
    //     particleArray.push(new Particle(x, y));
    // }
}

// Evoking the function abracadabra
init();
console.log(particleArray);

// Making a function that will handle the animation loop
function animate(){
    // Clearing the rect
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scanning the particle Array and calling draw method for every instance
    for(let i=0; i<particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }

    // Calling connect function (lower)
    connect();

    // Recursion
    requestAnimationFrame(animate);
}
// Evoking the function abracadabra
animate();


// This function cycles through every particle and measure the distance between them.
// If they're close enough* it'll draw a line that connects them
function connect(){
    for(let a=0; a<particleArray.length; a++){
        for(let b=a; b<particleArray.length; b++){
            // Setting same variables but with the particles that now exist in my array
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);


            // (*)This statement works only if the distance is enough (arbitrary)
            if(distance<150){
                opacityValue = 0.1;
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                
                // Init new path
                ctx.beginPath();

                // Connecting from a to b
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);

                ctx.stroke();
            }
        }
    }
}