$(document).ready(function () {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    var i = 0;
    for (i = 0; i < localStorage.length; i++) {
        var taskID = "player-" + i;
        $('#taskList').append("<li id='" + taskID + "'>" + localStorage.getItem(taskID) + "</li>");
    }
    $('#clear').click(function () {
        localStorage.clear();
    });
    $('#taskEntryForm').submit(function () {
            var playerName = $('#playerInput').val();
            var timeMin = $('#timeInputMin').val();
            var timeSec = $('#timeInputSec').val();
            var timeMillis = $('#timeInputMillis').val();

        if (playerName !== "" &&  timeMin !== "" && timeSec !== "" &&  timeMillis !== "") {
            if (!isNumeric(timeMin) || !isNumeric(timeSec) || !isNumeric(timeMillis) || timeSec > 59 || timeMillis > 99)
            {
                alert("Invalid time !");
                return false;
            }
            var taskID = "player-" + i;
            var score = {
                playerName: $('#playerInput').val(),
                timeMin : $('#timeInputMin').val(),
                timeSec : $('#timeInputSec').val(),
                timeMilli : $('#timeInputMillis').val()
            };
            var taskMessage = score.playerName + '  --  ' + score.timeMin + '\'' + score.timeSec + '\"' + score.timeMilli;
            localStorage.setItem(taskID, taskMessage);
            $('#taskList').append("<li class='task' id='" + taskID + "'>" + taskMessage + "</li>");

            var task = $('#' + taskID);
            task.css('display', 'none');
            task.slideDown();

            $('#playerInput').val("");
            $('#timeInputMin').val("");
            $('#timeInputSec').val("");
            $('#timeInputMillis').val("");
            i++;
        }
        return false;
    });

    $('#taskList').on("click", "li", function (event) {
        self = $(this);
        taskID = self.attr('id');
        localStorage.removeItem(taskID);
        self.slideUp('slow', function () {
            self.remove();
        });

    });


});
