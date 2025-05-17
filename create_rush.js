


const pieces = ["Z", "L", "O", "S", "I", "J", "T"]
const colors = ["#000000" ,"#FF0100", "#FEAA00", "#FFFE02", "#00EA01", "#00DDFF", "#0000FF", "#AA00FE", "#555555"]
const piece_matrix = {
  "Z": [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  "L": [
    [0, 0, 2],
    [2, 2, 2],
    [0, 0, 0]
  ],
  "O": [
    [3, 3],
    [3, 3]
  ],
  "S": [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0]
  ],
  "I": [
    [0, 0, 0, 0],
    [5, 5, 5, 5],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  "J": [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  "T": [
    [9, 7, 9],
    [7, 7, 7],
    [0, 0, 0]
  ],
    null: [
      [0]
    ]
};

const wallkicks = {
    "0-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], //special
    "1-0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "1-2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "2-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "2-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], //special
    "3-2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "3-0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "0-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    "0-2": [[0, 0], [0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]], //last 4 kicks io only
    "1-3": [[0, 0], [1, 0], [1, 2], [1, 1], [0, 2], [0, 1]],
    "2-0": [[0, 0], [0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0]],
    "3-1": [[0, 0], [-1, 0], [-1, 2], [-1, 1], [0, 2], [0, 1]],
  };

const i_wallkicks = {
  "0-1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  "1-0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  "1-2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  "2-1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  "2-3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  "3-2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  "3-0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  "0-3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  "0-2": [[0, 0]],
  "1-3": [[0, 0]],
  "2-0": [[0, 0]],
  "3-1": [[0, 0]],
};

const empty_line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var controls = localStorage.getItem("controls");
controls = JSON.parse(controls);

var piece_displacement = {
  "I": [-.5, -.5],
  "O": [.5, 0]
}

var setupData;
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const height = 600;
const width = 500;

var board = Array.from({ length: 20 }, () => Array(10).fill(0));
var queue = [];

var oldboard = JSON.parse(JSON.stringify(board));

// mouse stuff for drawing

mouseY = 0; // which cell on the board the mouse is over
mouseX = 0;
mouseDown = false;
drawMode = true;
movingCoordinates = false;

const cellSize = 30;

function paintbucketColor() {
    for (i = 0; i < document.paintbucket.length; i++) {
		if (document.paintbucket[i].checked) {
			return document.paintbucket[i].value;
		}
	}
}

canvas.onmousemove = function mousemove(e) {
	rect = canvas.getBoundingClientRect();
	let y = Math.floor((e.clientY - rect.top - 2) / cellSize);
	let x = Math.floor((e.clientX - rect.left - 102) / cellSize);

	if (inRange(x, 0, 9) && inRange(y, 0, 21)) {
		movingCoordinates = (y != mouseY || x != mouseX);

		mouseY = y;
		mouseX = x;

		if (mouseDown && movingCoordinates) {
			if (!drawMode) {
				board[mouseY][mouseX] = 0;
			} else {
				board[mouseY][mouseX] = paintbucketColor();
			}
			graficks();
		}
	}
};

canvas.onmousedown = function mousedown(e) {
	rect = canvas.getBoundingClientRect();
	mouseY = Math.floor((e.clientY - rect.top - 2) / cellSize);
	mouseX = Math.floor((e.clientX - rect.left - 102) / cellSize);

	if (inRange(mouseX, 0, 9) && inRange(mouseY, 0, 21)) {
		if (!mouseDown) {
			movingCoordinates = false;
			drawMode = e.button != 0 || board[mouseY][mouseX] != 0;
			if (drawMode) {
				board[mouseY][mouseX] = 0;
			} else {
                oldBoard = JSON.parse(JSON.stringify(board));
				board[mouseY][mouseX] = paintbucketColor();
			}
			graficks();
		}
		mouseDown = true;
		drawMode = (board[mouseY][mouseX] != 0);
	}
};

document.onmouseup = function mouseup(e) {
    mouseDown = false;
    if (drawMode) {
        // compare board oldboard and attempt to autocolor
		drawn = [];
		board.map((r, i) => {
			r.map((c, ii) => {
				if (c != 0 && c != oldBoard[i][ii]) drawn.push({ y: i, x: ii });
			});
		});
        if (drawn.length == 4) {
            // bleh do autocolor later
        }
    }
}

function inRange(x, min, max) {
	return x >= min && x <= max;
}

canvas.onclick = function click(e) {
    rect = canvas.getBoundingClientRect();
    if ((e.clientY - rect.top) < 100 && (e.clientX - rect.left < 100)) {
        let HoldInput = prompt('Hold', held).toUpperCase();
        if (HoldInput.length == 0) {
            held = '';
            graficks();
            return;
        }
        HoldInput = HoldInput[0]; // make sure it's just 1 character
        //sanitization
	    if ('SZLJIOT'.includes(HoldInput)) {
		    held = HoldInput;
		    graficks();
	    }
        return;
    }
    if ((e.clientX - rect.left) > 402) {
        let QueueInput = prompt('Queue', piece + queue.join('')).toUpperCase();
	    // ok there's probably a regex way to do this but...
	    temp = [];
	    for (i = 0; i < QueueInput.length; i++) {
		    //sanitization
		    if ('SZLJIOT'.includes(QueueInput[i])) temp.push(QueueInput[i]);
	    }
        if (temp.length > 0) {
            queue = temp;
            piece = queue.shift();
            pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
            graficks();
        }
    }

}


var num_rendered = 0;
var num_goals = 1;
renderFields();

function addField() {
	num_goals++;
	renderFields();
}
function removeField() {
	num_goals--;
	if (num_goals < 1) num_goals = 1;
	renderFields();
}
function renderFields() {
	var container = document.getElementById('goals');
	while (num_rendered > num_goals) {
		for (i = 0; i < 10; i++) container.removeChild(container.lastChild);
		num_rendered--;
	}
	for (i = num_rendered; i < num_goals; i++) {
	    
	    var label2 = document.createElement("label");
        label2.setAttribute("for", "goal"+i);
        label2.textContent = "Goal:";

        // Create the input element for "Goal"
        var input2 = document.createElement("input");
        input2.setAttribute("list", "keys");
        input2.id = "goal"+i;
        input2.name = "goal"+i;
          
        var label = document.createElement("label");
        label.setAttribute("for", "goalnum"+i);
        label.textContent = "Goal Number:";

        // Create the input element for "Goal Number"
        var input1 = document.createElement("input");
        input1.type = "number";
        input1.id = "goalnum"+i;
        input1.name = "goalnum"+i;
        input1.min = "0";
        input1.value = "1";
      
		container.appendChild(document.createElement("br"));
		container.appendChild(label2);
		
		container.appendChild(document.createElement("br"));
		container.appendChild(input2);
        container.appendChild(document.createElement("br"));
		container.appendChild(label);
		
		container.appendChild(document.createElement("br"));
		container.appendChild(input1);
        container.appendChild(document.createElement("br"));

		container.appendChild(document.createElement('p'));
		num_rendered++;
	}
}


function createPuzzle() {
    
    queue.unshift(piece);
    result = {};
    result.board = board;
    result.pieces = queue;
    result.goals = {};
    for (i = 0; i < num_goals; i++) {
        result['goals'][document.getElementById("goal"+ i.toString()).value] = document.getElementById("goalnum"+ i.toString()).value;
    }
    
    result.restrictions = {};
    result.continue_queue = false;
    result.held = held;
    result.completions = 4;
    result.plays = ["1","1","1","1","1"];
    result.winrate="80.00";
    

    var password = prompt("Please enter the password");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var http = new XMLHttpRequest();
  http.open("POST", "createrush.php?password="+password, true);
  http.setRequestHeader('Content-Type', 'application/json');
  http.addEventListener('load', function() {
  if (http.status === 200) {
    // The request was successful, and you can access the response here
    var response = http.responseText;
    Swal.fire(response)
    // Do something with jsonResponse
  } else {
    // The request failed; handle the error here
    Swal.fire('Request failed with status: ' + http.status);
  }
});
  http.send(JSON.stringify(result));

    console.log(result);

}


const norm_das = 10000000
const norm_arr = 100;
var das = controls["DAS"];
var arr = controls["ARR"];
    controls = localStorage.getItem("controls");
    controls = JSON.parse(controls);
    das = controls["DAS"];
    arr = controls["ARR"];
    if ("grav_ARR" in controls) {
    fall_speed = controls["grav_ARR"]
    } else {
    fall_speed = 25;
    }

const grav = 3600000;
var start = new Date().getTime()
// document.addEventListener('keydown', move)
var keyDict = {};
$('.test-board').on('keydown', function(key) {
    test = []
    for (var testKey in controls) {
    if (controls.hasOwnProperty(testKey)) {
        test.push(controls[testKey][1])
        if (key.which == controls[testKey][0]) {
        key.preventDefault();
        // console.log(key.key);
        }
    }
    }
    if (keyDict[key.which] === undefined) {
    keyDict[key.which] = [0, 0, 0, true]
    }
    if (keyDict[key.which][1] >= keyDict[key.which][0]) {
    keyDict[key.which] = [new Date().getTime(), keyDict[key.which][1], keyDict[key.which][2], true]
    }
});
$('.test-board').on('keyup', function(key) {
    // if (keyDict[key.which] === undefined) {
    //   keyDict[key.which] = [1, 0, 0, true]
    // }
    delete keyDict[key.which] // keyDict[key.which] = [keyDict[key.which][0], new Date().getTime(), keyDict[key.which][2], true]
});
var next_drop = grav;

var interval;
var intervalToggle = true;
interval = setInterval(loop, 15);
$(document).ready(function () {
    $(window).focus(function () {
        clearInterval(interval);
        if  (intervalToggle) {
        interval = setInterval(loop, 15);
        }
        keyDict = {};
        // var keys = Object.keys(keyDict);
        // for(var i = 0; i < keys.length;i++){
        //   if (keyDict[i] === undefined) {
        //     keyDict[i] = [1, 0, 0, true]
        //   }
        //   keyDict[keys[i]] = [keyDict[i][0], new Date().getTime(), keyDict[i][2], true]
        // }
    }).blur(function () {
        clearInterval(interval);
    });
});

function loop(){
    var keys = Object.keys(keyDict);
    leftRight = 0;
    var prio;
    for (var i = 0; i < keys.length; i++) {
    if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
        leftRight++;
        prio = keys[i]
    }
    if (leftRight == 2) {
        if (keyDict[keys[1]][0] > keyDict[keys[0]][0]) {
        prio = keys[1]
        } else {
        prio = keys[0]
        }
    }
    }
    for (var i = 0; i < keys.length; i++) {
    if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
        if (keys[i] == prio) {
        if (keyDict[keys[i]][0] > keyDict[keys[i]][1] && ((new Date().getTime() - keyDict[keys[i]][0]) >= das || keyDict[keys[i]][3] == true) && (new Date().getTime() - keyDict[keys[i]][2]) >= arr) {
            if (arr == 0 && keyDict[keys[i]][3] == false) {
            for (var mov = 0; mov < 9; mov++) {
                move(keys[i])
            }
            } else {
            move(keys[i])
            }
            keyDict[keys[i]] = [keyDict[keys[i]][0], keyDict[keys[i]][1], new Date().getTime(), false]
        }
        }
    } else if (keys[i] != controls["softdrop"][0]) { // && keys[i] != controls["harddrop"][0]
        if (keyDict[keys[i]][0] > keyDict[keys[i]][1] && ((new Date().getTime() - keyDict[keys[i]][0]) >= norm_das || keyDict[keys[i]][3] == true) && (new Date().getTime() - keyDict[keys[i]][2]) >= norm_arr) {
        move(keys[i])
        keyDict[keys[i]] = [keyDict[keys[i]][0], keyDict[keys[i]][1], new Date().getTime(), false]
        }
    } else if (keys[i] == controls["softdrop"][0]) {
        if (keyDict[keys[i]][0] > keyDict[keys[i]][1] && (new Date().getTime() - keyDict[keys[i]][2]) >= fall_speed) {
        move(keys[i])
        keyDict[keys[i]] = [keyDict[keys[i]][0], keyDict[keys[i]][1], new Date().getTime(), false]
        next_drop = grav
        }
    } else {
        if (keyDict[keys[i]][0] > keyDict[keys[i]][1] && ((new Date().getTime() - keyDict[keys[i]][0]) >= norm_das || keyDict[keys[i]][3] == true) && (new Date().getTime() - keyDict[keys[i]][2]) >= 3600000) {
        move(keys[i])
        console.log(":(");
        keyDict[keys[i]] = [keyDict[keys[i]][0], keyDict[keys[i]][1], new Date().getTime(), false]
        }
    }
    }
    next_drop--;
    if (next_drop == 0) {
    next_drop = grav;
    gravity()
    graficks()
    }
}

