function playerUpdate(dt, self) {
    self.velocity[1] += 9.81*dt*200
    for (let key of keysdown) {
        if (key == Key.JUMP) {
            self.velocity[1] = -600
        }
        if (key == Key.RIGHT) {
            self.velocity[0] += 300*dt*self.data.moveInvert
            return
        } else if (key == Key.LEFT) {
            self.velocity[0] -= 300*dt*self.data.moveInvert
            return
        }
    }
    self.velocity[0] *= 1-(dt*4)
}

window.onload = function() {
    entities.push(new PhysicsEntity("char_blue.png", playerUpdate, {"moveInvert": 1}, {
        "position": {
            "x": 200,
            "y": 64,
        }
    }))
    entities.push(new PhysicsEntity("char_red.png", playerUpdate, {"moveInvert": -1}, {
        "position": {
            "x": width-200,
            "y": 64,
        }
    }))
    colliders.push(new Solid("brick11x1.png",  {
        "position": {
            "x": width/2,
            "y": height-32
        },
    }))
    colliders.push(new Solid("brick1x16.png",  {
        "position": {
            "x": 32,
            "y": 8*64
        },
    }))
    colliders.push(new Solid("brick1x16.png",  {
        "position": {
            "x": width-32,
            "y": 8*64
        },
    }))
    colliders.push(new Solid("brick3x1.png",  {
        "position": {
            "x": width/2,
            "y": height-64-32
        },
    }))
}