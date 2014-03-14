/*
 * Horizontal transition
 *
 * @author dhuertas
 * @email huertas.dani@gmail.com
 */
var HorizontalTransition = function() {

	var width 			= 0,
		height 			= 0;

	var currentImage 	= "",
		nextImage 		= "";

	var container 		= null;

	var perspective 	= 1000,
		numberOfPrisms	= 3,
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
				"translate3d(0,"+(rel-1)*(height/numberOfPrisms) + "px,-" + width/2 + "px) " +
				"rotate3d(0,1,0,90deg)");

		}, delay);

	}

	/*
	 * The main slide function
	 */
	var horizontalPrisms = function(id) {

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

		prismOrder.length = 0;

		for (var i = 1, len = numberOfPrisms; i <= len; i++) {
			prismOrder.push(i);
		}

		for (var i = 0; i < prismOrder.length; i++) {

			var prism = document.createElement("div");

			prism.setAttribute("rel", prismOrder[i]);
			prism.setAttribute("class", "prism");

			prism.style.width = width + "px"; 
			prism.style.position = "absolute";

			styleMe(prism, "TransformStyle", "preserve-3d");

			styleMe(prism, "Transform", 
				"translate3d(0,"+(height/numberOfPrisms)*(prismOrder[i]-1)+"px,-"+(width/2)+"px)");

			prism.className += " transform";
			styleMe(prism, "TransitionDuration", transitionTime + "s");
			styleMe(prism, "TransitionTimingFunction", "ease-in-out");

			for (var j = 0; j < 6; j++) {

				var side = document.createElement("div");

				side.setAttribute("class", sideClasses[j]);

				side.style.position = "absolute";
				side.style.backgroundColor = "rgba(240, 240, 240, .5)";
				side.style.width = width + "px";
				side.style.display = "block";

				var transform = "";

				switch(sideClasses[j]) {

					case "front":
						side.style.height = height/numberOfPrisms+"px";
						side.style.backgroundImage  = "url('" + currentImage + "')";
						side.style.backgroundPosition = "0 -" + (height/numberOfPrisms)*(prismOrder[i]-1) + "px";
						transform = "rotate3d(0,1,0,0) translate3d(0,0,"+width/2+"px)";
						break;

					case "back":
						side.style.height = height/numberOfPrisms+"px";
						transform = "rotate3d(1,0,0,180deg) translate3d(0,0,"+width/2+"px)";
						break;

					case "left":
						side.style.height = height/numberOfPrisms+"px";
						side.style.backgroundImage = "url('" + nextImage + "')";
						side.style.backgroundPosition = "0 -" + (height/numberOfPrisms)*(prismOrder[i]-1) + "px";
						transform = "rotate3d(0,1,0,-90deg) translate3d(0,0,"+width/2+"px)";
						break;

					case "right":
						side.style.height = height/numberOfPrisms+"px";
						transform = "rotate3d(0,1,0,90deg) translate3d(0,0,"+width/2+"px)";
						break;

					case "top":
						side.style.height = width+"px";
						side.style.backgroundColor = sideColor;
						transform = "rotate3d(1,0,0,90deg) translate3d(0,0,"+width/2+"px)";
						break;

					case "bottom":
						side.style.height = width+"px";
						side.style.backgroundColor = sideColor;
						transform = "rotate3d(1,0,0,-90deg) translate3d(0,0,"+(-width/2+height/numberOfPrisms)+"px)";
						break;

				}

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
		horizontalPrisms.call(this);

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

}

Slider.prototype.transitions.horizontal = new HorizontalTransition();