module.exports = {
	// If val isnot existing, then 1 value returns
	// If Val is not a numbeer or negative, then returns 2
	// Othervise 0 is returned
    checkCorrectIntVal : function(val, undefinedCallback, incorrectCallback){
		if (typeof(val) == 'undefined') {
			undefinedCallback();
			return 1;
		}
	
		val = Number(parseInt(val));
		if ((isNaN(val) || val < 0)) {
			incorrectCallback();
			return 2;
		}
		
		return 0;
    }
}