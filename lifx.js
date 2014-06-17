// ------------------------------------------
//  SETUP
// ------------------------------------------

var lx = false;

exports.init = function(SARAH){
  
  if (lx) return;
   
  var lifx = require('./lib');
  var color = require('./lib/color');

  lifx.setDebug(false);
  
  lx = lifx.init();
  
  lx.on('bulbstate', function(b) {});
  
  lx.on('bulbonoff', function(b) {});
  
  lx.on('bulb', function(b) {
    console.log('New bulb found : ' + b.name);
  });
  
  lx.on('gateway', function(g) {
    console.log('New gateway found: ' + g.ipAddress.ip);
  });

  lx.on('packet', function(p) {
    // Show informational packets
    switch (p.packetTypeShortName) {
      case 'powerState':
      case 'wifiInfo':
	  case 'wifiFirmwareState':
      case 'wifiState':
      case 'accessPoint':
      case 'bulbLabel':
      case 'tags':
	  case 'tagLabels':
      //case 'lightStatus':
      case 'timeState':
      case 'resetSwitchState':
      case 'meshInfo':
      case 'meshFirmware':
      case 'versionState':
      case 'infoState':
      case 'mcuRailVoltage':
	  case 'stateambientlight':
        console.log(p.packetTypeName + " - " + lx.getBulbByLifxAddress(p.preamble.bulbAddress).toString() + " (" + p.preamble.bulbAddress.toString('hex') + ")");
		console.log(util.inspect(p.payload));
        break;
    }
  });
}


// ------------------------------------------
//  INTERFACE
// ------------------------------------------

var util = require('util');
var packet = require('./lib/packet');
var cycledColour = 0;
exports.action = function(data, callback, config, SARAH){
  
  var config = config.modules.lifx;
  if (false){
    return callback('tts', 'Configuration LIFX invalide');
  }

// Switch On / Off 
// All Bulbs
if (typeof data.bulbname ==  "") {
	if (data.on == "true" ){
		console.log("All Lights on");
		lx.lightsOn(); 
	} else if (data.on == "false"){ 
		console.log("All Lights off");
		lx.lightsOff();  
	};
}
else if (data.bulbname) {	
// One Bulb
	var bulb = lx.getBulbidByName(data.bulbname);
	if (bulb != false) {
		if (data.on == "true" && bulb){
			lx.lightsOn(bulb);
			console.log("Light on: "+data.bulbname);
		} else if (data.on == "false" && bulb){
			lx.lightsOff(bulb);
			console.log("Light off: "+data.bulbname);
		}
	}
		
};


// Dim du bulb en absolute (duration en option)
if (data.dim && data.brightness && data.bulbname) {
	var bulb = lx.getBulbidByName(data.bulbname);
	if (bulb != false) {
		var lum = data.brightness;
		
		
		//var buf = new Buffer(4);
		//lum=buf.writeUInt32LE(lum, 0);
		//lum=buf.toString();
				
		if (data.timing) {
			var timing = data.timing * 1000;
			timing = '0x'+timing.toString(16);
			console.log('Hex Timing '+timing);
		} else {
			var timing = 0;
		}
		
		if (data.dim =="absolute") {
			lum = Math.round(lum * 1.27);
			lum_bin = lum.toString(2);
			lum_bin_pad = lum << 8;
			console.log(lum_bin_pad.toString(2));
			lum_hex = "0x"+lum_bin_pad.toString(16);
			console.log("Absolute");
			lx.DimAbsolute(lum_hex,0,bulb);
		} else if (data.dim =="relative") {
			console.log("Relative");
			lx.DimRelative(lum,0,bulb);
		}
	}
}
 
// Dim Color: hue, sat, lum, whitecol, timing, (bulb)
// Timing => optionnal 
  
if (data.rgb && data.bulbname) {
 	var bulb = lx.getBulbidByName(data.bulbname);
	if (bulb != false) {
		
		console.log("Bulb :" +data.bulbname+ " - Dim "+data.rgb+ " - Timing : "+data.timing+" s" );
		
		if (data.rgb == "random") {
			var hsl= color.random_color();
		} else if  (data.rgb == "white" || data.rgb == "blanc") {
			var hsl= color.white()
		} else {
			var rgb = color.hexStringToRgb(data.rgb);
			var hsl = color.rgbToHsl(rgb.r, rgb.g, rgb.b);
		}
		// console.log(rgb,' => ',hsl);
    		
		if (data.timing) {
		// 2147483647 ms max / 2147483 sec / 35791 min / 596 heures / 24 jours max
		// 2147,483647 sec / 
		//  7FFFFFFF /
		//0x5f5e100
			var timing = data.timing * 1000;
			timing = '0x'+timing.toString(16);
			console.log('Hex Timing '+timing);
		} else {
			var timing = 0;
		}
		lx.lightsColour(hsl.h, hsl.s, hsl.l, hsl.k, timing, bulb);
	}
};



 
// Get Bulb Status (on/off)
  if (data.getstatus && data.bulbname) {
	var bulb = lx.getBulbidByName(data.bulbname);
	if (bulb != false) {
		var powerstatus = lx.GetBulbPowerStatus(bulb);
	
		if (typeof powerstatus != 'undefined') {
			console.log("La lampe "+data.bulbname+" est "+powerstatus);
		}
	}
  };
  
  
// Get Color of a bulb (rgb and hex format)
  if (data.getcolor && data.bulbname) {
	var bulb = lx.getBulbidByName(data.bulbname);
	if (bulb != false) {	
		var color_hsl = lx.GetBulbColor(bulb);
		// Couleur au format hsl en radian
		//console.log("hsl("+color[0]/360+"%,"+color[1]/360+"%,"+color[2]/360+"%)");
	
		//hsl(0%,0%,47.63055555555555%)
		//{ r: 121, g: 121, b: 121 }
		var color_rgb = color.HslTorgb(color_hsl[0],color_hsl[1],color_hsl[2]);
		console.log('Lum:'+color_hsl[2]);
		if (typeof color_rgb != 'undefined') {
			var color_rgb_hex = color.rgbToHex(color_rgb.r,color_rgb.g,color_rgb.b);
			console.log(color_rgb);
			console.log(color_rgb_hex);
		}
	}
}
 
if (data.ambientlight && data.bulbmane) {
	var bulb = lx.getBulbidByName(data.bulbname);
	if (bulb != false) {
		lx.getCurrentAmbientLight(bulb)
	};
};

 
  // Gestion des Tags
  
 if (data.tags) {
	lx.getTags()
 };
 
  if (data.tagslabel) {
	lx.getTagLabels()
 };
  
  // Reboot bulb
    if (data.reboot == "true" && data.bulbname) {
	lx.RebootBulb(lx.getBulbidByName(data.bulbname));
	console("LIFX - Reboot du bulb "+data.bulbname);
  };
  
    // Bulb Technical Info
    if (data.meshinfo && data.bulbname) {
	var mesh = lx.BulbTechInfo(lx.getBulbidByName(data.bulbname));
  };
  
    // Bulb FW Version
    if (data.fw_version && data.bulbname) {
		var fw = lx.MeshFirmware(lx.getBulbidByName(data.bulbname));
	};
 
	if (data.voltage && data.bulbname) {
		var voltage = lx.getVoltage(lx.getBulbidByName(data.bulbname));
	};
  

	
	
  
  
  return callback({}); 
  
 
}
