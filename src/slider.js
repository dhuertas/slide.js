/*
 * Image slider using CSS3 transitions and javascript
 *
 * @author dhuertas
 * @email huertas.dani@gmail.com
 */

var vendorPrefix = ["Webkit", "Moz", "O", "Ms", "Khtml", ""];

var prefixCSSTranslate = { 
	'Webkit':'-webkit-', 
	'Moz':'-moz-',
	'O':'-o-', 
	'Ms':'-ms-',
	'Khtml':'-khtml-'
};

/*
 * How do I normalize CSS3 Transition functions across browsers
 * http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers
 */
function whichAnimationEvent() {

	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'animation':'animationend',
		'OAnimation':'oAnimationEnd',
		'MozAnimation':'animationend',
		'WebkitAnimation':'webkitAnimationEnd'
	}

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}

}

function whichTransformEvent() {

	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'transition':'transitionend',
		'OTransition':'oTransitionEnd',
		'MozTransition':'transitionend',
		'WebkitTransition':'webkitTransitionEnd'
	}

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}

}

function styleMe(elem, key, value) {

	var prefixExist = false;

	for (var i = 0; i < vendorPrefix.length; i++) {

		if (typeof elem.style[vendorPrefix[i] + key] != 'undefined') {
			elem.style[vendorPrefix[i] + key] = value;
			prefixExist = true;
		}

	}

	if ( ! prefixExist) {
		var opKey = key.charAt(0).toLowerCase() + key.slice(1);
		if (typeof elem.style[opKey] != "undefined") {
			elem.style[opKey] = value;
		} else {
			elem.style[key] = value;
		}
	}
}

var Slider = function() {

	// Version of the slider
	this.version = "0.0.2";

	// Default settings, used to set the options Object upon initialization
	this.defaults = {
		containerId		: "slider",
		width			: 960,		// in px
		height			: 370,		// in px
		duration		: 10000,	// in ms
		transition 		: 4000,		// in ms
		path 			: "images",	// Path to the images
		useProgressBar 	: true,		// whether to use a progress bar or not
		useShadow		: true,
		shadowMargin	: 10
	};

	// The slider options
	this.options 			= {};

	// The array that contains the filenames of the images that are going 
	// to be displayed in the slider
	this.collection 		= [];

	// Index for the collection image
	this.currentImage 		= 0;

	// Index for the transition function
	this.currentTransition	= 0;
	this.transitionNames	= [];

	// The element that holds alltogether
	this.container 			= null;

	// DOM element that contains the transition elements
	this.backstage			= null;

	// DOM element where the image is loaded between transitions
	this.stage				= null;

	// The progress bar elements
	this.progressBar		= null;
	this.progressBarFill	= null;
	this.progressBarStyle	= null;

	// Slide shadow element
	this.shadow				= null;

}

Slider.prototype.transitions = {};

/*
 * Add a picture to the collection at the specified position. If position is 
 * not specified, the image is added at the end.
 *
 * @param {String} name
 * @param {Integer} position
 */
Slider.prototype.addPicture = function(name, position) {

	if (typeof position !== 'undefined') {


		this.collection.splice(position, 0, name);

	} else {

		this.collection.push(name);

	}

}

/*
 * When everything is in place, start the slider.
 */
Slider.prototype.run = function() {

	var scope = this;

	window.addEventListener("load", function(e) {

		// display first image
		scope.setStage();

		scope.progress();

	}, false);

}

/*
 * Perform the transition.
 */
Slider.prototype.rotate = function() {

	var transition = this.transitionNames[this.currentTransition];

	if (typeof this.transitions != 'undefined') {

		this.stage.style.opacity = "0";

		this.currentImage++;
		this.currentImage %= this.collection.length;

		this.setStage();

		// callback to progress function (when transition ends)
		//this.transitions[transition].run.call(this, this.progress);
		this.transitions[transition].run.call(this, this.progress);

	} else {

		// transition fallback
		this.setStage();

		this.currentImage++;
		this.currentImage %= this.collection.length;

		// return to progress function
		this.progress();

	}

}

/*
 * This function handles the things that must be done between transitions.
 *
 * @return {Object} this 
 */
