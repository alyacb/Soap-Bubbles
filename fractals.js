/*
 This is a fractal-graphing set of functions
	@ Alya Carina B.
*/

/* 
 graphs the fractal on the given canvas using the number of iterations specified, 
   and within the range of values specified
*/
function graph(canvas, max_iter, rxmin, rxmax, rymin, rymax){
	var context = canvas.getContext("2d");

	var threshold = 4;

	var xdiff = canvas.width;
	var ydiff = canvas.height;

	var rangex = rxmax - rxmin;
	var rangey = rymax - rymin;

	var xf = rangex/xdiff;
	var yf = rangey/ydiff;

	var xd = Math.round(xdiff/40);
	var yd = Math.round(ydiff/20);

	var xc = rxmax;
	var yc = rymax;

	var colors = palette(max_iter);

	var xcurr = 0;
	var x = xcurr;
	var ycurr = 0;
	var y = ycurr;
	var timer = setInterval(function() {
		if(xcurr>=xdiff && ycurr>=ydiff){
			clearInterval(timer);
			return;
		}
 
		if(xcurr>=xdiff){
			xcurr = 0;
			ycurr += yd;
		}

		context.clearRect(xcurr, ycurr, xd, yd);
		for(x = xcurr; x<xcurr+xd; x+=0.5){
			for(y = ycurr; y<ycurr+yd; y+=0.5){
				var xac = xf*x-xc; // [-2.5, 1]
				var yac = yf*y-yc; // [-1, 1]

				var c = {"real": xac, "imaginary": yac};
				var count = 0;
				var z = {"imaginary": 0, "real": 0};
				while(magnitude2(z) < threshold && count < max_iter){
					z = eval(z, c);
					count++;
				}	

				context.fillStyle = colors[count];
				context.fillRect(x, y, 0.5, 0.5);
			}
		}
		xcurr += xd;	
	}, 1);

	return timer;
}

// Evaluates the equation using the given variable and constant values
function eval(variable, constant){
	var z = {"imaginary": Math.abs(variable["imaginary"]), "real": Math.abs(variable["real"])};
	var mult = multiply(z, z);
	return add(constant, mult);	
}

// Colors

// generates a color palette
function palette(max_iter){
	var colorf = 256*256*256/max_iter;
        var colors = new Array(max_iter+1);

        for(var i=0; i<max_iter; i++){
                var str = ("000000" + (i*colorf).toString(16));
                colors[i] = "#" + str.substring(str.length - 7, str.length - 1);
        }
        colors[max_iter] = "#000000";

	return colors;
}


// Complex number operands

// returns the sum of two complex numbers
function add(complex1, complex2){
	return {"imaginary": complex1["imaginary"] + complex2["imaginary"],
		"real": complex1["real"] + complex2["real"]};
}
// returns the product of two complex numbers
function multiply(complex1, complex2){
	return {"imaginary": complex1["real"]*complex2["imaginary"] + complex1["imaginary"]*complex2["real"],
		"real": complex1["real"]*complex2["real"] - complex1["imaginary"]*complex2["imaginary"]};
}

// returns the square of the magnitude of two complex numbers
function magnitude2(complex){
	return complex["imaginary"]*complex["imaginary"] + complex["real"]*complex["real"];
}

// returns the sin of a complex number
function sin(complex){
        return {"imaginary": Math.cos(complex["real"])*Math.sinh(complex["imaginary"]), 
		"real": Math.sin(complex["real"])*Math.cosh(complex["imaginary"])};
}
