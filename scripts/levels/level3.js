// Tutorial Level

levels.push([
//             C
  //[_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [2,_,_,_,_,_,_,_,_,2,_],
    [p,l,_,_,_,_,_,_,_,l,p],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,e,_,_,_,_,_], // Level Finish Here
    [1,_,_,_,0,3,0,_,_,_,_],
    [_,_,_,_,_,l,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,2,0],
    [2,_,_,_,_,_,_,_,_,_,l],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,2,0,_,_,_,_,_],
    [_,_,_,2,0,p,_,_,_,_,_],
    [_,c,_,_,1,_,_,_,_,2,0],
    [_,1,_,_,1,_,c,_,_,p,_],
    [_,l,_,_,0,3,0,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
/*    [c,_,_,_,_,_,_,_,_,_,_],
    [0,3,0,1,_,_,_,1,_,_,c],
    [_,_,_,_,_,_,2,0,_,_,1],
    [_,_,_,_,_,_,_,1,_,_,_],
    [_,2,0,_,_,_,_,1,1,_,_],
    [_,0,3,0,_,_,_,1,_,_,_],
    [_,_,_,_,_,_,1,_,_,_,_],
    [_,_,_,_,_,_,1,_,_,2,0],
    [_,_,_,_,_,c,1,c,_,_,_],
    [2,0,_,_,_,0,3,0,_,_,_],*/
    [2,0,_,_,_,_,_,_,_,_,_],
    [l,_,_,_,_,_,_,t,_,2,0],
    [_,_,2,0,_,_,_,2,0,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,2,0,0,3,0,_,_,_],
    [c,_,_,p,_,p,_,p,_,_,c],
    [1,_,_,_,_,_,_,_,_,_,1],
    [_,_,_,_,_,_,_,_,_,_,1],
    [_,_,_,_,_,_,_,_,_,2,0],
    [2,0,_,_,_,_,_,_,_,_,l],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,0,3,0,2,0,_,_,_],
    [t,c,_,2,0,0,3,0,_,c,_],
    [f,_,_,_,_,_,_,_,_,_,_],
])

function addTutorialText() {
    ui.push(new SmolText("Credits:", 95, 275))
    ui.push(new SmolText("Game by PumpkinBear111 (aka Sloth)", 190, 295))
    ui.push(new SmolText("Font: Handjet by Rosetta, David Březina", 195, 315))
    ui.push(new SmolText("Vimjam4 Logo: 8 Bits to Infinity", 170, 335))

    ui.push(new TextUI("Welcome!", width/2, 460))
    ui.push(new TextUI("Try moving around. . .", width/2, 500))
    ui.push(new TextUI("Try holding [JUMP]", 550, 300))
    ui.push(new TextUI("\\ \/", 128-32, 90))
    ui.push(new TextUI("These are checkpoints", width/2, 0))
    ui.push(new TextUI("Can you get the blobs to touch them?", width/2, 40))
    ui.push(new TextUI("\\ \/", width-128+32, 90))
    ui.push(new TextUI("Nice!", width/2, -300))
    ui.push(new TextUI("Press [DOWN] to return you to your last checkpoint", width/2+50, -260))
    ui.push(new TextUI("If you mess up too badly,", width/2, -690))
    ui.push(new TextUI("press 'R' to restart the level", width/2, -650))
    ui.push(new TextUI("Can you use this", width/2-100, -1100))
    ui.push(new TextUI("\\ \/ to get to the next level", width/2+150, -1060))

    colliders.push(new Entity("logo.png", function () {}, {}, {
        "position": {
            "x": width/2,
            "y": -1300
        },
        "scale": {
            "x": 64*6
        }
    }))
    ui.push(new SmolText("Created in 10 days for Vimjam 4: Checkpoints", width/2, -1180))
}