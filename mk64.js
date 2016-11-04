// Top level JQuery
$(document).ready(function () {
    var Player = function(name, time) {
        return {
            uid : Date.now(),
            name : name,
            times : [time],
            bestTime : time
        }
    };

    // 0. Helpers
    function getTimeString(timeMillis) {
        var min = Math.floor(timeMillis / 60000);
        var sec = Math.floor((timeMillis - min * 60000)/1000);
        var mil = timeMillis - min * 60000 - sec * 1000;

        return min + '\'' + sec + '\"' + mil ;
    }

    function getTimeMs(timeMin, timeSec, timeMillis) {
        return timeMin * 60000 + timeSec * 1000 + timeMillis;
    }

    function getBestTime(player) {
        var bt = player.times[0];
        for (var time in player.times) {
            if (player.times[time] < bt) {
                bt = player.times[time];
            }
        }
        return bt;
    }

    function compareBestTimes(playerA, playerB) {
      if (playerA.bestTime < playerB.bestTime)
        return -1;
      if (playerA.bestTime > playerB.bestTime)
        return 1;
      return 0;
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function checkValidTime(timeMin, timeSec, timeMillis) {
        return  (isNumeric(timeMin)
              && isNumeric(timeSec)
              && isNumeric(timeMillis)
              && timeMin < 59
              && timeMin >= 0
              && timeSec < 59
              && timeSec >= 0
              && timeMillis < 99
              && timeMillis >= 0);
    }

    function saveText(text, filename) {
          var a = document.createElement('a');
          a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
          a.setAttribute('download', filename);
          a.click();
    }

    // 1. Load data from local Storage
    var players = [];
    for (var uid in localStorage) {
        players.push(JSON.parse(localStorage.getItem(uid)));
    }

    players.sort(compareBestTimes);
    for (var p in players) {
        $('#taskList').append("<li id='" + players[p].uid + "'>" + players[p].name + "  --  " + getTimeString(players[p].bestTime) + "</li>");
    }

    // 2. Save data to local Storage
    $('#taskEntryForm').submit(function () {
        // Get form values
        var playerName = $('#playerInput').val();
        var timeMin    = parseInt($('#timeInputMin').val(), 10);
        var timeSec    = parseInt($('#timeInputSec').val(), 10);
        var timeMillis = parseInt($('#timeInputMillis').val(), 10);

        var isFormFull = (playerName !== "" &&  timeMin !== "" && timeSec !== "" &&  timeMillis !== "");
        // If form is full
        if (isFormFull) {
            // Check time is valid
            if (!checkValidTime(timeMin, timeSec, timeMillis)) {
                alert("Invalid time !");
                return false;
            }

            // Check if player is on record
            var player = JSON.parse(localStorage.getItem(playerName));
            var timems = getTimeMs(timeMin, timeSec, timeMillis);

            // If new player, create one
            if (player == null) {
                player = Player(playerName, timems);
            } else {
                // Otherwise update his record
                player.times.push(timems);
                player.bestTime = getBestTime(player);
            }
            // Save to local storage
            localStorage.setItem(player.name, JSON.stringify(player));

            // Update UI
            // Create a new li
            var taskMessage = player.name + '  --  ' + getTimeString(player.bestTime);
            $('#taskList').append("<li class='task' id='" + player.name + "'>" + taskMessage + "</li>");
            var task = $('#' + player.name);
            task.css('display', 'none');
            task.slideDown();

            // Reset form
            $('#playerInput').val("");
            $('#timeInputMin').val("");
            $('#timeInputSec').val("");
            $('#timeInputMillis').val("");
        }
        return false;
    });

    // Delete player from list
    $('#taskList').on("click", "li", function (event) {
        self = $(this);
        playerID = self.attr('id');
        localStorage.removeItem(playerID);
        self.slideUp('slow', function () {
            self.remove();
        });
    });

    // Delete all players
    // USE WITH CAUTION
    $('#backup').click(function () {
        //localStorage.clear();
        saveText(JSON.stringify(localStorage), 'backup-' + Date.now());
    });
});
