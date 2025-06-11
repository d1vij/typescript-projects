import { Vector } from "./Vector.js";

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = window.innerWidth
canvas.height= window.innerHeight


const _2PI = Math.PI * 2;
const degRadConversionFactor = Math.PI / 180
const colors = [
    "#FFB3BA",  // pastel pink
    "#FFDFBA",  // pastel orange
    "#FFFFBA",  // pastel yellow
    "#BAFFC9",  // pastel green
    "#BAE1FF",  // pastel blue
    "#E0BBE4",  // pastel lavender
    "#D5AAFF",  // pastel violet
    "#C2F0FC",  // pastel cyan
    "#F3FFE3",  // pastel mint
    "#FBE4FF"   // pastel lilac
]
const LIMITS = {
    RADIUS:0.1,
    OPACITY:0.1,
    LENGTH:0.1
};

function randint(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function randomColor() {
    return colors[randint(0, colors.length - 1)]
}





abstract class GenericParticle{
    x: number;
    y: number;
    decayStyle: [string, number][];
    color: string;
    opacity: number;
    alive:boolean;
    radius:number|undefined;
    length:number|undefined;
    breadth:number|undefined;
    rotation:number|undefined
    time:number

    constructor(x: number, y: number,radius?:number,length?:number,breadth?:number,rotation?:number, decayStyle: [string, number][] = [],time:number|null=1) {
        this.x = x;
        this.y = y;
        this.color = randomColor();
        this.decayStyle = decayStyle
        this.opacity = 1
        this.alive = true;
        this.radius = radius;
        this.length = length
        this.breadth=breadth;
        this.rotation = rotation;
        this.time = time ? time : 1
    }
    
    update(deltaTime:number) {
        for (let [style, rate] of this.decayStyle) {
            switch (style) {
                case "radius": {
                    this.radius! -= rate * deltaTime;
                    if(this.radius! <= LIMITS.RADIUS) this.alive=false
                    break;
                }
                case "opacity": {
                    this.opacity -= rate * deltaTime;
                    if(this.opacity <= LIMITS.OPACITY) this.alive=false;
                    break;
                }
                case "length":{
                    this.length! -= rate * deltaTime;
                    if(this.length! <=LIMITS.LENGTH) this.alive=false;
                    break;
                }
                case "time":{
                    this.time -= rate * deltaTime;
                    if (this.time <= 0) this.alive=false;
                    break;
                }
            }
        }
    }

    public abstract draw(deltaTime:number): void;
}


class RoundParticle extends GenericParticle{
    constructor(x:number,y:number,radius:number,decayStyle:[string,number][]=[['radius',1]]){
        super(x,y,radius,undefined,undefined,undefined,decayStyle)
    }
    public draw(deltaTime:number) {
        this.update(deltaTime);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius!, 0, _2PI, false);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class LineParticle extends GenericParticle{
    pointA:Vector
    pointB:Vector

    constructor(x:number,y:number,length:number,rotation:number,decayStyle:[string,number][]=[["length",1]]){
        //rotation in deg wrt +x axis
        super(x,y,undefined,length,undefined,rotation,decayStyle);

        this.rotation= rotation * degRadConversionFactor;
        let lby2 = length/2 
        this.pointA = new Vector(this.x + (lby2 * Math.cos(this.rotation)), this.y + (lby2 * Math.sin(this.rotation)))
        this.pointB = new Vector(this.x + (lby2 * Math.cos(Math.PI+this.rotation)),this.y + (lby2 * Math.sin(Math.PI+this.rotation)))
        
    }
    public draw(deltaTime:number){
        let lby2 = this.length!/2 
        
        this.pointA = new Vector(this.x + (lby2 * Math.cos(this.rotation!)), this.y + (lby2 * Math.sin(this.rotation!)))
        this.pointB = new Vector(this.x + (lby2 * Math.cos(Math.PI+this.rotation!)),this.y + (lby2 * Math.sin(Math.PI+this.rotation!)))

        this.update(deltaTime);
        
        ctx.beginPath();
        ctx.moveTo(this.pointA.x, this.pointA.y);
        ctx.lineTo(this.pointB.x, this.pointB.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }
    
}



class StarParticle extends LineParticle {
    constructor(x:number, y:number,length:number, decayStyle:[string,number][]=[["length",1]]){
        //similar to line but with random updating rotations
        super(x,y,length,randint(0,_2PI),decayStyle);
    }

    public override draw(deltaTime:number){
        let lby2 = this.length!/2 
        
        this.rotation = randint(0,_2PI);
        
        this.pointA = new Vector(this.x + (lby2 * Math.cos(this.rotation!)), this.y + (lby2 * Math.sin(this.rotation!)))
        this.pointB = new Vector(this.x + (lby2 * Math.cos(Math.PI+this.rotation!)),this.y + (lby2 * Math.sin(Math.PI+this.rotation!)))

        this.update(deltaTime);
        
        ctx.beginPath();
        ctx.moveTo(this.pointA.x, this.pointA.y);
        ctx.lineTo(this.pointB.x, this.pointB.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }
    
}





class Animate{
    private static Particles: GenericParticle[]  = []

    static deltaTime:number;
    static lasttime:number = performance.now();
    
    private static drawAll(deltaTime:number){
        for(let i=0;i<Animate.Particles.length;i++){
            let particle = Animate.Particles[i];
            if(particle.alive){
                particle.draw(deltaTime);
            } else {
                Animate.Particles.splice(i,1);
                i--;
            }
        }
    }

    public static addParticle(event:MouseEvent){
        let x = event.clientX -canvas.getBoundingClientRect().x;
        let y = event.clientY -canvas.getBoundingClientRect().y;
        
        // Animate.Animate.Particles.push(new RoundParticle(x,y,randint(5,15),[["opacity",2],['radius',15]]));
        // Animate.Particles.push(new LineParticle(x, y,randint(1,50),randint(0,360),[['length',50],['opacity',2]]));
        Animate.Particles.push(new StarParticle(x,y,randint(1,35),[["length",20],['time',1.5],['opacity',2]]))
    }

    public static animate(currtime:number) {
        requestAnimationFrame(Animate.animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Animate.deltaTime = (currtime-Animate.lasttime)/1000;
        Animate.lasttime=currtime;
        
        Animate.drawAll(Animate.deltaTime);
    }
}

canvas.addEventListener("mousemove",(event)=>{
    Animate.addParticle(event)
})
Animate.animate(0);
