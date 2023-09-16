let draw_context = document.getElementById("gamecanvas")
let width = draw_context.offsetWidth
let height = draw_context.offsetHeight
draw_context = draw_context.getContext("2d")
draw_context.imageSmoothingEnabled = false

let font = new FontFace('Handjet', 'url(assets/Handjet-Bold.ttf)')
imagesLoaded[0]++
font.load().then(function(f) {
    document.fonts.add(f)
    draw_context.font = "40px Handjet"
    draw_context.textAlign = "center"
    imagesLoaded[1]++
})

class Graphic {
    constructor(name,scalex,scaley) {
        this.img = new Image()
        this.img.src = "assets/images/" + name
        if (name.includes("/")) this.img.src = name
        imagesLoaded[0]++
        if (scalex != undefined) {
            this.scalex = scalex
            if (scaley == undefined) {
                this.scaley = scalex
            } else this.scaley = scaley
            this.img.onload = function() {
                imagesLoaded[1]++
            }
        } else {
            let a = this
            this.img.onload = function() {
                a.scalex = a.img.width*defaultScaleX
                a.scaley = a.img.height*defaultScaleX
                imagesLoaded[1]++
            }
        }
    }
    isLoaded() {
        return this.img.complete && this.img.naturalHeight !== 0;
    }
    setScale(scalex,scaley) {
        if (scalex != undefined) {
            this.scalex = scalex
            if (scaley == undefined) {
                this.scaley = scalex
            }
        }
    }
    draw(x,y,renderOnLoad=true) {
        if (!this.isLoaded()) {
            if (renderOnLoad) {
                let data = [this.img, this.scalex, this.scaley]
                this.img.onload = function() {draw_context.drawImage(data[0],x+cameraOffset[0],y+cameraOffset[1],data[1],data[2])}
            } else return
        }
        draw_context.drawImage(this.img, x+cameraOffset[0], y+cameraOffset[1], this.scalex, this.scaley)
    }
}
class Entity extends Graphic {
    constructor(image, tick, data, transform) {
        if (typeof transform.scale != "undefined") {
            super(image, transform.scale.x, (typeof transform.scale.y == 'undefined') ? transform.scale.x : transform.scale.y)
        } else super(image)
        this.transform = {
            "position": {
                "x":10000,
                "y":10000,
            },
            "rotation": 0,
            "scale": {
                "x":this.scalex,
                "y":this.scaley,
            }
        }
        if (typeof transform != "undefined") {
            if (typeof transform.position != 'undefined') this.transform.position = transform.position
            if (typeof transform.scale != 'undefined') {
                this.scalex = transform.scale.x
                if (typeof transform.scale.y == 'undefined') this.scaley = transform.scale.x
                else this.scaley = transform.scale.y
            }
            if (typeof transform.rotation != 'undefined') this.transform.rotation = transform.rotation
        }
        if (typeof data == "undefined") data = {}
        this.data = data
        this.tick = tick
    }
    move(x,y) {
        this.transform.position = {
            "x":this.transform.position.x+x,
            "y":this.transform.position.y+y,
        }
    }
    moveTo(x,y) {
        this.transform.position = {
            "x":x,
            "y":y,
        }
    }
    draw(x,y) {
        if (this.transform.x+this.scalex/2+cameraOffset[0] < 0) return
        if (this.transform.y+this.scaley/2+cameraOffset[1] < 0) return
        if (this.transform.x-this.scalex/2+cameraOffset[0] > width) return
        if (this.transform.y-this.scaley/2+cameraOffset[1] < height) return
        if (Math.abs(this.transform.rotation)<rotationRounding) {
            draw_context.drawImage(this.img, x-this.scalex/2+cameraOffset[0], y-this.scaley/2+cameraOffset[1], this.scalex, this.scaley)
            if (debugMode) {
                draw_context.fillStyle = "rgb(255,0,0)"
                draw_context.fillRect(this.transform.position.x-1+cameraOffset[0],this.transform.position.y-1+cameraOffset[1],2,2)
            } 
            return
        }
        if (!this.isLoaded()) return
        let t = this.transform
        draw_context.save()
        draw_context.translate(t.position.x, t.position.y+t.scale.y/2) // Rotation does not currently support camera offset
        draw_context.rotate(Math.round(t.rotation*rotationRounding)/rotationRounding*Math.PI/180.0)
        draw_context.translate(-t.position.x, -t.position.y-t.scale.y/2)
        draw_context.drawImage(this.img, x-this.scalex/2, y-this.scaley/2, this.scalex, this.scaley)
        draw_context.restore()
        if (debugMode) {
            draw_context.fillStyle = "rgb(255,0,0)"
            draw_context.fillRect(t.position.x-1,t.position.y-1,2,2)
        }
    }
    update(dt) {
        this.tick(dt, this)
        if (this.scalex != this.transform.scale.x) this.transform.scale.x = this.scalex
        if (this.scaley != this.transform.scale.y) this.transform.scale.y = this.scaley
        this.draw(this.transform.position.x,this.transform.position.y)
    }
    get gpos() {return this.transform.position}
}
class Solid extends Entity {
    constructor (image, transform) {
        super(image, undefined, undefined, transform)
    }
    get boundl() {
        return this.transform.position.x-this.scalex/2+4
    }
    get boundr() {
        return this.transform.position.x+this.scalex/2-4
    }
    get boundd() {
        return this.transform.position.y+this.scaley/2-4
    }
    get boundu() {
        return this.transform.position.y-this.scaley/2
    }
}
class PhysicsEntity extends Entity {
    constructor(image, tick, data, transform) {
        super(image, tick, data, transform)
        this.velocity = [0,0]
        this.jump = 0
    }
    move(x,y) {
        let oldPos = [this.transform.position.x, this.transform.position.y]
        this.transform.position.x += x
        let myLeft = this.transform.position.x-this.scalex/2
        let myRight = this.transform.position.x+this.scalex/2
        let myDown = this.transform.position.y+this.scaley/2
        let myUp = this.transform.position.y-this.scaley/2
        for (let col of colliders) {
            if (myUp <= col.boundd && myDown >= col.boundu+4 && myLeft <= col.boundr && myRight >= col.boundl) {
                this.transform.position.x = oldPos[0]
                this.velocity[0] = 0
            }
        }
        this.transform.position.y += y
        //if (!this.data.jumpFrame) {
            myLeft = this.transform.position.x-this.scalex/2
            myRight = this.transform.position.x+this.scalex/2
            myDown = this.transform.position.y+this.scaley/2
            myUp = this.transform.position.y-this.scaley/2
            for (let col of colliders) {
                if (myUp <= col.boundd && myDown >= col.boundu && myLeft <= col.boundr-1 && myRight >= col.boundl+1) {
                    this.transform.position.y = oldPos[1]
                    this.velocity[1] = 0
                }
            }
        //}
        this.data.jumpFrame = false
    }
    update(dt) {
        this.tick(dt, this)
        this.move(this.velocity[0]*dt,this.velocity[1]*dt)
        if (this.scalex != this.transform.scale.x) this.transform.scale.x = this.scalex
        if (this.scaley != this.transform.scale.y) this.transform.scaley = this.scaley
        this.draw(this.transform.position.x,this.transform.position.y)
    }
}
class Tick {
    constructor(tick) {
        this.tick = tick
    }
    update(dt) {
        this.tick(dt)
    }
}

