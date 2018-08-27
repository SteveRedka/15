$(document).ready(function(){

	$('#btn-help').click( function() {
		$("#help-message").slideToggle()
	})

	$('#btn-slice-2-2').click( function() {
		FifteenGame($('#sliced-image'), $('#original-image').children('img')[0], 2, 2)
	})

	$('#btn-slice-3-3').click( function() {
		FifteenGame($('#sliced-image'), $('#original-image').children('img')[0], 3, 3)
	})
	$('#btn-slice-4-4').click( function() {
		FifteenGame($('#sliced-image'), $('#original-image').children('img')[0], 4, 4)
	})
	$('#btn-slice-3-6').click( function() {
		FifteenGame($('#sliced-image'), $('#original-image').children('img')[0], 3, 6)
	})

	// Events

	$(document).on( "fifteenVictory", function(e){
		console.log('fds')
		Stopwatch.stop()
	} );
	$(document).on( "fifteenScrambled", function(e){Stopwatch.start()} );
	$(document).on( "fifteenTurn", function(e,data){$('#turn-count').html(data.turns)} );
	$(document).on( "fifteenReset", function(e){Stopwatch.resetStopwatch()} );

	// Timer
	var Stopwatch = new (function() {
	    // Stopwatch element on the page
	    var $stopwatch = $('#stopwatch');

	    // Timer speed in milliseconds
	    var incrementTime = 70;

	    // Current timer position in milliseconds
	    var currentTime = 0;

	    // Start the timer
	    this.start = function () {
	        Stopwatch.Timer = $.timer(updateTimer, incrementTime, true);
	    }

	    this.stop = function () {
	    	this.Timer.toggle()
	    }

	    // Output time and increment
	    function updateTimer() {
	        var timeString = formatTime(currentTime);
	        $stopwatch.html(timeString);
	        currentTime += incrementTime;
	    }

	    // Reset timer
	    this.resetStopwatch = function() {
	        currentTime = 0;
	        Stopwatch.Timer.stop().once();
	    };

	});

	// Set custom image

	//$("#btn-fifteen-new-image").click(setNewImage($('#fifteen-image-input').val()))
	console.log($('#fifteen-image-input').val())
	$("#btn-fifteen-new-image").click( function() {IsValidImageUrl($('#fifteen-image-input').val(), myCallback)})

	function myCallback(url, answer) {
	    if (answer == false ) {
	    	$("#messages").html('Please, enter url to valid image')
	    } else if ( answer == true ) {
	    	$('.image-slice').attr('src', url)
	    	$('.fifteen-image').attr('src', url)
	    	$('#fifteen-image-input').val('')
	    }
	}

	function IsValidImageUrl(url, callback) {
	    var img = new Image();
	    img.onerror = function() { callback(url, false); }
	    img.onload =  function() { callback(url, true); }
	    img.src = url
	}

	//IsValidImageUrl("file:///home/why/proj/slicer/cat.jpg", myCallback);
	//IsValidImageUrl("http://goo.gl/GWtGo", myCallback);
	//IsValidImageUrl("http://error", myCallback);

	function pad(number, length) {
	    var str = '' + number;
	    while (str.length < length) {str = '0' + str;}
	    return str;
	}

	function formatTime(time) {
	    time = time / 10;
	    var min = parseInt(time / 6000),
	        sec = parseInt(time / 100) - (min * 60),
	        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
	    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
	}

});
