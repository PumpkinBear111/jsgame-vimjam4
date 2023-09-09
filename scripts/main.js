let tmp

let draw_context = document.getElementById("gamecanvas")
let width = draw_context.offsetWidth
let height = draw_context.offsetHeight
draw_context = draw_context.getContext("2d")
draw_context.font = "30px Arial"
draw_context.imageSmoothingEnabled = false

class Graphic {
    constructor(name,scalex,scaley) {
        this.img = new Image()
        this.img.src = "assets/images/" + name
        if (name.includes("/")) this.img.src = name
        if (scalex != undefined) {
            this.scalex = scalex
            if (scaley == undefined) {
                this.scaley = scalex
            } else this.scaley = scaley
        } else {
            let a = this
            this.img.onload = function() {
                a.scalex = a.img.width*defaultScaleX
                a.scaley = a.img.height*defaultScaleX
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
                this.img.onload = function() {draw_context.drawImage(data[0],x,y,data[1],data[2])}
            } else return 1
        }
        draw_context.drawImage(this.img, x, y, this.scalex, this.scaley)
    }
}
class Entity extends Graphic {
    constructor(image, tick, data, transform) {
        if (typeof transform.scale != "undefined") {
            if (typeof transform.scale.y == 'undefined') super(image, transform.scale.x, transform.scale.x)
            else super(image, transform.scale.x, transform.scale.y)
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
            if (typeof transform.position.x != 'undefined') this.transform.position.x = transform.position.x
            if (typeof transform.position.y != 'undefined') this.transform.position.y = transform.position.y
            if (typeof transform.scale != 'undefined') {
                if (typeof transform.scale.y == 'undefined') {
                    this.scalex = transform.scale.x
                    this.scaley = transform.scale.x
                } else {
                    this.scalex = transform.scale.x
                    this.scaley = transform.scale.y
                }
            }
            if (typeof transform.rotation != 'undefined') {
                this.transform.rotation = transform.rotation
            }
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
        if (this.transform.x+this.scalex/2 < 0) return 1
        if (this.transform.y+this.scaley/2 < 0) return 1
        if (this.transform.x-this.scalex/2 > width) return 1
        if (this.transform.y-this.scaley/2 < height) return 1
        if (Math.abs(this.transform.rotation)<rotationRounding) {
            draw_context.drawImage(this.img, x-this.scalex/2, y-this.scaley/2, this.scalex, this.scaley)
            if (debugMode) {
                draw_context.fillStyle = "rgb(255,0,0)"
                draw_context.fillRect(this.transform.position.x-1,this.transform.position.y-1,2,2)
            } 
            return 1
        }
        if (!this.isLoaded()) {
            return 1
        }
        let t = this.transform
        draw_context.save()
        draw_context.translate(t.position.x, t.position.y+t.scale.y/2)
        draw_context.rotate(
            Math.round((t.rotation)/rotationRounding)*rotationRounding*Math.PI/180.0)
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
}
class Solid extends Entity {
    constructor (image, transform) {
        super(image, undefined, undefined, transform)
    }
    get boundl() {
        return this.transform.position.x-this.scalex/2
    }
    get boundr() {
        return this.transform.position.x+this.scalex/2
    }
    get boundd() {
        return this.transform.position.y+this.scaley/2
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
            if (myUp <= col.boundd && myDown >= col.boundu && myLeft <= col.boundr && myRight >= col.boundl) {
                this.transform.position.x = oldPos[0]
                this.velocity[0] = 0
            }
        }
        this.transform.position.y += y
        myLeft = this.transform.position.x-this.scalex/2
        myRight = this.transform.position.x+this.scalex/2
        myDown = this.transform.position.y+this.scaley/2
        myUp = this.transform.position.y-this.scaley/2
        for (let col of colliders) {
            if (myUp <= col.boundd && myDown >= col.boundu && myLeft <= col.boundr && myRight >= col.boundl) {
                this.transform.position.y = oldPos[1]
                this.velocity[1] = 0
            }
        }
    }
    update(dt) {
        this.tick(dt, this)
        this.move(this.velocity[0]*dt,this.velocity[1]*dt)
        if (this.scalex != this.transform.scale.x) this.transform.scale.x = this.scalex
        if (this.scaley != this.transform.scale.y) this.transform.scaley = this.scaley
        this.draw(this.transform.position.x,this.transform.position.y)
    }
}
class GUI extends Entity {
    constructor(uitype, transform, data) {
        super("testimg.jpg", undefined, {}, transform)
        this.uitype = uitype
        this.shown = true
        switch(this.uitype) {
            case(UiType.LABEL): setText(data); break;
            case(UiType.IMG_LABEL): setIcon(data); break;
        }
    }
    show() {
        this.shown = true
    }
    hide() {
        this.shown = false
    }
    setIcon(src) {
        this.img.src = src
    }
    setOnClick(todo) {
        this.clickevent = todo
    }
    setText(txt) {
        this.text = txt
    }
    draw() {
        
    }
}
const UiType = {
    BUTTON: "btn",
    LABEL: "text",
    IMG_LABEL: "icon"
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
            } else return 1
        }
        this.sfx.play()
    }
    play(playOnLoad=true) {
        this.sfx.playbackRate = 1
        if (!this.isLoaded()) {
            if (playOnLoad) {
                let data = this.sfx
                this.sfx.oncanplaythrough = function() {data.play()}
            } else return 1
        }
        this.sfx.play()
    }
}

let lasttime = 0

let fps0 = 60
let fps1 = 1
function update(time) {
    let dt = (time-lasttime)/1000
    draw_context.fillStyle = "#bcada6"
    draw_context.fillRect(0,0,width,height)
    
    for (let entity of entities) {
        entity.update(dt)
    }
    for (let col of colliders) {
        col.draw(col.transform.position.x,col.transform.position.y)
    }

    if (debugMode) {
        //draw_context.fillStyle = "black"
        //draw_context.fillText(Math.round(1/dt)+"fps av("+fps0/fps1+")",50,100)
        //draw_context.fillText(keysdown,50,150)
        console.log("av("+fps0/fps1+")")
    }
    if (fps1 >= 2) {
        fps0 += Math.round(1 / dt)
    }
    fps1++
    
    lasttime = time
    requestAnimationFrame(update)
}
requestAnimationFrame(update)

function processKey(key) {
    key = key.toLowerCase()
    switch(key) {
        case " ":
        case "w":
        case "arrowup":
            return Key.JUMP
        case "a":
        case "arrowleft":
            return Key.LEFT
        case "d":
        case "arrowright":
            return Key.RIGHT
        case "s":
        case "arrowdown":
            return Key.DOWN
    }
    return key
}
function keydown(e) {
    if (!keysdown.includes(processKey(e.key)))
    keysdown.push(processKey(e.key))
}
function keyup(e) {
    keysdown.splice(keysdown.indexOf(processKey(e.key)),1)
}
const Key = {
    JUMP: "jump",
    LEFT: "left",
    DOWN: "down",
    RIGHT: "right",
}