/*
 * Vertical transition
 *
 * @author dhuertas
 * @email huertas.dani@gmail.com
 */
var VerticalTransition = function() {

	var width 			= 0,
		height 			= 0;

	var currentImage 	= "",
		nextImage 		= "";

	var container 		= null;

	var perspective 	= 1000,
		numberOfPrisms	= 12,
		sideColor		= "#222";

	var totalTime		= 0,
		animationTime	= 0,
		delay			= 0,
		transitionTime	= 0;

	var prismOrder		= [];

	/*
	 * Animate each prism by modifying the transform values
	 */
	var animate = function(element, delay) {

		var rel = parseInt(element.getAttribute("rel"));

		setTimeout(function() {

			styleMe(element, "Transform", 
			"translate3d("+(rel-1)*(width/numberOfPrisms) + "px,0,-"+height/2+"px) " +
			"rotate3d(1,0,0,90deg)");

		}, delay);

	}

	/*
	 * The main slide function
	 */
	var verticalPrisms = function(id) {

		var transition = document.createElement("div");

		var sideClasses = ["front", "back", "left", "right", "top", "bottom"];

		container.style.width = width + "px";
		container.style.height = height + "px";

		styleMe(container, "Perspective", perspective + "px");

		transition.setAttribute("class", "transition");
		transition.setAttribute("id", "prisms");

		transition.style.width = width + "px";
		transition.style.height = height + "px";
		transition.style.position = "absolute";

		styleMe(transition, "TransformStyle", "preserve-3d");
		styleMe(transition, "Transform", "translate3d(0,0,0)");

		// Fix: Chrome does not show the left and right sides as it is expected
		prismOrder.length = 0;

		if (numberOfPrisms%2 == 0) {
			// For an even number of prisms we add them in the following order:
			// 1, 2, 3, ... , n/2, n, n-1, n-2, ... , n/2 + 1
			// e.g. 8 prisms: [1, 2, 3, 4, 8, 7, 6, 5]
			for (var i = 1, len = numberOfPrisms/2; i <= len; i++) {
				prismOrder.push(i);
			}

			for (var i = numberOfPrisms, len = numberOfPrisms/2; i > len; i--) {
				prismOrder.push(i);
			}

		} else {
			// and for an odd number of prisms:
			// 1, 2, 3, ... , (n+1)/2, n, n-1, n-2, ... , (n+1)/2 + 1 
			// e.g. 9 prisms: [1, 2, 3, 4, 5, 9, 8, 7, 6]
			for (var i = 1, len = (numberOfPrisms+1)/2; i < len; i++) {
				prismOrder.push(i);
			}

			for (var i = numberOfPrisms, len = (numberOfPrisms+1)/2; i >= len; i--) {
				prismOrder.push(i);
			}

		}

		for (var i = 0; i < prismOrder.length; i++) {

			var prism = document.createElement("div");

			prism.setAttribute("rel", prismOrder[i]);
			prism.setAttribute("class", "prism");

			prism.style.height = height + "px"; 
			prism.style.position = "absolute";

			styleMe(prism, "TransformStyle", "preserve-3d");

			styleMe(prism, "Transform", "translate3d(" + (width/numberOfPrisms)*(prismOrder[i]-1) + "px,0,-"+(height/2)+"px)");

			prism.className += " transform";
			styleMe(prism, "TransitionDuration", transitionTime + "s");
			styleMe(prism, "TransitionTimingFunction", "ease-in-out");

			for (var j = 0; j < 6; j++) {

				var side = document.createElement("div");

				side.setAttribute("class", sideClasses[j]);

				side.style.position = "absolute";
				side.style.backgroundColor = "rgba(240, 240, 240, .5)";
				var transform = "";

				switch(sideClasses[j]) {

					case "front":
						side.style.width = width/numberOfPrisms + "px";
						side.style.backgroundImage  = "url('" + currentImage + "')";
						side.style.backgroundPosition = "-" + (width/numberOfPrisms)*(prismOrder[i]-1) + "px 0";
						transform = "rotate3d(0,1,0,0) translate3d(0,0," + height/2 + "px)";
						break;

					case "back":
						side.style.width = width/numberOfPrisms + "px";
						transform = "rotate3d(1,0,0,180deg) translate3d(0,0," + height/2 + "px)";
						break;

					case "left":
						side.style.width = height + "px";
						side.style.backgroundColor = sideColor;
						transform = "rotate3d(0,1,0,-90deg) translate3d(0,0," + height/2 + "px)";
						break;

					case "right":
						side.style.width = height + "px";
						side.style.backgroundColor = sideColor;
						transform = "rotate3d(0,1,0,90deg) translate3d(0,0," + (width/numberOfPrisms-height/2) + "px)";
						break;

					case "top":
						side.style.width = width/numberOfPrisms + "px";
						transform = "rotate3d(1,0,0,90deg) translate3d(0,0," + height/2 + "px)";
						break;

					case "bottom":
						side.style.width = width/numberOfPrisms + "px";
						side.style.backgroundImage = "url('" + nextImage + "')";
						side.style.backgroundPosition = "-" + (width/numberOfPrisms)*(prismOrder[i]-1) + "px 0";
						transform = "rotate3d(1,0,0,-90deg) translate3d(0,0," + height/2 + "px)";
						break;

				}

				side.style.height = height + "px";
				side.style.display = "block";
				side.style.position = "absolute";

				styleMe(side, "BackfaceVisibility", "hidden");
				styleMe(side, "Transform", transform);

				prism.appendChild(side);

			}

			transition.appendChild(prism);

		}

		container.appendChild(transition);

	}

	/*
	 * Initializes the prism transition with the slider scope
	 */
	this.init = function() {

		width 			= this.options.width;
		height 			= this.options.height;

		currentImage 	= this.options.path +
			this.collection[this.currentImage];

		nextImage 		= this.options.path + 
			this.collection[(this.currentImage+1)%this.collection.length];

		container 		= this.backstage;

		totalTime 		= this.options.duration;
		animationTime 	= totalTime/4;
		delay 			= ((totalTime/2) - animationTime)/numberOfPrisms;
		transitionTime 	= animationTime/1000;

		// build prisms
		verticalPrisms.call(this);

	}

	this.run = function(callback) {

		var scope = this;

		var prisms = document.getElementsByClassName("prism");

		var transformEvent = whichTransformEvent();

		for (var i = 0; i < prisms.length; i++) {

			animate(prisms[prismOrder.indexOf(i + 1)], i*delay);

			// When the animation ends for the last prism, execute
			// callback function
			if (i == prisms.length - 1) {

				prisms[prismOrder.indexOf(i + 1)].addEventListener(transformEvent, function() {

					callback.call(scope);

				}, false);

			}

		}

	}

};

Slider.prototype.transitions.vertical = new VerticalTransition();