function gravity() {
    if (collide([pieceMatrix, x, y+1, piece])) {
    place([pieceMatrix, x, y, piece])
    } else {
    y++;
    }
}

function restart() {
    gameOver();
}

function rotate(matrix) {
    const n = matrix.length;
    const x = Math.floor(n/ 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
        k = matrix[i][j];
        matrix[i][j] = matrix[y - j][i];
        matrix[y - j][i] = matrix[y - i][y - j];
        matrix[y - i][y - j] = matrix[j][y - i]
        matrix[j][y - i] = k
        }
    }
}
if (queue.length < 10) {
    addBag()
}
var piece = queue.shift();
var held = "";
if (piece == "O") {
    x = 4
} else {
    x = 3
}
var y = 0
var rotation = 0;
pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
graficks()
function collide(pieceData) { //pieceData = [matrix, x, y]
    for (var testY = 0; testY < pieceData[0].length; testY++) {
    for (var testX = 0; testX < pieceData[0][0].length; testX++) {
        if (pieceData[0][testY][testX] != 0 && pieceData[0][testY][testX] != 9) {
        if((pieceData[2] + testY) >= board.length || (pieceData[1] + testX) >= board[0].length || (pieceData[2] + testY) < 0 || (pieceData[1] + testX) < 0) {
            return true;
        }
        if (board[pieceData[2] + testY][pieceData[1] + testX] != 0) {
            return true;
        }
        }
    }
    }
    return false;
}

