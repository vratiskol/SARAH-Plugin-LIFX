// ------------------------------------------
//  COLOR ALGORITHM
// ------------------------------------------

var DEFAULT_KELVIN = 3500

// Saturation => 0..1
// Brightness => 0..1
// Hue => 0..360
// red: 0
// orange: 36
// yellow: 60
// green: 120
// cyan: 195
// blue: 250
// purple: 280
// pink: 325

// UINT16_MAX = 65535
// KELVIN_MIN = 2500
// KELVIN_MAX = 10000
	  
color = {
}

color.hexStringToRgb = function (s) {
    return {
        r: parseInt(s.substring(0, 2), 16) / 255,
        g: parseInt(s.substring(2, 4), 16) / 255,
        b: parseInt(s.substring(4, 6), 16) / 255
    };
}


color.hslkToHex = function (h,l,s,k) {

	var hue = Math.round(h * 65535);
	var sat = Math.round(l * 65535);
	var lum = Math.round(s * 65535);
	var kel = k;
	lum = Math.round(lum / 360 * 65535);
		
	hue = '0x'+hue.toString(16);
	sat = '0x'+sat.toString(16);
	lum = '0x'+lum.toString(16);
	kel = '0x'+kel.toString(16);
	
	console.log("hue:"+hue+" sat:"+sat+" lum:"+lum+" kel:"+kel);
	
	return { h: hue, s: sat, l: lum, k: kel };
 
} 
 
color.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

color.rgbToHex = function (r, g, b) {
    return "#" + color.componentToHex(r) + color.componentToHex(g) + color.componentToHex(b);
}

// Conversion : RGB => HSL
color.rgbToHsl = function(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0; // achromatic
  } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  
  result = color.hslkToHex(h,s,l,DEFAULT_KELVIN); 
	return {h: result.h, s: result.s, l: result.l, k: result.k };
}

// Conversion : RGB => HSV
color.rgbToHsv = function rgbToHsv(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b)
  var  min = Math.min(r, g, b);
    
  h = s = v = max;
  var d = max - min;
  s = (max = 0 ? 0 : d / max); 
  
  if(max == min){
      h = 0; // achromatic
  } else {
       
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
     h = h * 60;
  }
	result = color.hslkToHex(h,s,v,DEFAULT_KELVIN); 
	return {h: result.h, s: result.s, v: result.v, k: result.k };
}

// Conversion : HSL => RGB
color.HslTorgb = function (h, s, v){
	var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
	h = h /100 /360;
	v = v /100 /360;
	s = s /100 /360;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}


// HSL to HSB Conversion
color.HslToHsb = function(h, s, l) {
	var hue = h;
	var lum = l * 2;
	var sat = s;
	sat =  (lum <= 1) ? lum : 2 - lum;
	var bri = (1 + sat) /2;
	sat = (2 * sat) / (1 + sat);
	return {h: hue, s: sat, b: bri, k: DEFAULT_KELVIN}
}

/* Helper to create a white Color
brightness: [Float] Valid range: `0..1`
kelvin: [Integer] Valid range: `2500..10000`
@return [hue, saturation, brightness, kelvin] */
color.white = function () {
	return {h: 0, s:0, l:65535, k:DEFAULT_KELVIN}
}

// Function Random Color
color.random_color = function() {
	var h = Math.random();
	var s = Math.random();
	var l = Math.random() / 360;
	
	// console.log("h => "+h+" s => "+s+" l => "+l);
	result = color.hslkToHex(h,s,l,DEFAULT_KELVIN); 
	return {h: result.h, s: result.s, l: result.l, k: result.k };
		
}
	
module.exports = color;