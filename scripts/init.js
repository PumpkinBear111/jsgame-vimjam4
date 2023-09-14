function playerUpdate(dt, self) {
    self.velocity[1] += 9.81*dt*200
    if (keysdown.includes(Key.JUMP)) {
        myLeft = self.transform.position.x-self.scalex/2
        myRight = self.transform.position.x+self.scalex/2
        myDown = self.transform.position.y+self.scaley/2
        myUp = self.transform.position.y-self.scaley/2
        let canjump = true
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
        self.data.savedPosition = {"x":self.gpos.x,"y":self.gpos.y}
        if (self == playerRed) keysdown.splice(keysdown.indexOf(Key.DOWN),1)
    
    } else if (keysdown.includes(Key.RESET)) {
        self.velocity = [0,0]
        self.transform.position = {"x":self.data.savedPosition.x, "y":self.data.savedPosition.y}
        self.data.savedPosition = {"x":self.data.initPos.x, "y": self.data.initPos.y}
        if (self == playerRed) keysdown.splice(keysdown.indexOf(Key.RESET),1)
    }
    self.velocity[0] *= 1-(dt*4)
}

var playerBlue
var playerRed
window.onload = function() {
    loadLevel(1)

    playerBlue = new PhysicsEntity("char_blue.png", playerUpdate, {"moveInvert": 1, "initPos": {
            "x": 200,
            "y": height-64,
        }, "savedPosition": {
            "x": 200,
            "y": height-64,
        }}, {
        "position": {
            "x": 200,
            "y": height-64,
        }
    })
    playerRed = new PhysicsEntity("char_red.png", playerUpdate, {"moveInvert": -1, "initPos": {
            "x": width-200,
            "y": height-64,
        }, "savedPosition": {
            "x": width-200,
            "y": height-64,
        }}, {
        "position": {
            "x": width-200,
            "y": height-64,
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