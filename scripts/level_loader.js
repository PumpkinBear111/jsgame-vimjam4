function loadLevel(index) {
    let level = levels[index]
    level.reverse()
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < 11; x++)
            if (level[y][x] != 0) {
                let tile = level[y][x]
                let transform = {
                    "position": {
                        "x": (x+1)*64+loadTileOffset(tile)[0],
                        "y": height-y*64+loadTileOffset(tile)[1],
                    },
                }
                if (isDeco(tile)) colliders.push(new Entity(loadTile(tile), function() {}, {"active": false}, transform))
                else if (tile == "checkpoint") {
                    entities.push(new Entity(loadTile(tile), function(dt, self) {
                        let myLeft = self.transform.position.x-self.scalex/2+4
                        let myRight = self.transform.position.x+self.scalex/2-4
                        let myDown = self.transform.position.y+self.scaley/2-4
                        let myUp = self.transform.position.y-self.scaley/2+4
                        if (myUp <= playerBlue.transform.position.y+playerBlue.scaley/2 &&
                            myDown >= playerBlue.transform.position.y-playerBlue.scaley/2 &&
                            myLeft <= playerBlue.transform.position.x+playerBlue.scalex/2 &&
                            myRight >= playerBlue.transform.position.x-playerBlue.scalex/2) {
                                self.img = checkpoint_blue.img
                                playerBlue.data.savedPosition = self.transform.position
                                self.tick = function() {}
                        }
                        if (myUp <= playerRed.transform.position.y+playerRed.scaley/2 &&
                            myDown >= playerRed.transform.position.y-playerRed.scaley/2 &&
                            myLeft <= playerRed.transform.position.x+playerRed.scalex/2 &&
                            myRight >= playerRed.transform.position.x-playerRed.scalex/2) {
                                self.img = checkpoint_red.img
                                playerRed.data.savedPosition = self.transform.position
                                self.tick = function() {}
                        }
                    }, {}, transform))
                } else colliders.push(new Solid(loadTile(tile), transform))
                if (tile == "floor") levelFloor = colliders[colliders.length-1]
            }
    }
    levelWalls.push(new Solid("brick1x16.png", {
        "position": {
            "x": 32,
            "y": 6*64,
        }
    }))
    colliders.push(levelWalls[0])
    colliders.push(new Solid("brick1x16.png", {
        "position": {
            "x": width-32,
            "y": 6*64,
        }
    }))
    levelWalls.push(colliders[colliders.length-1])
    level.reverse()
}

function isDeco(tile) {
    if (typeof tile == 'string') {
        return tile.includes("deco_")
    }
}
function loadTile(tile) {
    switch(tile) {
        case "deco_lantern": return "lantern.png"
        case "deco_plant": return "plant.png"
        case "floor": return "brick11x1.png"
        case "checkpoint": return "checkpoint_empty.png"
        case 3: return "brick3x1.png"
        case 2: return "brick2x1.png"
        case 1: return "brick1x1.png"
    }
    alert("this won't happen")
}
function loadTileOffset(tile) {
    switch(tile) {
        case "floor": return [352,32]
        case 3: return [32,32]
        case 2: return [64,32]
        case 1:
        default:
            return [32,32]
    }
}