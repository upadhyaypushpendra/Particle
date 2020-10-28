const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
const adjustX = 400;
const adjustY = 0;
const resizeX = 6;
const resizeY = 6;

//handle mouse
const mouse = {
    x:null,
    y:null,
    radius :100
};
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    window.addEventListener('touchmove',(event)=>{
        mouse.x = event.x;
        mouse.y = event.y;
    });
} else {
    window.addEventListener('mousemove',(event)=>{
        mouse.x = event.x;
        mouse.y = event.y;
    });
}
// handle window resize
window.addEventListener('resize',(event)=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});
let img = new Image(100,100);
img.src = "anime.png";
let textImageData;
img.onload = () =>{
    ctx.drawImage(img,0,0,100,100);
    textImageData = ctx.getImageData(0,0,100,100);
    init();
    animate();
    //setInterval(animate,10000);
};

class Particle{
    constructor(x,y,r,g,b,a) {
        this.x = x;
        this.y = y;
        this.pixelColor = `rgba(${r},${g},${b},${a})`;
        this.size = 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.fillStyle= this.pixelColor;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx/distance;
        let forceDirectionY = dy/distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance)/maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if(distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}

function init() {
    particles = [];
    let dataHeight = textImageData.height;
    let dataWidth = textImageData.width;
    for(let y = 0; y < dataHeight ; y++){
        for(let x = 0; x < dataWidth ; x++ ){
            let posX = x*resizeX + adjustX;
            let posY = y*resizeY + adjustY;
            let pixelPos = y*4*dataWidth + x*4;
            let r = textImageData.data[pixelPos];
            let g = textImageData.data[pixelPos + 1 ];
            let b = textImageData.data[pixelPos + 2 ];
            let a = textImageData.data[pixelPos + 3 ];
            particles.push(new Particle(posX,posY,r,g,b,a));
        }
    }
}


function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<particles.length;++i){
        particles[i].draw();
        particles[i].update();
    }
    //connect();
    requestAnimationFrame(animate);
}

