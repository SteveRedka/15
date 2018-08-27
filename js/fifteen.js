$(document).ready(function(){
	var scrambled = false
	var turns = 0

	FifteenGame = function FifteenGame(gameDiv, img, sliceX, sliceY) {
		$(gameDiv).empty()
		var sliceWidth = img.width/sliceX
		var sliceHeight = img.width/sliceY
		for (y=0; y < sliceY; y++) {
			for (x=0; x < sliceX; x++) {
				img_part = $(img).clone()
				img_part.addClass('image-slice')
				img_part.css('left', -x*sliceWidth)
				img_part.css('top', -y*sliceHeight)
	        	$(img_part).appendTo('#sliced-image');
	        	$(gameDiv).children('img').last().wrap('<div class="img-slice-container"></div>');
	        	imgPartContainer = $('.img-slice-container').last()
	        	imgPartContainer.css('width', sliceWidth)
	        	imgPartContainer.css('height', sliceHeight)
				imgPartContainer.css('left', x*sliceWidth)
				imgPartContainer.css('top', y*sliceHeight)
	        	imgPartContainer.attr("id","slice-"+x+"-"+y);
	    	$('#sliced-image').append('<br>');
	    	}
    	}
    	$('.img-slice-container').last().remove()
    	$('.img-slice-container').click( function() {
    		tryToMove(this, sliceWidth, sliceHeight, sliceX, sliceY, 200)
    	})
    	//$('.img-slice-container').draggable({ revert: true });

		setCoordsForSlices(sliceWidth, sliceHeight)

		slidesScramble(sliceWidth, sliceHeight, sliceX, sliceY)
	}

	function slidesScramble(sliceWidth, sliceHeight, sliceX, sliceY) {
		if (scrambled == true) {
		$(document).trigger("fifteenReset");
		}
		scrambled = false
		// Find empty slide
		// Temporary solution
		emptyX = sliceX-1
		emptyY = sliceY-1
		prevPosX = sliceX
		prevPosY = sliceY
		// 50 clicks
		for(var i = 0; i < (sliceX*sliceY*20); i++) {
			// Find its neighbours
			neighbourRight = $('.img-slice-container[data-coord-x="' +
								    (emptyX+1) +
								    '"][data-coord-y="' +
								    emptyY + '"]'
								    )[0]
			neighbourLeft = $('.img-slice-container[data-coord-x="' +
								    (emptyX-1) +
								    '"][data-coord-y="' +
								    emptyY + '"]'
								    )[0]
			neighbourTop = $('.img-slice-container[data-coord-x="' +
								    emptyX +
								    '"][data-coord-y="' +
								    (emptyY-1) + '"]'
								    )[0]
			neighbourBottom = $('.img-slice-container[data-coord-x="' +
								    emptyX +
								    '"][data-coord-y="' +
								    (emptyY+1) + '"]'
								    )[0]
			// Put them into array
			neighbours = [neighbourRight, neighbourLeft, neighbourTop, neighbourBottom]
			// Filter out all non-existent neighbours
			neighbours = neighbours.filter(function(n){return n !== undefined});
			// Prevent self-cancelling turns
			neighbours = neighbours.filter(function(n){return ($(n).attr('data-coord-x') !== prevPosX   &&
															   $(n).attr('data-coord-y') !== prevPosY)});
			prevPosX = emptyX
			prevPosY = emptyY
			// Select random neighbour
			random_neighbour = neighbours[Math.floor(Math.random()*neighbours.length)]
			// Set new empty coords
			emptyX = parseInt($(random_neighbour).attr("data-coord-x"))
			emptyY = parseInt($(random_neighbour).attr("data-coord-y"))
    		tryToMove(random_neighbour, sliceWidth, sliceHeight, sliceX, sliceY, 2)
			//$(random_neighbour).trigger("click");
		}
		scrambled = true
		$(document).trigger("fifteenScrambled");
	}

	function tryToMove (obj, sliceWidth, sliceHeight, sliceX, sliceY, slideTime) {
		x = parseInt($(obj).attr('data-coord-x'))
		y = parseInt($(obj).attr('data-coord-y'))
		// Target coors
		xRight = x + 1
		xLeft = x - 1
		yTop = y - 1
		yBottom = y + 1
		// neighbours
		var elementToRight = $('.img-slice-container[data-coord-x="' +
							    xRight +
							    '"][data-coord-y="' +
							    y + '"]'
							    )[0]
		var elementToLeft = $('.img-slice-container[data-coord-x="' +
							    xLeft +
							    '"][data-coord-y="' +
							    y + '"]'
							    )[0]
		var elementToTop = $('.img-slice-container[data-coord-x="' +
							    x +
							    '"][data-coord-y="' +
							    yTop + '"]'
							    )[0]
		var elementToBottom = $('.img-slice-container[data-coord-x="' +
							    x +
							    '"][data-coord-y="' +
							    yBottom + '"]'
							    )[0]
		// Try to move
		if (!elementToTop && y > 0) {
			$(obj)
				.attr('data-coord-y', yTop)
				.animate({top: "-="+sliceHeight}, slideTime )
		} else if (!elementToRight && x < sliceX-1) {
			$(obj)
				.attr('data-coord-x', xRight)
				.animate({left: "+="+sliceWidth}, slideTime )
		} else if (!elementToBottom && y < sliceY-1) {
			$(obj)
				.attr('data-coord-y', yBottom)
				.animate({top: "+="+sliceHeight}, slideTime )
		} else if (!elementToLeft && x > 0) {
			$(obj)
				.attr('data-coord-x', xLeft)
				.animate({left: "-="+sliceWidth}, slideTime )
		} else {
			turns--
			// Shake it
			$(obj)
				.animate({opacity: 0.5}, slideTime/2)
				.animate({opacity: 1}, slideTime/2)
		}

		// Count turns
		if (scrambled == true) {
			turns++
			$(document).trigger("fifteenTurn", {turns: turns});
		}

		// Check if user have won already
		if (countSlicesInPlaces() === (sliceX * sliceY - 1) && scrambled == true) {
			$(document).trigger("fifteenVictory");
			scrambled = false
		}
	}

	function setCoordsForSlices(sliceWidth, sliceHeight) {
		slices = $('.img-slice-container')
		$.each( slices, function( key, value ) {
		  $(value).attr('data-coord-x', parseInt($(value).css('left'))/sliceWidth)
		  $(value).attr('data-coord-y', parseInt($(value).css('top'))/sliceHeight)
		  $(value).attr('data-initial-coord-x', parseInt($(value).css('left'))/sliceWidth)
		  $(value).attr('data-initial-coord-y', parseInt($(value).css('top'))/sliceHeight)
		  //console.log(value);
		});
	}

	function countSlicesInPlaces (sliceX, sliceY) {
		//totalCount = sliceX*sliceY
		slices = $('.img-slice-container')
		slicesInPlaces = slices
						  .filter(function( index ) {
						    return ($( this ).attr('data-coord-x') === $( this ).attr('data-initial-coord-x') &&
						    		$( this ).attr('data-coord-y') === $( this ).attr('data-initial-coord-y'));
						  })
		return slicesInPlaces.length
	}
});
