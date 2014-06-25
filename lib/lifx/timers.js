
/* an interval is a timer that repeats periodically.
The respective functions for creating and canceling an interval are setInterval() and clearInterval().
Like setTimeout(), setInterval() accepts a callback function, a delay, and optional callback arguments. 
It also returns an interval identifier that can be passed to clearInterval() in order to cancel the interval.
Listing 4-21 demonstrates how intervals are created and canceled using setInterval() and clearInterval(). */

timer = {
}


timer.createTime = function (s) {
	var intervalId = setInterval(function() { s }, 1000); 
	return { intervalId };
}


timer.ClearTimer = function (s) {
	var IntervalId = s;
	clearInterval(intervalId)
}

module.exports = color;