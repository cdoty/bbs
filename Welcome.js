var utilities	= require('./Utilities')

exports.enter	= enter;

function enter(_socket, _nextFunction)
{
	utilities.displayBlankLine(_socket);
	utilities.displayFile(_socket, __dirname + "/Screens/" + screens.getScreen("welcome"), _nextFunction);
}