Slider.prototype.progress = function() {

	var scope = this;

	this.currentTransition++;
	this.currentTransition %= this.transitionNames.length;

	var transition = this.transitionNames[this.currentTransition];

	this.stage.style.opacity = "1";

	// Clear backstage
	this.clearBackstage();

	// Prepare the next transition
	this.transitions[transition].init.call(this);

	// If progress bar is enabled
	if (this.options.useProgressBar) {

		// Fill the progress bar ...
		this.fillProgressBar(this.rotate);

	// If progress bar is not enabled
	} else {

		setTimeout(function() {

			scope.rotate();

		}, this.options.duration);

	}

}

/*
 * Initialize the Slider!
 *
 * @param {Object} options
 * @return {Object} this
 */
Slider.prototype.init = function(options) {

	var availableOptions = [];

	for  (var opt in this.defaults) {

		availableOptions.push(opt);
		// Set the default values
		this.options[opt] = this.defaults[opt];

	}

	// Parse options
	if (typeof options !== 'undefined') {

		for (var opt in options) {

			// Add the option only if it exists in the defaults array
			if (availableOptions.indexOf(opt) != -1) {

				this.options[opt] = options[opt];

			}

		}

	}

	if (typeof this.transitions != 'undefined') {

		for (var transition in this.transitions) {

			this.transitionNames.push(transition);

		}

	}

	// Get the container element
	this.container = document.getElementById(this.options.containerId);
	this.container.style.height = this.options.height;
	this.container.style.marginBottom = (this.options.height/10)+this.options.shadowMargin;

	// Preload images
	var preloadCss = "";

	for (var i = 0; i < myCollection.length; i++) {

		var div = document.createElement("div");

		div.setAttribute("id", "preload-" + i);
		preloadCss += "div#preload-" + i + " { background: url('" + this.options.path + 
			myCollection[i] + "') no-repeat -9999px -9999px; }\n";
	
		this.container.appendChild(div);

	}

	var preload = document.createElement("style");

	preload.setAttribute("type", "text/css");
	preload.setAttribute("id", "preload-images");

	preload.textContent = preloadCss;

	document.getElementsByTagName("head")[0].appendChild(preload);

	this.backstage = document.createElement("div");
	this.backstage.setAttribute("id", "backstage");

	this.stage = document.createElement("div");
	this.stage.setAttribute("id", "stage");

	this.bar = document.createElement("div");
	this.bar.setAttribute("id", "progress-bar");

	this.stage.style.width = this.options.width + "px";
	this.stage.style.height = this.options.height + "px";

	this.backstage.style.width = this.options.width + "px";
	this.backstage.style.height = this.options.height + "px";

	this.container.appendChild(this.stage);
	this.container.appendChild(this.backstage);

	if (this.options.useProgressBar) {

		this.initProgressBar();

	}

	if (this.options.useShadow) {

		this.initShadow();

	}

	return this;

}

/*
 * Set the image collection all at once.
 *
 * @param {Array} collection: array containing the filenames of the images
 * @return {Object} this
 */
Slider.prototype.setCollection = function(collection) {

	if (typeof collection !== 'undefined' && collection.length > 0) {

		this.collection = collection;

	}

	return this;

}

/*
 * Set the animations array all at once.
 *
 * @param {Array} animations
 */
Slider.prototype.setTransitions = function(transitions) {

	if (typeof transitions != 'undefined' && transitions.length > 0) {

		for (var i = 0; i < transitions.length; i++) {

			this.transitions.push(transitions[i]);

		}

	}

	return this;

}

/*
 * Set the background image for the stage element
 */
Slider.prototype.setStage = function() {

	this.stage.style.backgroundImage = "url(" + 
		this.options.path + 
		this.collection[this.currentImage] + ")";

}

/*
 * Set the next transition in the backstage
 */
Slider.prototype.clearBackstage = function() {

	while (this.backstage.childNodes.length > 0) {
		this.backstage.removeChild(this.backstage.firstChild);
	}

}

/*
 *
 */
