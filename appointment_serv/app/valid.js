module.exports = {
	// If val isnot existing, then defalt value returns
	// If Val is not a numbeer or negative, then returns null
	// Othervise value is returned
    checkCorrectIntVal : function(val, undefinedCallback, incorrectCallback){
		if (typeof(val) == 'undefined') return undefinedCallback();
		
		val = Number(parseInt(val));
		if ((isNaN(val) || val < 0)) return incorrectCallback();
		
		return;
    }
}