var BitString = require('bitstring');

var type = {
	uint8: {
		size: 1,
		parse: function(b, start) {
			return b.readUInt8(start);
		},
		unparse: function(b, start, p) {
			return b.writeUInt8(p, start);
		}
	},
	uint16: {
		size: 2,
		parse: function(b, start) {
			return b.readUInt16BE(start);
		},
		unparse: function(b, start, p) {
			return b.writeUInt16BE(p, start);
		}
	},
	uint16_le: {
		size: 2,
		parse: function(b, start) {
			return b.readUInt16LE(start);
		},
		unparse: function(b, start, p) {
			return b.writeUInt16LE(p, start);
		}
	},
	uint32: {
		size: 4,
		parse: function(b, start) {
			return b.readUInt32BE(start);
		},
		unparse: function(b, start, p) {
			return b.writeUInt32BE(p, start);
		}
	},
	uint32_le: {
		size: 4,
		parse: function(b, start) {
			return b.readUInt32LE(start);
		},
		unparse: function(b, start, p) {
			return b.writeUInt32LE(p, start);
		}
	},
	uint64: {
		size: 8,
		parse: function(b, start) {
			var size = 8;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 8);
		}
	},
	uint64_le: { // TBD
		size: 8,
		parse: function(b, start) {
			var size = 8;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 8);
		}
	},
	float_le: {
		size: 4,
		parse: function(b, start) {
			var size = 4;
			return b.readFloatLE(start);
		},
		unparse: function(b, start, p) {
			return b.writeFloatLE(p, start);
		}
	},
	byte2: {
		size: 2,
		parse: function(b, start) {
			var size = 2;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 2);
		}
	},
	string3: {
		size: 3,
		parse: function(b, start) {
			var size = 3;
			return b.slice(start, start+size).toString().replace(/\0*$/, '');
		},
		unparse: function(b, start, p) {
			var b2 = new Buffer(p);
			return b2.copy(b, start, 0, 3);
		}
	},
	string3_le: {
		size: 3,
		parse: function(b, start) {
			var size = 3;
			var be = b.slice(start, start+size).toString().replace(/\0*$/, '');
			var le = be.split("").reverse().join(""); // reverse the string
			return le;
		},
		unparse: function(b, start, p) {
			var b2 = new Buffer(p);
			return b2.copy(b, start, 0, 3);
		}
	},
	bool_bit1: {
		size: 1,
		parse: function(b, start) {
			var size = 1;
			var bit = b.slice(start, start+size).readbits(size)
			return bit;
		},
		unparse: function(b, start, p) {
		
		
		p.writebits(
			return p.copy(b, start, 0, size);
			// buffer.copy(target, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
		
		}
	},
	bit2_le: {
		size: 1/4,
		parse: function(b, start) {
			var size = 1/4;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 1/4);
		}
	},
	bit12_le: {
		size: 1.5,
		parse: function(b, start) {
			var size = 1.5;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 1.5);
		}
	},
	byte4: {
		size: 4,
		parse: function(b, start) {
			var size = 4;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 4);
		}
	},
	byte6: {
		size: 6,
		parse: function(b, start) {
			var size = 6;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 6);
		}
	},
	byte16: {
		size: 16,
		parse: function(b, start) {
			var size = 16;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 16);
		}
	},
	byte32: {
		size: 32,
		parse: function(b, start) {
			var size = 32;
			return b.slice(start, start+size);
		},
		unparse: function(b, start, p) {
			return p.copy(b, start, 0, 32);
		}
	},
	string32: {
		size: 32,
		parse: function(b, start) {
			var size = 32;
			return b.slice(start, start+size).toString().replace(/\0*$/, '');
		},
		unparse: function(b, start, p) {
			var b2 = new Buffer(p);
			return b2.copy(b, start, 0, 32);
		}
	}
};

module.exports = type;