Slider.prototype.initProgressBar = function() {

	var head = document.getElementsByTagName('head')[0];

	this.progressBar = document.createElement("div");
	this.progressBar.setAttribute("id", "progress-bar");

	this.progressBarFill = document.createElement("div");
	this.progressBarFill.setAttribute("id", "progress-bar-fill");

	this.progressBar.appendChild(this.progressBarFill);

	this.container.appendChild(this.progressBar);

	if (document.createStyleSheet) {
		// IE way to create style sheets
		this.progressBarStyle = document.createStyleSheet();
	} else {
		this.progressBarStyle = document.createElement("style");
	}

	this.progressBarStyle.setAttribute("id", "progress-bar-style");

	this.progressBarStyle.textContent =
			"@-webkit-keyframes progress-bar {" +
				" 0% { width: 0px; } 99% { width: " + this.options.width + "px; } 100% { width: 0px; }}\n"+
			"@-moz-keyframes progress-bar {" +
				" 0% { width: 0px; } 99% { width: " + this.options.width + "px; } 100% { width: 0px; }}\n"+
			"@-ms-keyframes progress-bar {" +
				" 0% { width: 0px; } 99% { width: " + this.options.width + "px; } 100% { width: 0px; }}\n"+
			"@-o-keyframes progress-bar {" +
				" 0% { width: 0px; } 99% { width: " + this.options.width + "px; } 100% { width: 0px; }}\n"+
			"@keyframes progress-bar {" +
				" 0% { width: 0px; } 99% { width: " + this.options.width + "px; } 100% { width: 0px; }}\n";

	this.progressBarStyle.textContent += "" +
		"#progress-bar-fill.fill { " +
		"-webkit-animation: progress-bar " + (this.options.duration/1000) + "s; " +
		"-moz-animation: progress-bar " + (this.options.duration/1000) + "s; " +
		"-ms-animation: progress-bar " + (this.options.duration/1000) + "s; " +
		"-o-animation: progress-bar " + (this.options.duration/1000) + "s; " +
		"animation: progress-bar " + (this.options.duration/1000) + "s; " +
		"}";

	this.progressBarStyle.textContent += "" +
		"#progress-bar-fill.empty { " +
		"-webkit-animation: none;" +
		"-moz-animation: none; " +
		"-ms-animation: none; " +
		"-o-animation: none; " +
		"animation: none; " +
		"}";

	this.progressBarStyle.setAttribute("type", "text/css");
	this.progressBarStyle.setAttribute("rel", "stylesheet");

	head.appendChild(this.progressBarStyle);

}

/*
 * Appends a shadow element to the container
 */
Slider.prototype.initShadow = function() {

	if (this.options.useShadow) {

		this.shadow = document.createElement("div");

		this.shadow.setAttribute("id", "shadow");
		this.shadow.style.height = (this.options.height/10) + "px";
		this.shadow.style.width = this.options.width + "px";
		this.shadow.style.marginTop = (this.options.height + 
			this.options.shadowMargin) + "px";

		this.container.appendChild(this.shadow);

	}

}

/*
 * Fills the progress bar. Once it is filled calls the callback function to 
 * launch the transition animation.
 *
 * @param {function} callback
 */
Slider.prototype.fillProgressBar = function(callback) {

	var scope = this;

	var barWidth = parseFloat(this.progressBarFill.style.width, 10) | 0,
		timeStep = 16,
		fillStep = timeStep*this.options.width/this.options.duration;

	var animationEnd = whichAnimationEvent();

	var eventHandler = function() {

		scope.progressBarFill.className = "empty";
		scope.progressBarFill.removeEventListener(animationEnd, eventHandler);

		// Seems that when the event handler is called too fast chrome does not
		// handle the next event properly
		setTimeout(function() { callback.call(scope); }, 10);

	};

	// Only if browser suppors transition
	if (typeof animationEnd != 'undefined') {

		this.progressBarFill.addEventListener(
			animationEnd, eventHandler, false);

		this.progressBarFill.className = "fill";

	} else {

		// Fallback to full Javascript transition
		if (barWidth < this.options.width) {

			this.progressBarFill.style.width = (barWidth + fillStep) + "px";

			setTimeout(function() {

				scope.fillProgressBar(callback);

			}, timeStep);

		} else {

			this.progressBarFill.style.width = "0px";
			callback.call(scope);

		}

	}

}