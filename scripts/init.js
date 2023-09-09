function playerUpdate(dt, self) {
    self.velocity[1] += 9.81*dt*200
    let moving = false
    for (let key of keysdown) {
        if (key == Key.JUMP) {
            self.velocity[1] = -600
        }
        if (key == Key.RIGHT) {
            self.velocity[0] += 300*dt
            if (self.velocity[0] < 0) self.velocity[0] += 300*dt
            moving = true
        } else if (key == Key.LEFT) {
            self.velocity[0] -= 300*dt
            if (self.velocity[0] > 0) self.velocity[0] -= 300*dt
            moving = true
        }
    }
    if (!moving) self.velocity[0] *= 1-(dt*4)
}
window.onload = function() {
    entities.push(new PhysicsEntity("char_red.png", playerUpdate, {}, {
        "position": {
            "x": 150,
            "y": 100,
        },
        "scale": {
            "x": 64
        },
        "rotation": 0
    }))
    colliders.push(new Solid("brick3x1.png",  {
        "position": {
            "x": 150,
            "y": 400
        },
        "scale": {
            "x": 4*16*3,
            "y": 64,
        }
    }))
    colliders.push(new Solid("brick3x1.png",  {
        "position": {
            "x": 300,
            "y": 330
        },
        "scale": {
            "x": 4*16*3,
            "y": 64,
        }
    }))
}