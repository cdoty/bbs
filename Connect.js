// Local objects
var utilities	= require('./Utilities')

exports.enter	= enter;

function enter(_socket, _nextFunction)
{
	utilities.displayFile(_socket, __dirname + "/Screens/" + screens.getScreen("connect"), _nextFunction);
}
