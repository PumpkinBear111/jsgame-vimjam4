function playerUpdate(dt, self) {
    self.velocity[1] += 9.81*dt*200
    if (keysdown.includes(Key.JUMP)) {
        let myLeft = self.transform.position.x-self.scalex/2
        let myRight = self.transform.position.x+self.scalex/2
        let myDown = self.transform.position.y+self.scaley/2
        let myUp = self.transform.position.y-self.scaley/2
        for (let col of colliders) {
            if (myUp <= col.boundd && myDown >= col.boundu-5 && myLeft <= col.boundr-2 && myRight >= col.boundl+2) {
                if ((Math.abs(myUp-col.boundd) >= 16)) {
                    self.data.jumpFrame = true
                    self.velocity[1] = -700
                }
            }
        }
        if (self.velocity[1] < 0) {
            self.velocity[1] -= 750*dt
        }
    }
    if (keysdown.includes(Key.RIGHT) && keysdown.includes(Key.LEFT)) {}
    else if (keysdown.includes(Key.RIGHT)) {
        self.velocity[0] += 300*dt*self.data.moveInvert
        return
    } 
    else if (keysdown.includes(Key.LEFT)) {
        self.velocity[0] -= 300*dt*self.data.moveInvert
        return
    }
    if (keysdown.includes(Key.DOWN)) {
        self.velocity = [0,0]
        self.transform.position = {"x":self.data.savedPosition.x, "y":self.data.savedPosition.y}
        if (self == playerRed) keysdown.splice(keysdown.indexOf(Key.DOWN),1)
    } else if (keysdown.includes(Key.RESET)) {
        reset()
        loadLevel(levelOn)
    }
    self.velocity[0] *= 1-(dt*4)
}

function reset() {
    playerRed.velocity = [0,0]
    playerRed.transform.position = {"x":playerRed.data.initPos.x, "y":playerRed.data.initPos.y}
    playerBlue.velocity = [0,0]
    playerBlue.transform.position = {"x":playerBlue.data.initPos.x, "y":playerBlue.data.initPos.y}

    keysdown.splice(keysdown.indexOf(Key.RESET),1)
    entities = [playerBlue, playerRed]
    colliders = []
    ui = []
}

var playerBlue
var playerRed
var checkpoint_blue
var checkpoint_red
window.onload = function() {
    checkpoint_blue = new Graphic("checkpoint_blue.png")
    checkpoint_red = new Graphic("checkpoint_red.png")

    levelOn = 0
    loadLevel(levelOn)

    playerBlue = new PhysicsEntity("char_blue.png", playerUpdate, {"moveInvert": 1, "initPos": {
            "x": 192-32,
            "y": height-64-32,
        }, "savedPosition": {
            "x": 192-32,
            "y": height-64-32,
        }}, {
        "position": {
            "x": 192-32,
            "y": height-64-32,
        }
    })
    playerRed = new PhysicsEntity("char_red.png", playerUpdate, {"moveInvert": -1, "initPos": {
            "x": width-160,
            "y": height-64-32,
        }, "savedPosition": {
            "x": width-160,
            "y": height-64-32,
        }}, {
        "position": {
            "x": width-160,
            "y": height-64-32,
        }
    })
    
    entities.push(playerBlue)
    entities.push(playerRed)
    globalTicks.push(new Tick(cameraUpdate))
    initStill = false
}

function cameraUpdate(dt) {
    //cameraOffset[1] += 448 * dt
    //607, 104
    cameraTarget[1] = Math.max(-(playerRed.gpos.y+playerBlue.gpos.y)/2+400,-64)
    cameraOffset[1] = (cameraTarget[1]+cameraOffset[1])/2
    for (let wall of levelWalls) {
        wall.transform.position.y = -cameraOffset[1]+wall.scaley/2+cameraOffset[1]%64-128
    }
}