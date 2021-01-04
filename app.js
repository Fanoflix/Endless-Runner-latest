document.addEventListener('DOMContentLoaded', () => {

// caching HTML references
const grid = document.querySelector(".grid")
const player = document.querySelector('.player')
const menu = document.getElementById('menu')
const body = document.querySelector('body')
const heading = document.getElementById('heading')
const insts = document.getElementById("inst")
const bullets = document.getElementById("bullets")
const alert = document.getElementById("alert")
const desert1 = document.querySelector('.desert1')
const desert2 = document.querySelector('.desert2')
const forest1 = document.querySelector('.forest1')
const forest2 = document.querySelector('.forest2')
const scoresHTML = document.querySelector('.scores')
const scoreHTML = document.getElementById('score')
const highScoreHTML = document.getElementById('highScore')

// GAME STATES (DO NOT CHANGE)
player.style.backgroundImage = "url(player.png)";
let playerPosition = 30; //starting player's playerPosition (Not recommended to change)
let ground = playerPosition
let isMenu = true;
let isJumping = false; // Starting off with true, to make jumping available only after player starts playing
let frame = 1;
let jumpHeight = playerPosition
let isGameOver = false
let isDay = true
let highScore = localStorage.getItem('highScore')

// GAME STARTING SETTINGS
let jumpTimeInterval = 10; // jump Speed (higher number means slower jump) --- milliseconds (ms)
let jumpSpeed = 1; // how much % per jumpTimeInterval --- pixels (px)
let downSpeed = 0.1;
let gravity = 0.94; // how geometric the jumps of the player will be
jumpHeight += 17; // how high the player can jump --- percentage (%)
let playerAnimationSpeed = 200; // how fast the player's running animation runs --- milliseconds (ms)
let obstacleRandommessRange = 1300 // how fast the obstacles are created --- milliseconds (ms)
// let obstacleRandommess = Math.floor(Math.random()*200)+obstacleRandommessRange; // randomness = 1300 to 1500 --- milliseconds (ms)
let obstacleSpeed = 0.6; // how fast the obstacles move --- pixels (px)
let cloudSpeed = 0.025; // how fast the clouds move --- milliseconds (ms)
let celestialSpeed = 20; // how fast the sun/moon moves --- milliseconds (ms)
let desertMoveSpeed = 0.05 // how fast the desert scrolls --- milliseconds (ms)
let forestMoveSpeed = 0.025 // how fast the forest scrolls --- milliseconds (ms)
let score = 0
let scoreSpeed = 200 // how fast the score is added


// |||||||||||||||||||||||||||||||||||||||||||||||| -------- INPUT LOGIC -------- ||||||||||||||||||||||||||||||||||||||||||||||||

// Listening for Space Key
document.addEventListener('keyup', (e)=>{
    if (!isGameOver && e.code === "Space"){
        input()
    }
    if (isGameOver && e.code === "Backspace"){
        location.reload()
    }
})

document.addEventListener('touchstart', (e)=>{
    if(isGameOver) {
        location.reload();
    }
    else {
        input()
    }
})

// |||||||||||||||||||||||||||||||||||||||||||||||| -------- Main Game Logic -------- ||||||||||||||||||||||||||||||||||||||||||||||||

function input(e) {
    // Game Loop which only runs when you're not in menu
    if (!isMenu)
    {
        if (!isJumping) // If player is not jumping, then jump. This is to prevent double jumps.
        {
            isJumping = true
            jump()
        }
    }

    // Get --! out of Menu !-- if the space is pressed for the first time
    if (isMenu)
    {
        isMenu = false; // space has been pressed - Not in Menu anymore
        menuTransitions() // Hide Menu
        animatePlayer() // start player's running Animation
        decideObstacles() // decide wether to create a spike or an axe
        generateCelestial() // create sun/moon
        generateClouds() // create clouds
        scrollGround() // scroll the ground + forest
        addScore() // scoring and gradual difficulty increments
    }
}

// |||||||||||||||||||||||||||||||||||||||||||||||| -------- Player Jump and Animation -------- ||||||||||||||||||||||||||||||||||||||||||||||||
function jump() {
    let timer = setInterval( function() {
        if (isGameOver) {
            clearInterval(timer)
        }
        if (isJumping) {
            // ---- Player Moving Down ----
            if (playerPosition >=  jumpHeight) { // Checking if the player has reached the jumpHeight - Start going down if true
                clearInterval(timer)
                jumpSpeed = 1
                
                let downTimer = setInterval ( function() {
                    if (isGameOver) {
                        clearInterval(downTimer)
                    }
                    
                    playerPosition -= downSpeed
                    downSpeed = downSpeed + (downSpeed*0.08)
                    player.style.bottom = playerPosition  + '%'
                    player.style.backgroundImage = "url(player-land.png)" // Replace the player going up sprite with player landing sprite

                    if (playerPosition <= (ground) ) { // If player has reached ground
                        clearInterval(downTimer)
                        jumpSpeed = 1
                        downSpeed = 0.3
                        isJumping = false
                        playerPosition = ground
                        player.style.bottom = playerPosition  + '%'
                    }
                }, jumpTimeInterval)
            }

            // ---- Player Going Up ----
            player.style.backgroundImage = "url(player-jump.png)"

            
            // jumpSpeed = 1
            playerPosition += jumpSpeed
            jumpSpeed = jumpSpeed * gravity
            if (jumpSpeed <= 0.17 ) { jumpSpeed = 0.2}
            player.style.bottom = playerPosition + '%'
        }
    }, jumpTimeInterval)
}

// Animating the player by inter-changing the background image on the div
function animatePlayer() {
    setInterval( () => { // Change player PNG file every "playerAnimationSpeed" milliseconds
        if (frame === 1  && !isJumping && !isGameOver){
            player.style.backgroundImage = "url(player2.png)"
            frame = 2
        }
        else if (frame === 2  && !isJumping && !isGameOver){
            player.style.backgroundImage = "url(player.png)"
            frame = 1
        }
        else if (isGameOver){
            player.style.backgroundImage = "url(player_dead.png)"
        }
    }, playerAnimationSpeed)// playerAnimationSpeed = Time in milliseconds the frame changes
}

// |||||||||||||||||||||||||||||||||||||||||||||||| -------- PLAYER SCORES -------- ||||||||||||||||||||||||||||||||||||||||||||||||

// Add score on a set interval
function addScore() {
    scoresHTML.style.opacity = "100%"
    setInterval( () => {
        if (!isGameOver) {
            score += 5
            if (score > highScore) { highScore = score }
            scoreHTML.innerHTML =  score
            highScoreHTML.innerHTML = "High Score: " + highScore
            
            if (score%1000 == 0) { // Increase difficulty and score rate at every 1000 score interval
                // obstacleRandomnessRange decreases from 1300
                // playerAnimationSpeed decreases from 150
                // scoreSpeed decreases from 200
                // cloudSpeed increases from 0.025
                // desertMoveSpeed increases from 0.05
                // forestMoveSpeed increases from 0.025
                // obstacleSpeed increases from 1
                if (obstacleRandommessRange > 800) {obstacleRandommessRange -= 60}
                if (playerAnimationSpeed >= 70) {playerAnimationSpeed -= 10}
                if (scoreSpeed >= 50) {scoreSpeed -= 20}
                
                console.log("Range: " + obstacleRandommessRange + " - " + (obstacleRandommessRange + 150))
                cloudSpeed += 0.005
                desertMoveSpeed += 0.01
                forestMoveSpeed += 0.008
                obstacleSpeed += 0.3
            }
        }
        if (isGameOver) {
            scoresHTML.style.animation = "gameOverScoreTransition 1.5s forwards"
            highScoreHTML.style.animation = "gameOverHighScoreTransition 2.25s forwards"
            localStorage.setItem("highScore", highScore)
        }
    }, scoreSpeed)
}
// |||||||||||||||||||||||||||||||||||||||||||||||| -------- GENERATE OBSTACLES -------- ||||||||||||||||||||||||||||||||||||||||||||||||

// Decide wether to spawn a spike or an axe (randomly)
function decideObstacles(){
    let isAxe = Math.floor(Math.random() * 2); // isAxe = 1 or 2
    let obstacleRandommess = Math.floor(Math.random()*150)+obstacleRandommessRange

    if (isAxe){
        generateAxe(obstacleRandommess);
    }
    else {
        generateSpikes(obstacleRandommess);
    }
}

// Create spikes. This function is called by decideObstacles.
function generateSpikes(obstacleRandommess) {
    let obstacleXPosition = 1920    
    const obstacle = document.createElement('div') // Create a div on the html page to then manipulate by JS
    if (!isGameOver) {
        obstacle.classList.add('obstacle')
    }
    grid.appendChild(obstacle)
    obstacle.style.left = obstacleXPosition + "px"
    let moveID = setInterval(() => {
        // If player DIES
        if (obstacleXPosition > 5 && obstacleXPosition < 45 && playerPosition < 35) { // if player has collided with spike
            clearInterval(moveID) // stop spawning obstacles
            alert.style.visibility = "visible"
            body.style.backgroundColor = "rgb(52, 9, 9)" // Turn the background red to reflect the gruesome death of the player xD
            isGameOver = true
        }

        if (obstacleXPosition <= -50) { // If the obstacle has moved off screen
            obstacle.classList.remove('obstacle') // then remove the class attribute from the div of the current obstacle
            try{ grid.removeChild(obstacle) } // then remove the child (div) of the obstacle.
            catch(error) {} // catching the exception because, the above line keeps trying to delete the old ones.
            // NOTE: Both of these; 1) Removing the class 2) Removing the child, are important. If you do only one, the other one is NOT automatically handled by JS.
        }

        if( !isGameOver ) { obstacleXPosition -= obstacleSpeed } // if the player is dead (isGameOver == true) then stop moving all the obstacles!
        obstacle.style.left = obstacleXPosition + 'px'
    }, 1)

    if (!isGameOver) {
        console.log(obstacleRandommess)
        setTimeout(decideObstacles, obstacleRandommess)
    }
}

// Create axes. This function is called by decideObstacles.
function generateAxe(obstacleRandommess) {
    let axeXPosition = 1920
    const axe = document.createElement('div') // Create a div on the html page to then manipulate by JS
    if (!isGameOver) {
        axe.classList.add('axe')
    }
    grid.appendChild(axe)
    axe.style.left = axeXPosition + "px" // set the initial position (from the left)
    axe.style.animation = "rotation 0.6s infinite linear" // "rotation" is an animation keyframe declared in the css file, its just called here with further modifiers.
    // if (!isMenu){
        let moveID = setInterval(() => {
            if (axeXPosition > 10 && axeXPosition < 50 && playerPosition >= 45) { // if player has collided with axe
                clearInterval(moveID)
                alert.style.visibility = "visible"
                body.style.backgroundColor = "rgb(52, 9, 9)" // Turn the background red to reflect the gruesome death of the player xD
                isGameOver = true
            }
            
            if (axeXPosition <= -50) { // If the obstacle has moved off screen
                axe.classList.remove('axe') // then remove the class attribute from the div of the current obstacle
                try{ grid.removeChild(axe) } // and Remove the child (div) of the obstacle.
                catch(error) {} // catching the exception because, the above line keeps trying to delete the old ones.
                // NOTE: Both of these; 1) Removing the class 2) Removing the child, are important. If you do only one, the other one is NOT automatically handled by JS.
            }

            if (!isGameOver) { axeXPosition -= obstacleSpeed } // if the player is not dead (isGameOver == false) only then move all the axes!
                
            else { axe.style.animationPlayState = "paused" } // if the player is dead, pause rotating aswell
        
            axe.style.left = axeXPosition + 'px'
        }, 1)
    // }
    if (!isGameOver) {
        console.log(obstacleRandommess)
        setTimeout(decideObstacles, obstacleRandommess)
    }
}

// |||||||||||||||||||||||||||||||||||||||||||||||| -------- CREATE PARALLAX EFFECT -------- ||||||||||||||||||||||||||||||||||||||||||||||||

// Generate clouds with varying height from the bottom
function generateClouds() {
    let cloudRandomness = Math.floor(Math.random()*1000)+3000;  // returns a random integer from 5000 to 7000
    let randomHeight = Math.floor(Math.random() * 15) // returns a random integer from 0 to 12
    let tempHeight = randomHeight // storing the height of the current cloud to use it to make the next one a different height (ask me if you dont understand this one)
    if( tempHeight === randomHeight) { randomHeight++ } // if the previous cloud's height was the same as the one we're about to spawn, add 1% instead.
    
    let cloudXPosition = 105 // % from the left ( 105% means its offscreen) ---- The default position of the cloud from the left
    let cloudYPosition = 47 // % from bottom ---- The default height of the cloud
    const cloud = document.createElement('div')
    cloud.classList.add('cloud')

    grid.appendChild(cloud)
    cloud.style.left = cloudXPosition + "%"
    cloud.style.bottom = cloudYPosition + randomHeight + '%' // The minimum height of the cloud + the random height
    if (!isMenu){
        let moveID = setInterval(() => {
            if (!isGameOver) { cloudXPosition -= cloudSpeed } // Only move if game is not over
            cloud.style.left = cloudXPosition + '%'
            if (cloudXPosition <= -25){
                cloud.classList.remove('cloud')
                clearInterval(moveID)
            }
        }, 1)
    }
    if (!isGameOver) {
        setTimeout(generateClouds, cloudRandomness)
    }
}

// Generate a celestial body that changes when the day changes
function generateCelestial() {
    let celestialXPosition = 105
    const celestial = document.createElement('div')
    desert1.style.transition = "filter 7s linear" // apply a transition on the "filter" attribute of the deserts and forests, to slowly change their grayscale.
    desert2.style.transition = "filter 7s linear"
    forest1.style.transition = "filter 7s linear"
    forest2.style.transition = "filter 7s linear"
    if (!isGameOver) {
        celestial.classList.add('celestial')
    }
    if (isDay){
        // Change the grayscale of the forest and the ground to reflect the sun
        desert1.style.filter = "grayscale(0%)"
        desert2.style.filter = "grayscale(0%)"
        forest1.style.filter = "grayscale(0%)"
        forest2.style.filter = "grayscale(0%)"
        
        // Change the celestial body to a sun
        celestial.style.backgroundColor = "yellow"
        body.style.backgroundColor = "#65abc9";
        body.style.transition = "all 5s linear"
    }
    else {
        // Change the grayscale of the forest and the ground to reflect the moon
        desert1.style.filter = "grayscale(60%)"
        desert2.style.filter = "grayscale(60%)"
        forest1.style.filter = "grayscale(60%)"
        forest2.style.filter = "grayscale(60%)"

        // Change the celestial body to a moon
        celestial.style.backgroundColor = "white" // Turn the sun into a moon
        body.style.backgroundColor = "#103443";
        body.style.transition = "all 5s linear"
    }

    grid.appendChild(celestial)
    celestial.style.left = celestialXPosition + "%" // set the initial position (from the left)

    let moveID = setInterval(() => {
        if (!isGameOver) { celestialXPosition -= 0.07 } // Only move if game is not over
        
        celestial.style.left = celestialXPosition + '%'
        if (celestialXPosition <= -10){
            celestial.classList.remove('celestial')
            isDay = !isDay
            clearInterval(moveID)
            setTimeout(generateCelestial, 1)
        }
    }, celestialSpeed)

    if (!isGameOver && celestial.classList.length == 0) {
        setTimeout(generateCelestial, 1)
    }
}

function scrollGround(){
    // Two divs are used for each element i.e: Desert and Forest. Both divs are 100% of the width of the screen. One of them (desert1, forest1) is positioned 0% from the left, the other is positioned 100% from the left.
    // The latter is off screen. This is all done to create an infinite scroll. Both divs are then moved at the same speed, then whichever one of them reaches -99% from left side of the screen,
    // that div is resetted to 100% from left. Given each div's starting position, this creates a perfect infinite scrolling background.
    let desert1Pos = 0
    let desert2Pos = 100
    let forest1Pos = 0
    let forest2Pos = 100

    
    setInterval(() => {
        if (!isGameOver){
            // Desert Movement Behaviour
            desert1Pos = desert1Pos - desertMoveSpeed
            desert1.style.left = desert1Pos + '%'
            
            desert2Pos = desert2Pos - desertMoveSpeed
            desert2.style.left = desert2Pos + '%'


            // Forest Movement Behaviour.
            forest1Pos = forest1Pos - forestMoveSpeed
            forest1.style.left = forest1Pos + '%'

            forest2Pos = forest2Pos - forestMoveSpeed
            forest2.style.left = forest2Pos + '%'
        }


        // Reset Deserts' position if they go off screen
        if (desert1Pos <= -99) { desert1Pos = 100 }
        if (desert2Pos <= -99) { desert2Pos = 100 }
        // Reset Forests' position if they go off screen
        if (forest2Pos <= -99) { forest2Pos = 100 }
        if (forest1Pos <= -99) { forest1Pos = 100 }
    }, 1)

}

// |||||||||||||||||||||||||||||||||||||||||||||||| -------- Menu Transitions -------- ||||||||||||||||||||||||||||||||||||||||||||||||

function menuTransitions(){
    // menu transition
    menu.style.opacity = "0"
    menu.style.transition = "all 0.5s ease-out";

    // animate instructions
    insts.style.animation = "instanim 2s 0s"
    bullets.style.animation = "instanim 2s 0s"

    // body transition
    body.style.backgroundColor = "#94deff";
    body.style.transition = "all 1.8s linear"

    // heading transition
    heading.style.opacity = "0"
    heading.style.transition = "all 2s linear"
}

})