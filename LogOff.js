// Local objects
var utilities	= require('./Utilities')

exports.enter	= enter;

// Confirms logoff, if 'n' is selected, _noFunction is called.
function enter(_socket, _noFunction)
{
	utilities.displayBlankLine(_socket);
	utilities.displayFile(_socket, __dirname + "/Screens/" + screens.getScreen("logOff"), handleLogOff);

	function handleLogOff()
	{
		utilities.displayBlankLine(_socket);
		utilities.promptYorN(_socket, "logOffPrompt", yesFunction, _noFunction);
	}

	function yesFunction()
	{
		utilities.displayBlankLine(_socket);
		utilities.displayString(_socket, "goodByeMessage");
	    
		utilities.disconnect(_socket);
	}
}
