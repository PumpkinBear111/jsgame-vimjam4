/*Shows center of rotation*/
var debugMode = false
var imagesLoaded = [0,0]

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
}