class TextUI {
    constructor(text, x, y) {
        this.x = x
        this.y = y
        this.text = text
        this.estWidth = text.length*16
        this.transparancy = 1
    }
    draw(dt) {
        if ((Math.abs(playerRed.gpos.x-this.x) <= this.estWidth && Math.abs(playerRed.gpos.y+32-this.y+20)<100) ||
           (Math.abs(playerBlue.gpos.x-this.x) <= this.estWidth && 64<playerBlue.gpos.y-this.y<-64))
            this.transparancy = Math.max(this.transparancy-6*dt, .2)
        else this.transparancy = Math.min(this.transparancy+6*dt, 1)
        draw_context.fillStyle = `rgba(0,0,0,${this.transparancy})`
        draw_context.fillText(this.text, this.x+cameraOffset[0], this.y+cameraOffset[1])
    }
}
class SmolText extends TextUI {
    constructor(text, x, y) {
        super(text,x,y)
        this.estWidth = text.length*8
    }
    draw(dt) {
        draw_context.font = "20px Handjet"
        draw_context.fillStyle = 'black'
        draw_context.fillText(this.text, this.x+cameraOffset[0], this.y+cameraOffset[1])
        draw_context.font = "40px Handjet"
    }
}

class Sound {
    constructor(name) {
        this.sfx = new Audio()
        if (name.includes("/")) this.sfx.src = name
        else this.sfx.src = "assets/sound/" + name
        this.setAsSfx()
    }
    setAsMusic() {
        this.sfx.loop = true
    }
    setAsSfx() {
        this.sfx.loop = false
    }
    isLoaded() {
        return this.sfx.readyState === 4
    }
    playVariate(playOnLoad=true) {
        let variation = 1.1-Math.random()/5
        this.sfx.playbackRate = variation
        if (!this.isLoaded()) {
            if (playOnLoad) {
                let data = this.sfx
                this.sfx.oncanplaythrough = function() {data.play()}
            } else return
        }
        this.sfx.play()
    }
    play(playOnLoad=true) {
        this.sfx.playbackRate = 1
        if (!this.isLoaded()) {
            if (playOnLoad) {
                let data = this.sfx
                this.sfx.oncanplaythrough = function() {data.play()}
            } else return
        }
        this.sfx.play()
    }
}

