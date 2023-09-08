function playerUpdate(dt, self) {
    self.transform.rotation = -self.transform.rotation*.6
    for (let k of keysdown) {
        if (k == Key.JUMP) self.transform.position.y -= 200*dt
        if (k == Key.DOWN) self.transform.position.y += 200*dt
        if (k == Key.LEFT) self.transform.position.x -= 200*dt
        if (k == Key.RIGHT) self.transform.position.x += 200*dt
    }
}
window.onload = function() {
    entities.push(new Entity("testimg.jpg", playerUpdate, {}, {
        "position": {
            "x": 50,
            "y": 100,
        },
        "scale": {
            "x": 64,
        },
        "rotation": 20,
    }))
    entities[0].moveTo(50,50)
    entities[0].setScale(64,64)
    entities[0].transform.rotation = 50
}