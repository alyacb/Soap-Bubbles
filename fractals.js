/**
 * @file fractals.js - a library of Javascript functions for graphing fractals
 * @author Alya C. B.
 * @version 1.0
 */

/**
 * {Complex} is the complex number type, represented by a JS object for the form {"imaginary": <value>; "real": <value>}
 *  both values are of the type {Number}
 * {Color} is the {String} hexadecimal representation of a color, of the form #RRGGBB
 *  where RR, GG, and BB are two-digit hexadecimal numbers from 0 to 255 (00 to FF)
 */

/** 
 * graphs the Mandelbrot Set fractal on the given canvas 
 *  using the number of iterations specified, 
 *  and within the range of values specified
 * @requires - positive {Integer} values, rxmin < rxmax, and rymin < rymax
 * @param {DOMElement} canvas - canvas element on which to graph fractal
 * @param {Integer} max_iter - maximum number of iterations used for approximate the limit at every point
 * @param {Integer} rxmin - scaled minimum ordinate
 * @param {Integer} rxmax - scaled maximum ordinate
 * @param {Integer} rymin - scaled minimum abcissa
 * @param {Integer} rymax - scaled maximum abcissa
 * @param {DOMElement} informer - element with a value field used for updating status of graph (for 'loading' prompt)
 * @return {Integer} - returns int id of timer used to pace fractal loading
 */
function graph(canvas, max_iter, rxmin, rxmax, rymin, rymax, informer){
	var context = canvas.getContext("2d");

	// Mandelbrot radius
	var threshold = 4;

	var xdiff = canvas.width;
	var ydiff = canvas.height;
	var rangex = rxmax - rxmin;
	var rangey = rymax - rymin;

	// constant values
	var xf = rangex/xdiff;
	var yf = rangey/ydiff;
	var xd = Math.round(xdiff/40); // width of rectangle subdivision
	var yd = Math.round(ydiff/20); // height of rectangle subdivision
	var xc = rxmax;
	var yc = rymax;
	var ptw = 1; // point-square width
	var l2 = Math.log(2);

	// set up color palette
	var colors = palette(max_iter);

	// initial variable values
	var x = xcurr = 0;
	var y = ycurr = 0;

	// Draws the next subdivision of the canvas
	//  every millisecond, until entire canvas is drawn
	//  or, until graph is called again.
	var timer = setInterval(function() {
		// if exceeds bounds of canvas, stop graphing
		if(xcurr>=xdiff && ycurr>=ydiff){
			informer.value = "hide";
			return;
		}
 
		// if x-coordinate is too large, start a new row
		if(xcurr>=xdiff){
			xcurr = 0;
			ycurr += yd;
		}

		// clear box, then draw over it
		context.clearRect(xcurr, ycurr, xd, yd);

		// loop over all coordinates inside subdivision of canvas
		for(x = xcurr; x<xcurr+xd; x+=ptw){
			for(y = ycurr; y<ycurr+yd; y+=ptw){
				// convert from canvas coordinates to fractal coordinates
				var xac = xf*x-xc;
				var yac = yf*y-yc;

				var c = {"real": xac, "imaginary": yac};
				var count = 0; // iteration count
				var z = {"imaginary": 0, "real": 0};
				var m = 0; // magnitude of z
				// check if P(z) at c diverges to infinity, or is in Mandelbrot set
				while(m < threshold && count < max_iter){
					z = eval(z, c);
					count++;
					m = magnitude2(z);
				}	

				// color point based on the value of count when the prior loop exits
				var color = colors[count];
				if(count < max_iter - 1){ // smooth coloring
					var log_zn = Math.log(m)/2;
    					var nu = Math.log(log_zn/l2)/l2;
					var it = count + 1 - nu;
					color = colors[Math.floor(it)];
					var color2 = colors[Math.floor(it)+1];
					color = linear_interpolate(color, color2, it%1);
				}

				context.fillStyle = color;
				context.fillRect(x, y, ptw, ptw);
			}
		}

		xcurr += xd;	

	}, 1);

	return timer;
}

/**
 * Evaluates the complex equation P(z) = z^2 + c (Mandelbrot Set)
 * 
 * @param {Complex} variable - the value of the complex variable z
 * @param {Complex} constant - the value of the complex constant c (representing the coordinates of the point being iterated over)
 * @return {Complex} - the evaluated complex number P(z)
 */
function eval(variable, constant){
	// var z = {"imaginary": Math.abs(variable["imaginary"]), "real": Math.abs(variable["real"])}; // burning ship fractal
	var mult = multiply(variable, variable);
	return add(constant, mult);	
}

// Coloring Methods

/**
 * Linear interpolates an intermediate color between the given ones, using given slope
 * @param {Color} color1 - first color
 * @param {Color} color2 - second color
 * @param {Number} slope - value of slope for linterpolation
 * @return {Color} - value of intermediate color
 */
function linear_interpolate(color1, color2, slope){
	var r1 = parseInt(color1.substring(1,3), 16);
	var r2 = parseInt(color2.substring(1,3), 16);
	var r = Math.floor(Math.abs(r1 + slope*(r2 - r1))).toString(16);
	r = (r.length == 2) ? r : "0" + r;
	
	var g1 = parseInt(color1.substring(3,5), 16);
	var g2 = parseInt(color2.substring(3,5), 16);
	var g = Math.floor(Math.abs(g1 + slope*(g2 - g1))).toString(16);
	g = (g.length == 2) ? g : "0" + g;

	var b1 = parseInt(color1.substring(5,7), 16);
	var b2 = parseInt(color2.substring(5,7), 16);
	var b = Math.floor(Math.abs(b1 + slope*(b2 - b1))).toString(16);
	b = (b.length == 2) ? b : "0" + b;

	var c = "#" + r + g + b;
	return c;
}

/**
 * Generates a smooth palette of colors based on the iteration-count, last color is always black
 * @requires - max_iter > 0
 * @param {Integer} max_iter - maximum number of iterations to be evaluated
 * @return {Color[]} - returns an array of {Color} of size max_iter + 1
 */
function palette(max_iter){
	var end_color = '#773399';
	var mid_color = '#CCAA66';
        var colors = new Array(max_iter+1);

	var factor = Math.PI/(2*Math.max(1, max_iter-1));
        for(var i=0; i<max_iter; i++){
		colors[i] = linear_interpolate(end_color, mid_color, Math.sin(i*factor));
		console.log(colors[i]);
        }
        colors[max_iter] = "#000000";

	return colors;
}

// Complex number operands

/**
 * Adds two complex numbers
 * @param {Complex} complex1
 * @param {Complex} complex2
 * @return {Complex} - complex sum of complex1 and complex2
 */
function add(complex1, complex2){
	return {"imaginary": complex1["imaginary"] + complex2["imaginary"],
		"real": complex1["real"] + complex2["real"]};
}

/**
 * Multiplies two complex numbers
 * @param {Complex} complex1
 * @param {Complex} complex2
 * @return {Complex} - complex product of complex1 and complex2
 */
function multiply(complex1, complex2){
	return {"imaginary": complex1["real"]*complex2["imaginary"] + complex1["imaginary"]*complex2["real"],
		"real": complex1["real"]*complex2["real"] - complex1["imaginary"]*complex2["imaginary"]};
}

/**
 * Finds square of magnitude of a complex number
 * @param {Complex} complex
 * @return {Complex} - magnitude of complex squared
 */
function magnitude2(complex){
	return complex["imaginary"]*complex["imaginary"] + complex["real"]*complex["real"];
}

