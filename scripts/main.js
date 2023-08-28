let tmp

let draw_context = document.getElementById("gamecanvas")
let width = draw_context.offsetWidth
let height = draw_context.offsetHeight
draw_context = draw_context.getContext("2d")

class Graphic {
    constructor(name,scalex,scaley) {
        this.img = new Image()
        this.img.src = "assets/images/" + name
        if (name.includes("/")) this.img.src = name
        if (scalex != undefined) {
            this.scalex = scalex
            if (scaley == undefined) {
                this.scaley = scalex
            }
        } else {
            this.scalex = this.img.width
            this.scaley = this.img.height
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
class Sound {
    constructor(name) {
        this.sfx = new Audio()
        if (name.includes("/")) this.sfx.src = name
        else this.sfx.src = "assets/sound/" + name
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

tmp = new Graphic("testimg.jpg", 255)
let x = 0

let lasttime = 0
function update(time) {
    let dt = (time-lasttime)/1000
    draw_context.fillStyle = "red"
    draw_context.fillRect(0,0,width,height)
    tmp.draw(x,0)

    draw_context.fillStyle = "black"
    draw_context.fillText(""+dt,50,100)
    x += 100*dt
    lasttime = time
    requestAnimationFrame(update)
}
requestAnimationFrame(update)

document.onclick = function() {
    let tmp1 = new Sound("BeepBox-Song.wav")
    tmp1.playVariate()
}