let lasttime = 0
let fps0 = 60
let fps1 = 1
let gameRunSlow = 0
let skipFrame = false
function update(time) {
    if (skipFrame == true) {
        skipFrame = false
        lasttime = time
        requestAnimationFrame(update)
        return
    }
    let dt = (time-lasttime)/1000
    lasttime = time
    
    draw_context.fillStyle = "#bcada6"
    draw_context.fillRect(0,0,width,height)

    if (imagesLoaded[0] != imagesLoaded[1] || initStill) {
        draw_context.fillStyle = "black"
        draw_context.fillText(`Loading Assets (${imagesLoaded[1]}/${imagesLoaded[0]})`,width/2,height/2+20)
        lasttime = time
        requestAnimationFrame(update)
        return
    }

    if (dt >= .5) {
        lasttime = time
        gameRunSlow++
        console.error("Game Slow, dt="+dt)
        if (gameRunSlow < 21) requestAnimationFrame(update)
        else {
            draw_context.fillStyle = "black"
            draw_context.fillText("Hi, game needs at least 2fps. Sorry.")
        }
        return
    }
    
    for (let entity of entities) {
        entity.update(dt)
    }
    for (let col of colliders) {
        col.draw(col.transform.position.x,col.transform.position.y)
    }
    for (let txt of ui) {
        txt.draw(dt)
    }
    for (let atick of globalTicks) {
        atick.update(dt)
    }

    if (debugMode) {
        draw_context.fillStyle = "black"
        draw_context.fillText(Math.round(1/dt)+"fps av("+Math.round(fps0/fps1*2)/2+")",400,100)
        draw_context.fillText(keysdown,400,150)
        draw_context.fillText(gameRunSlow + " slow frames",400,200)
        console.log("av("+fps0/fps1+")")
    }
    if (fps1 >= 2) {
        fps0 += Math.round(1 / dt)
    }
    fps1++

    //cameraOffset[1] += 16*dt

    requestAnimationFrame(update)
}
requestAnimationFrame(update)

function processKey(key) {
    key = key.toLowerCase()
    switch(key) {
        case " ":
        case "w":
        case "i":
        case "arrowup":
            return Key.JUMP
        case "a":
        case "j":
        case "arrowleft":
            return Key.LEFT
        case "d":
        case "l":
        case "arrowright":
            return Key.RIGHT
        case "s":
        case "k":
        case "arrowdown":
            return Key.DOWN
        case "r":
            return Key.RESET
    }
    return key
}
function keydown(e) {
    if (!keysdown.includes(processKey(e.key)))
    keysdown.push(processKey(e.key))
}
function keyup(e) {
    if (keysdown.includes(processKey(e.key)))
    keysdown.splice(keysdown.indexOf(processKey(e.key)),1)
}
const Key = {
    JUMP: "jump",
    LEFT: "left",
    DOWN: "down",
    RIGHT: "right",
    RESET: "reset"
}

window.onblur = function() {
    skipFrame = true
}