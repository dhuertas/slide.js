slide.js
========

Simple, cross-browser image slider using CSS3 transitions and Javascript.

![alt tag](https://dl.dropboxusercontent.com/u/1690746/images/slider-example.png)

**Example**

Download and include the javascript file in your html document.

```
<script type="text/javascript" src="src/slider.js"></script>
```

Also add the desired transition files (note: more to be added).

```
<script type="text/javascript" src="src/transitions/vertical.js"></script>
<script type="text/javascript" src="src/transitions/horizontal.js"></script>
```

Setup an array containing the names of the images, like so:

```
var myCollection = ["first-image.png", "second-image.png", "third-image.png"];
```

Setup the options object for the slider:

```
var myOptions = {
	containerId : "slider-id", 
	width 		: 960, 
	height 		: 370, 
	transition 	: 5000,
	interval	: 5000,
	path		: "path/to/collection/images/"
};
```

Finally, create the slider object and initialize it:

```
var mySlider = new Slider();

mySlider
	.init(myOptions)
	.setCollection(myCollection);

mySlider.run();
```

For more detailed information browse the code. Have fun!
