var debugMode = false

// Visual Settings
var rotationRounding = 1
var defaultScaleX = 4

// Game Settings
var globalTicks = []

// Internal Game Config
{
    var keysdown = []
    var entities = []
    var colliders = []
    var ui = []
    var cameraOffset = [0,-64]
    var cameraTarget = cameraOffset
    var levels = []
    var initStill = true
    var levelWalls = []
    var levelFloor = undefined
    var imagesLoaded = [0,0]
    var levelOn = 0
}