function tryWallkick(prev, current) {
    if (piece == "I") {
    kicktable = i_wallkicks
    } else {
    kicktable = wallkicks
    }
    current_table = kicktable[prev.toString() + "-" + current.toString()]
    for (var i = 0; i < current_table.length; i++) {
    if (!collide([pieceMatrix, x + current_table[i][0], y - current_table[i][1], piece])) {
        x += current_table[i][0];
        y -= current_table[i][1];
        return true
    }
    }
    return false
}

function addBag() {
    bag = [...pieces]
    bag.sort(() => Math.random() - 0.5);
    queue = queue.concat(bag)
}

function place(pieceData) { //pieceData = [pieceMatrix, x, y, piece]
    piece_stored = piece
    let filled = 0;
    let mini = 0;
    for (var testY = 0; testY < pieceData[0].length; testY++) {
    for (var testX = 0; testX < pieceData[0][0].length; testX++) {
        if (pieceData[0][testY][testX] != 0) {
        if (pieceData[0][testY][testX] != 9) {
            board[pieceData[2] + testY][pieceData[1] + testX] = pieces.indexOf(pieceData[3]) + 1
        } else if (board[pieceData[2] + testY][pieceData[1] + testX] == 0) {
            mini++;
        }
        }
        if (pieceData[0][testY][testX] == 0 || pieceData[0][testY][testX] == 9) {
        if (pieceData[3] == "T") {
            if ((testY == 0 || testY == 2) && (testX == 0 || testX == 2)) {
            if ((pieceData[2] + testY) >= board.length || (pieceData[1] + testX) >= board[0].length) {
                filled++;
            } else if (board[pieceData[2] + testY][pieceData[1] + testX] != 0 && board[pieceData[2] + testY][pieceData[1] + testX] != 9) {
                filled++;
            }
            }
        }
        }
    }
    }


    testY = 19
    temp_board = JSON.parse(JSON.stringify(board));
    while (testY > 0) {
    for (var i = 0; i < 10; i++) {
        if (temp_board[testY][i] == 0) {
        break
        }
        if (i == 9) {
        board.splice(testY, 1);
        }
    }
    testY--;
    }
    while (board.length < 20) {
    board.unshift([...empty_line])
    }

    if (queue.length < 10) {
    addBag()
    }
    piece = queue.shift();
    if (piece == "O") {
    x = 4
    } else {
    x = 3
    }
    y = 0
    rotation = 0
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    if (collide([pieceMatrix, x, y, piece])) {
    gameOver()
    return
    }
}

