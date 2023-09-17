let f = "floor"
let _ = 0
let l = "deco_lantern"
let p = "deco_plant"
let t = "deco_fishtank"
let c = "checkpoint"
let e = "end"
let b = "bomb"

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
                    entities.push(new Entity(loadTile(tile), function (dt, self) {
                        let myLeft = self.transform.position.x - self.scalex / 2 + 4
                        let myRight = self.transform.position.x + self.scalex / 2 - 4
                        let myDown = self.transform.position.y + self.scaley / 2 - 4
                        let myUp = self.transform.position.y - self.scaley / 2 + 4
                        if (myUp <= playerBlue.transform.position.y + playerBlue.scaley / 2 &&
                            myDown >= playerBlue.transform.position.y - playerBlue.scaley / 2 &&
                            myLeft <= playerBlue.transform.position.x + playerBlue.scalex / 2 &&
                            myRight >= playerBlue.transform.position.x - playerBlue.scalex / 2) {
                            self.img = checkpoint_blue.img
                            playerBlue.data.savedPosition = self.transform.position
                            self.tick = function () {
                            }
                        }
                        if (myUp <= playerRed.transform.position.y + playerRed.scaley / 2 &&
                            myDown >= playerRed.transform.position.y - playerRed.scaley / 2 &&
                            myLeft <= playerRed.transform.position.x + playerRed.scalex / 2 &&
                            myRight >= playerRed.transform.position.x - playerRed.scalex / 2) {
                            self.img = checkpoint_red.img
                            playerRed.data.savedPosition = self.transform.position
                            self.tick = function () {
                            }
                        }
                    }, {}, transform))
                }
                else if (tile == "bomb") {
                    entities.push(new Entity(loadTile(tile), function (dt, self) {
                        let myLeft = self.transform.position.x - self.scalex / 2 + 12
                        let myRight = self.transform.position.x + self.scalex / 2 - 12
                        let myDown = self.transform.position.y + self.scaley / 2
                        let myUp = self.transform.position.y - self.scaley / 2
                        if ((myUp <= playerBlue.transform.position.y + playerBlue.scaley / 2 &&
                            myDown >= playerBlue.transform.position.y - playerBlue.scaley / 2 &&
                            myLeft <= playerBlue.transform.position.x + playerBlue.scalex / 2 &&
                            myRight >= playerBlue.transform.position.x - playerBlue.scalex / 2) ||
                            (myUp <= playerRed.transform.position.y + playerRed.scaley / 2 &&
                            myDown >= playerRed.transform.position.y - playerRed.scaley / 2 &&
                            myLeft <= playerRed.transform.position.x + playerRed.scalex / 2 &&
                            myRight >= playerRed.transform.position.x - playerRed.scalex / 2)) {
                                playerBlue.velocity = [0,0]
                                playerBlue.transform.position = {"x":playerBlue.data.savedPosition.x, "y":playerBlue.data.savedPosition.y}
                                playerRed.velocity = [0,0]
                                playerRed.transform.position = {"x":playerRed.data.savedPosition.x, "y":playerRed.data.savedPosition.y}
                        }
                    }, {}, transform))
                }
                else if (tile == "end") {
                    entities.push(new Entity(loadTile(tile), function (dt, self) {
                        let myLeft = self.transform.position.x - self.scalex / 2 + 4
                        let myRight = self.transform.position.x + self.scalex / 2 - 4
                        let myDown = self.transform.position.y + self.scaley / 2 - 4
                        let myUp = self.transform.position.y - self.scaley / 2 + 4
                        let touchingB = (myUp <= playerBlue.transform.position.y + playerBlue.scaley / 2 &&
                            myDown >= playerBlue.transform.position.y - playerBlue.scaley / 2 &&
                            myLeft <= playerBlue.transform.position.x + playerBlue.scalex / 2 &&
                            myRight >= playerBlue.transform.position.x - playerBlue.scalex / 2)
                        let touchingR = (myUp <= playerRed.transform.position.y + playerRed.scaley / 2 &&
                            myDown >= playerRed.transform.position.y - playerRed.scaley / 2 &&
                            myLeft <= playerRed.transform.position.x + playerRed.scalex / 2 &&
                            myRight >= playerRed.transform.position.x - playerRed.scalex / 2)
                        if (touchingB || touchingR) {
                            if (touchingB && touchingR) {
                                reset()
                                levelOn++
                                loadLevel(levelOn)
                            } else if (touchingB) playerBlue.data.locked = true
                            else playerRed.data.locked = true
                        }
                    }, {}, transform))
                }
                else colliders.push(new Solid(loadTile(tile), transform))
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
    if (index == 0) addTutorialText()
    if (index == levels.length-1) {
        colliders.push(new Entity("logo.png", function () {}, {}, {
            "position": {
                "x": 64*3+16,
                "y": 200,
            },
            "scale": {
                "x": 64*4
            }
        }))
        colliders.push(new Entity("vimjam4logo.png", function () {}, {}, {
            "position": {
                "x": width-64*3-16,
                "y": 180,
            },
            "scale": {
                "x": 64*4,
                "y": 203
            }
        }))
        ui.push(new TextHighlighted("Thanks for playing!", width/2, height/2))
        ui.push(new TextHighlighted("Made in 10 Days for VimJam 4", width/2, height/2+60))
        ui.push(new SmolText("Focus: Checkpoints", width/2, height/2+85))
        ui.push(new SmolText("Theme: Cross Paths", width/2, height/2+105))

        ui.push(new TextHighlighted("Credits:", width/2, height/2+155))
        ui.push(new SmolText("Font: Handjet by Rosetta, David Březina", width/2, height/2+175))
        ui.push(new SmolText("Vimjam4 Logo: 8 Bits to Infinity", width/2, height/2+195))
        ui.push(new SmolText("Everything Else: PumpkinBear111 (aka Sloth)", width/2, height/2+215))

        ui.push(new TextHighlighted("Close one. . .", width/2, height/2-1000))
        ui.push(new SmolText("Now go check out some other Vimjam 4 entries", width/2, height/2-960))
        ui.push(new SmolText(": )", width/2, height/2-920))
    }
}

function isDeco(tile) {
    if (typeof tile == 'string') {
        return tile.includes("deco_")
    }
}
function loadTile(tile) {
    switch(tile) {
        case "deco_lantern": return "lantern.png"
        case "deco_fishtank": return "fish.png"
        case "deco_plant": return "plant.png"
        case "floor": return "brick11x1.png"
        case "checkpoint": return "checkpoint_empty.png"
        case "end": return "level_complete_orb.png"
        case "bomb": return "bomb.png"
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