function checkImage2(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.send();
	request.onload = function () {
		status = request.status;
		if (request.status == 200) {
			//if(statusText == OK)
			console.log('image exists');
			document.getElementById('pfp').src = url;
		} else {
			console.log("image doesn't exist");
			document.getElementById('pfp').src = 'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png';
		}
	};
}

const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('userid');

if (!userid) {
  console.error('userid parameter is missing in the URL');
} else {
  const apiUrl = `https://twowi.de/userinfo.php?userid=${userid}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); 
      userData = data;
let temp = document.createElement("h1");
temp.setAttribute("class", "preview title");
temp.textContent = userData["username"];
document.getElementById("profile card").appendChild(temp);


temp = document.createElement("h1");
temp.setAttribute("class", "preview title");
temp.textContent = "Best Play";
document.getElementById("profile best").prepend(temp);


var url = "https://twowi.de/leaderboardData.php";
var http = new XMLHttpRequest();
http.open("GET", url, true);
http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
        $.getJSON("setups.json", function (data) {
            var topUsers = JSON.parse(http.responseText);
            var point_values = {
                easy: 1,
                medium: 3,
                hard: 5,
                test: 0,
            };
            var color_values = [
                "white",
                "white",
                "#ff8ff6",
                "#f1c40f",
                "#f1c40f",
            ];
            var d = new Date();
            var n = d.getTime();
            
            maxpoints = 0;
            maxdifficulty = "";
            maxname = "";
            
            for (var i = 0; i < topUsers.length; i++) {
                user = topUsers[i];
                new_history = JSON.parse(user["history"]);
                topUsers[i]["diff"] = 0;
                for (var [key, value] of Object.entries(new_history)) {
                    if (value["completed"] != 0) {
                        if (!data[value["difficulty"]][key]) {
                            continue;
                        }
                        winrate =
                            data[value["difficulty"]][key]["completions"] /
                            data[value["difficulty"]][key]["plays"];
                        if (data[value["difficulty"]][key]["plays"] != 0) {
                            points =
                                parseFloat(topUsers[i]["points"]) +
                                parseFloat(
                                    point_values[value["difficulty"]] *
                                        (1 - winrate)
                                );
                                
                                if(user["userid"] == userid){
                                    if(points>maxpoints){
                                        maxdifficulty = value["difficulty"];
                                        maxpoints = parseFloat(
                                    point_values[value["difficulty"]] *
                                        (1 - winrate)
                                );
                                        maxname = key;
                                    }
                                }
                            if (
                                data[value["difficulty"]][key]["season"] ==
                                data.global.season
                            ) {
                                topUsers[i]["points"] = points.toFixed(1);
                            }
                            if (value["completed"] > n - 1000 * 60 * 60 * 24) {
                                points =
                                    parseFloat(topUsers[i]["diff"]) +
                                    parseFloat(
                                        point_values[value["difficulty"]] *
                                            (2 - winrate)
                                    );
                                if(user["userid"] == userid){
                                    if(points>maxpoints){
                                        maxdifficulty = value["difficulty"];
                                        maxpoints = parseFloat(
                                        point_values[value["difficulty"]] *
                                            (2 - winrate)
                                    );
                                        maxname = key;
                                    }
                                }
                                if (
                                    data[value["difficulty"]][key]["season"] ==
                                    data.global.season
                                ) {
                                    topUsers[i]["diff"] = points.toFixed(1);
                                }
                            }
                        }
                    }
                }
            }

            topUsers.sort(function (b, a) {
                return a["points"] - b["points"] || b["time"] - a["time"];
            });

            topUsersOld = JSON.parse(JSON.stringify(topUsers));
            topUsersOld.sort(function (b, a) {
                return a["points"] - a["diff"] - (a["points"] - a["diff"]);
            });
            for (var i = 0; i < topUsers.length; i++) {
                if (topUsers[i]["userid"] == userid) {
                  rank = i;
                  temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.textContent = "Rank "+(i+1);

                  document.getElementById("profile card").appendChild(temp);
                  
                  bestpuzzle = data[maxdifficulty][maxname]; 
                  bestdesc = bestpuzzle['description'];
                  bestpercentt = Math.round((bestpuzzle['completions'] / bestpuzzle['plays']) * 100);
                  bestpercent = bestpercentt+"% cleared of "+bestpuzzle['plays'];
                  
        var canvas = document.getElementById("bestboard");
        
     ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    const width = 190;
    const height = 380;
    const colors = ["#000000" ,"#FF0100", "#FEAA00", "#FFFE02", "#00EA01", "#00DDFF", "#0000FF", "#AA00FE", "#555555"]

    ctx.fillRect(0, 0, width, height);
    var board = bestpuzzle["board"];
    for (var pixelY = 0; pixelY < board.length; pixelY++) {
     for (var pixelX = 0; pixelX < board.length; pixelX++) {
       if (board[pixelY][pixelX] != 0) {
         // ctx.drawImage(blocks, 30 * (board[pixelY][pixelX] + 1) + 1, 0, 30, 30, pixelX * 30, pixelY * 30, 30, 30);
         ctx.fillStyle = colors[board[pixelY][pixelX]];
         ctx.fillRect(pixelX * width/10, pixelY * width/10, width/10, width/10)
       }
     }
    }
    
    document.getElementById("linktobest").setAttribute("href", `game?difficulty=${maxdifficulty}&setup=${maxname}`);
   
    temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.textContent = maxname;
                  temp.id = "bestName";

                  document.getElementById("bestcontent").appendChild(temp);
                  temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.textContent = bestdesc;
                  temp.id = "bestDescription";

                  document.getElementById("bestcontent").appendChild(temp);
   
                  temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.innerHTML = `<span id="${maxdifficulty}">${maxdifficulty} - worth ${maxpoints.toFixed(1)} points</span>`;
                  temp.setAttribute("id", "bestDifficulty");
                  

                  document.getElementById("bestcontent").appendChild(temp);
                  
                  temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.innerHTML = `<span id="bestWinrate">${bestpercent}</span>`;
                  temp.id = "bestDifficulty";

                  document.getElementById("bestcontent").appendChild(temp);
   
                  
      temp = document.createElement("img");
temp.setAttribute("class", "innerprofile pfp");
temp.setAttribute("id", "pfp");
temp.setAttribute("height", "33%");
document.getElementById("profile card").appendChild(temp);
      checkImage2(`https://cdn.discordapp.com/avatars/${userData['userid']}/${userData['avatar']}.webp`);
                  
                  historyy = JSON.parse(userData['history']);
                  count = 0;
                    easy = 0;
                    medium = 0;
                    hard = 0;
                    
                    timern = Date.now();
                    
                    maxtimedif = timern;
                    recentname = "";
                    recentdif = "";
                    
                   for (var key in historyy) {
  if (historyy[key]) {
    if((timern-historyy[key].time)<maxtimedif){
        maxtimedif = timern-historyy[key].time;
        recentname = key;
        recentdif = historyy[key].difficulty;
    }  
    if (historyy[key].completed !== 0) {
        if(historyy[key].difficulty=="easy"){
            easy++;
        }else if(historyy[key].difficulty=="medium"){
            medium++;
        }else if(historyy[key].difficulty=="hard"){
            hard++;
        }
      count++;
    }
  }
}

canvas = document.getElementById("recentboard");
         ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";

    ctx.fillRect(0, 0, width, height);
    board = data[recentdif][recentname]["board"];
    console.log(board);
    for (var pixelY = 0; pixelY < board.length; pixelY++) {
     for (var pixelX = 0; pixelX < board.length; pixelX++) {
       if (board[pixelY][pixelX] != 0) {
         // ctx.drawImage(blocks, 30 * (board[pixelY][pixelX] + 1) + 1, 0, 30, 30, pixelX * 30, pixelY * 30, 30, 30);
         ctx.fillStyle = colors[board[pixelY][pixelX]];
         ctx.fillRect(pixelX * width/10, pixelY * width/10, width/10, width/10)
       }
     }
    }
    
    document.getElementById("linktorecent").setAttribute("href", `game?difficulty=${recentdif}&setup=${recentname}`);
    temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.textContent = recentname;
                  temp.id = "recentName";
                  document.getElementById("profile history").appendChild(temp);
                    
                temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.textContent = "Puzzles Complete - "+count;

                  document.getElementById("profile card").appendChild(temp);
                  
                  temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.textContent = "Points - "+topUsers[i]["points"];

                  document.getElementById("profile card").appendChild(temp);
                  
                  temp = document.createElement("h2");
                  temp.setAttribute("class", "preview season");
                  temp.innerHTML = `<span id="easy">${easy}</span>/<span id="medium">${medium}</span>/<span id="hard">${hard}</span>`

                  document.getElementById("profile card").appendChild(temp);
                    
                                      

                }
            }
        });
    }
};
http.send(null);
      
      
      
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

