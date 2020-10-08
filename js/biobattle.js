// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 820;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Prep the rectangular game area
var gameArea = {
	x: 100,
	y: 75,
	width: 850,
	height: 425,
}

// Position the cannon of the Jonas Salk
var jonasReady = false;
var jonasImage = new Image();
jonasImage.onload = function () {
	jonasReady = true;
}
jonasImage.src = "images/jonas.png";

// RNA image
var rnaReady = false;
var rnaImage = new Image();
rnaImage.onload = function () {
	rnaReady = true;
};
rnaImage.src = "images/rna.png";

// SARS image
var sarsReady = false;
var sarsImage = new Image();
sarsImage.onload = function () {
	sarsReady = true;
};
sarsImage.src = "images/sars.png";

// Game objects
var jonas = {
	x: 555,
	y: 475
}

var rna = {
	speed: 256, // movement in pixels per second
	count: 5    // number or RNA particles allowed
};
var sars = {
	speed: 128, // movement in pixels per second
	count: 5,	// number of SARS Spikes on screen
	XlaunchSites: [145,170,170,145,99],
	YlaunchSites: [200,250,300,350,400]
};

var sarsDestroyed = 0;
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player destroys a sars
var reset = function () {
	rna.x = 200;
	rna.y = 500;

	// Throw the sars somewhere on the screen randomly
	// Select a random launch site
	var sarsLaunch = Math.floor((Math.random() * sars.count))
	sars.x = sars.XlaunchSites[sarsLaunch];
	sars.y = sars.YlaunchSites[sarsLaunch];
	console.log("Spike position: location", sarsLaunch+1, " ", sars.x, ",", sars.y);
	console.log("RNA position: ", rna.x, ",", rna.y);
	console.log("Jonas Salk position: ", jonas.x, ",", jonas.y);
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		rna.y -= rna.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		rna.y += rna.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		rna.x -= rna.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		rna.x += rna.speed * modifier;
	}

	// Are they touching?
	if (
		rna.x <= (sars.x + 25)
		&& sars.x <= (rna.x + 25)
		&& rna.y <= (sars.y + 25)
		&& sars.y <= (rna.y + 25)
	) {
		sarsDestroyed++;
		console.log("SARS Destroyed! Current score: ", sarsDestroyed );
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (rnaReady) {
		ctx.drawImage(rnaImage, rna.x, rna.y);
	}

	if (sarsReady) {
		ctx.drawImage(sarsImage, sars.x, sars.y);
	}

	if (jonasReady) {
		ctx.drawImage(jonasImage, jonas.x, jonas.y);
	}

	// Score
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = "16px Helvetica";
	ctx.textAlign = "left";
	ctx.fillText("Lives saved: " + sarsDestroyed, 50, 675);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
