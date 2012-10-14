//////////////////////////////////////////////////////////////////////////
// LoudnessMeter - Server Side
//////////////////////////////////////////////////////////////////////////
//
// Recieves and processes data for the loudness meter
/* ----------------------------------------------------------------------
													Object Structures
-------------------------------------------------------------------------
	
*/
//////////////////////////////////////////////////////////////////////////
// Node.js Exports
var globalNamespace = {};
(function (exports) {
	exports.createNewLoudnessMeter = function( socket ) {
		newLoudnessMeter= new LoudnessMeter( socket );
		return newLoudnessMeter;
	};
}(typeof exports === 'object' && exports || globalNamespace));


//////////////////////////////////////////////////////////////////////////
// Namespace (lol)
var log = function( a ) { console.log(a); };
var exists = function(a) { return typeof(a) == "undefined" ? false : true; };	// Check whether a variable exists
var dflt = function(a, b) { 													// Default a to b if a is undefined
	if( typeof(a) === "undefined" ){ 
		return b; 
	} else return a; 
};


//////////////////////////////////////////////////////////////////////////
// Constructor
function LoudnessMeter( socket ) {
	var self = this;

	this.socket = socket;
	this.tempSum = 0;
	this.queuedLoudnessValues = [];
	
	// We're going to check for new queued loudness values and send them out
	setInterval( function() {	
		if( self.queuedLoudnessValues.length > 0 ) {
			for( var iValue=0; iValue<self.queuedLoudnessValues.length; ++iValue ) {
				self.socket.emit( "newLoudnessData", {loudness: self.queuedLoudnessValues[iValue]} );
			} // end for each buffer
		
			// Clear the buffer queue
			self.queuedLoudnessValues.length = 0;
		}
	}, 10 );
} // end LoudnessMeter();


//////////////////////////////////////////////////////////////////////////
// Returns the width of the canvas
LoudnessMeter.prototype.processLoudness = function( audioBuffer, numSamples ) {
	// Calculate average loudness in this buffer	
	this.tempSum = 0;
	
	for( var iSample = 0; iSample < numSamples; ++iSample ) {
		this.tempSum += Math.abs( audioBuffer[0][iSample] );
		//console.log( audioBuffer[0][iSample] );
	}
	
	var averageLoudness = this.tempSum / numSamples;
	//console.log( this.tempSum );
	//console.log( numSamples );
	
	this.queuedLoudnessValues.push( averageLoudness );

} // end LoudnessMeter.getWidth()