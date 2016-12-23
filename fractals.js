/*
 This is a fractal-graphing set of functions
	@ Alya Carina B.
*/

/* 
 graphs the fractal on the given canvas using the number of iterations specified, 
   and within the range of values specified
*/
function graph(canvas, max_iter, rxmin, rxmax, rymin, rymax, informer){
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
	var l2 = Math.log(2);
	var timer = setInterval(function() {
		if(xcurr>=xdiff && ycurr>=ydiff){
			informer.value = "hide";
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
				var m = 0;
				while(m < threshold && count < max_iter){
					z = eval(z, c);
					count++;
					m = magnitude2(z);
				}	

				var color = colors[count];
				/*if(count < max_iter-1){
					var color2 = colors[count + 1];
					var log_zn = Math.log(m)/2;
    					var nu = Math.log(log_zn/l2)/l2;
					color = linear_interpolate(color, color2, 1-nu);
				}*/

				context.fillStyle = color;
				context.fillRect(x, y, 0.5, 0.5);
			}
		}
		xcurr += xd;	
	}, 1);

	return timer;
}

// Evaluates the equation using the given variable and constant values
function eval(variable, constant){
	var z = //{"imaginary": Math.abs(variable["imaginary"]), "real": Math.abs(variable["real"])};
		variable;
	var mult = multiply(z, z);
	return add(constant, mult);	
}

// Colors

// converts an integer to a hex color (assumes range of number is 0 to 256^3)
function int_to_hex(num){
	var color = ("000000" + (num).toString(16));
        return "#" + color.substring(color.length - 6, color.length);
}

// converts a hex color to an int
function hex_to_int(color){
	return parseInt(color.substring(1, 7), 16);
}

// interpolates an intermediate color between two colors given
function linear_interpolate(color1, color2, slope){
	var num1 = hex_to_int(color1);
	var num2 = hex_to_int(color2);
	var num = Math.abs(num1 + slope*(num2-num1));
	return int_to_hex(Math.floor(num));
}

// generates a color palette
function palette(max_iter){
	var colorf = hex_to_int('#3300AA');
        var colors = new Array(max_iter+1);

	var r = //Math.random()*256;
		255;
        for(var i=0; i<max_iter; i++){
                colors[i] = int_to_hex(colorf);
		colorf += r*i;
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
