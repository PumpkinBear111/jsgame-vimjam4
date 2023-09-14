function loadLevel(index) {
    let level = levels[index].reverse()
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < 11; x++)
        if (level[y][x] != 0) {
            let tile = level[y][x]
            colliders.push(new Solid(loadTile(tile), {
            "position": {
                    "x": x*64+loadTileOffset(tile)[0]+64,
                    "y": height-y*64+loadTileOffset(tile)[1],
                },
            }))
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
}

function loadTile(tile) {
    switch(tile) {
        case "floor": return "brick11x1.png"
        case 3: return "brick3x1.png"
        case 2: return "brick2x1.png"
        case 1: return "brick1x1.png"
    }
}
function loadTileOffset(tile) {
    switch(tile) {
        case "floor": return [352,32]
        case 3: return [32,32]
        case 2: return [64,32]
        case 1: return [32,32]
    }
}