function graficks() { //#909090
    ctx.fillStyle = "#000000";
    ctx.fillRect(102, 2, width, height);
    for (var graphX = 0; graphX < 10; graphX++) {
    ctx.fillStyle = "#202020";
    ctx.fillRect(30 * graphX + 102, 2, 1, 600)
    }
    for (var graphY = 0; graphY < 20; graphY++) {
    ctx.fillStyle = "#202020";
    ctx.fillRect(102, 30 * graphY + 2, 300, 1)
    }
    if (piece != null) {
    ghostY = y
    while (!collide([pieceMatrix, x, ghostY+1, piece])) {
        ghostY++;
    }
    for (var testY = 0; testY < pieceMatrix.length; testY++) {
        for (var testX = 0; testX < pieceMatrix[0].length; testX++) {
        if (pieceMatrix[testY][testX] != 0 && pieceMatrix[testY][testX] != 9) {
            // ctx.drawImage(blocks, 30 * (pieceMatrix[testY][testX] + 1) + 1, 0, 30, 30, (testX + x) * 30, (testY + ghostY) * 30, 30, 30);
            ctx.fillStyle = "#202020";
            ctx.fillRect((testX + x) * 30 + 102, (testY + ghostY) * 30 + 2, 30, 30)
            // viewBoard[testY + y][testX + x] = pieceMatrix[testY][testX]
        }
        }
    }
    ctx.globalAlpha = 1;
    } else {
    pieceMatrix = [[0]]
    }
    for (var testY = 0; testY < pieceMatrix.length; testY++) {
    for (var testX = 0; testX < pieceMatrix[0].length; testX++) {
        if (pieceMatrix[testY][testX] != 0 && pieceMatrix[testY][testX] != 9) {
        // ctx.drawImage(blocks, 30 * (pieceMatrix[testY][testX] + 1) + 1, 0, 30, 30, (testX + x) * 30, (testY + y) * 30, 30, 30);
        ctx.fillStyle = colors[pieceMatrix[testY][testX]];
        ctx.fillRect((testX + x) * 30 + 102, (testY + y) * 30 + 2, 30, 30)
        // viewBoard[testY + y][testX + x] = pieceMatrix[testY][testX]
        }
    }
    }
    for (var pixelY = 0; pixelY < board.length; pixelY++) {
    for (var pixelX = 0; pixelX < board.length; pixelX++) {
        if (board[pixelY][pixelX] != 0) {
        // ctx.drawImage(blocks, 30 * (board[pixelY][pixelX] + 1) + 1, 0, 30, 30, pixelX * 30, pixelY * 30, 30, 30);
        ctx.fillStyle = colors[board[pixelY][pixelX]];
        ctx.fillRect(pixelX * 30 + 102, pixelY * 30 + 2, 30, 30)
        }
    }
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(402, 2, width, height);
    ctx.fillRect(2, 2, 100, 100);
    ctx.fillStyle = "#d3d3d3";
    ctx.fillRect(402, 2, 2, height);
    ctx.fillRect(101, 2, 2, 100);
    ctx.fillStyle = "#909090";
    ctx.fillRect(101, 104, 2, height);
    ctx.fillRect(0, 102, 103, 2);
    ctx.fillRect(0, 0, 2, 104);
    ctx.fillRect(0, 0, 604, 2);
    ctx.fillRect(502, 0, 2, 604);
    ctx.fillRect(102, 602, 404, 2);
    for (var q = 0; q < queue.length; q++) {
    for (var queueY = 0; queueY < piece_matrix[queue[q]].length; queueY++) {
        for (var queueX = 0; queueX < piece_matrix[queue[q]][0].length; queueX++) {
        if (piece_matrix[queue[q]][queueY][queueX] != 0 && piece_matrix[queue[q]][queueY][queueX] != 9) {
            color = piece_matrix[queue[q]][queueY][queueX]
            x_displace = 0
            y_displace = 0
            if (queue[q] in piece_displacement) {
            x_displace = piece_displacement[queue[q]][0]
            y_displace = piece_displacement[queue[q]][1]
            }
            // ctx.drawImage(blocks, 30 * (color + 1) + 1, 0, 30, 30, queueX * 20 + 321 + x_displace * 20, queueY * 20 + 100 * q + 125 + y_displace * 20, 20, 20);
            ctx.fillStyle = colors[color];
            ctx.fillRect(queueX * 20 + 423 + x_displace * 20, queueY * 20 + 100 * q + 32 + y_displace * 20, 20, 20)
        }
        }
    }
    }
    if (held) {
    for (var queueY = 0; queueY < piece_matrix[held].length; queueY++) {
        for (var queueX = 0; queueX < piece_matrix[held][0].length; queueX++) {
        if (piece_matrix[held][queueY][queueX] != 0 && piece_matrix[held][queueY][queueX] != 9) {
            x_displace = 0
            y_displace = 0
            if (held in piece_displacement) {
            x_displace = piece_displacement[held][0]
            y_displace = piece_displacement[held][1]
            }
            color = piece_matrix[held][queueY][queueX]
            // ctx.drawImage(blocks, 30 * (color + 1) + 1, 0, 30, 30, queueX * 20 + x_displace * 20 + 321, queueY * 20 + 30 + y_displace * 20, 20, 20);
            ctx.fillStyle = colors[color];
            ctx.fillRect(queueX * 20 + 21 + x_displace * 20, queueY * 20 + 32 + y_displace * 20, 20, 20)
        }
        }
    }
    }
}

function gameOver() {
    console.log("Game over, restarting.");
    board = Array.from({ length: 20 }, () => Array(10).fill(0));
    queue = [];
    if (queue.length < 10) {
    addBag()
    }
    piece = queue.shift();
    held = ""
    b2b = false;
    if (piece == "O") {
    x = 4
    } else {
    x = 3
    }
    y = 0
    rotation = 0;
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    var start = new Date().getTime()
    graficks()
}

function move(key) {
    var keys = Object.keys(controls);
    for(var i = 0; i < keys.length;i++){
    if (controls[keys[i]][0] == parseInt(key)) {
        move_type = keys[i]
        eval(move_type + "()")
        pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
        for (var j = 0; j < rotation; j++) {
        rotate(pieceMatrix)
        }
        graficks()
    }
    }

    function clockwise() {
    if (rotation < 3) {
        rotation++;
    } else {
        rotation = 0;
    }
    }

    function counterclockwise() {
    if (rotation > 0) {
        rotation--;
    } else {
        rotation = 3;
    }
    }

    function hold() {
    //(queue.length == 0 && (held == null || held == 0))
    if (held == null || held == 0) {
        held = piece;
        piece = queue.shift();
        if (queue.length < 10) {
        addBag()
        }
    } else {
        [held, piece] = [piece, held];
    }
    if (piece == "O") {
        x = 4;
    } else {
        x = 3;
    }
    y = 0;
    rotation = 0;
    }

    function softdrop() {
    if (fall_speed == 0) {
        while (!collide([pieceMatrix, x, y+1, piece])) {
        y++;
        }
    } else if (!collide([pieceMatrix, x, y+1, piece])){
        y++;
    }
    }

    function move_right() {
    if (!collide([pieceMatrix, x+1, y, piece])) {
        x++;
    }
    }
    function move_left() {
    if (!collide([pieceMatrix, x-1, y, piece])) {
        x--;
    }
    }
    function rotate_left() {
    old_rotation = rotation
    counterclockwise()
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    for (var j = 0; j < rotation; j++) {
        rotate(pieceMatrix)
    }
    if (!tryWallkick(old_rotation, rotation)) {
        clockwise()
    }
    console.log(rotation);
    }
    function rotate_right() {
    old_rotation = rotation
    clockwise()
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    for (var j = 0; j < rotation; j++) {
        rotate(pieceMatrix)
    }
    if (!tryWallkick(old_rotation, rotation)) {
        counterclockwise()
    }
    console.log(rotation);
    }
    function rotate_180() {
    old_rotation = rotation;
    rotation = (rotation + 2) % 4;
    pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
    for (var j = 0; j < rotation; j++) {
        rotate(pieceMatrix);
    }
    if (!tryWallkick(old_rotation, rotation)) {
        rotation = old_rotation;
    }
    }
    function harddrop() {
    let dropY = y;
    while (!collide([pieceMatrix, x, dropY+1, piece])) {
        dropY++;
    }
    place([pieceMatrix, x, dropY, piece])
    
    }
}