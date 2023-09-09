function playerUpdate(dt, self) {
    self.velocity[1] += 9.81*dt*200
    for (let key of keysdown) {
        if (key == Key.JUMP) self.velocity[1] = -600
        if (key == Key.RIGHT) self.velocity[0] += 50*dt
        if (key == Key.LEFT) self.velocity[0] -= 50*dt
    }
}
window.onload = function() {
    entities.push(new PhysicsEntity("char_red.png", playerUpdate, {}, {
        "position": {
            "x": 290,
            "y": 150,
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
            "y": 500
        },
        "scale": {
            "x": 4*16*3,
            "y": 64,
        }
    }))
}