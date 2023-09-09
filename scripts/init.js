function playerUpdate(dt, self) {
    self.velocity[1] += 9.81*dt*200
}
window.onload = function() {
    entities.push(new PhysicsEntity("char_red.png", playerUpdate, {}, {
        "position": {
            "x": 150,
            "y": 150,
        },
        "scale": {
            "x": 64,
        },
        "rotation": 0
    }))
}