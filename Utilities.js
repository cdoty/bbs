// Local objects
var fs			= require('fs')
var markup		= require('./Markup')
var userManager	= require('./UserManager')

exports.displayFile				= displayFile;
exports.displayString			= displayString;
exports.displayRawString		= displayRawString;
exports.displayUnencodedString	= displayUnencodedString;
exports.displayBlankLine		= displayBlankLine;
exports.getInput				= getInput;
exports.promptInput				= promptInput;
exports.promptInputRawString	= promptInputRawString;
exports.promptPassword			= promptPassword;
exports.promptPasswordRawString	= promptPasswordRawString;
exports.getKey					= getKey;
exports.promptKey				= promptKey;
exports.promptKeyRawString		= promptKeyRawString;
exports.getYorN					= getYorN;
exports.promptYorN				= promptYorN;
exports.promptYorNRawString		= promptYorNRawString;
exports.isEOL					= isEOL;
exports.isYorN					= isYorN;
exports.disconnect				= disconnect;
exports.setColor				= setColor;
exports.setBackgroundColor		= setBackgroundColor;

// Display a file to a socket, and call a complete function when done.
function displayFile(_socket, _file, _completeFunction)
{
	fs.readFile(_file, readComplete);

	// File read complete
	function readComplete(error, data)
	{
		if (error)
		{
			console.log("Unable to read file " + _file);
		}
		
		else
		{
			_socket.write(data);
			_socket.write("\r\n");
		}

		_completeFunction();
	}
}

// Display a line of text from Strings.json, line feed is optional
function displayString(_socket, _strString, _bLineFeed)
{
	displayRawString(_socket, strings.getString(_strString), _bLineFeed);
}

// Display a line of text, line feed is optional
function displayRawString(_socket, _strString, _bLineFeed)
{
	if ('undefined' == typeof(_bLineFeed))
	{
		_bLineFeed	= true;
	}
	
	// Handle markup
	var strString	= markup.handleMarkup(_socket, _strString);

	_socket.write(strString);

	if (true == _bLineFeed)
	{
		_socket.write("\r\n");
	}
}

// Display a line of text, line feed is optional
function displayUnencodedString(_socket, _strString, _bLineFeed)
{
	if ('undefined' == typeof(_bLineFeed))
	{
		_bLineFeed	= true;
	}
	
	_socket.write(_strString);

	if (true == _bLineFeed)
	{
		_socket.write("\r\n");
	}
}

// Display a blank line
function displayBlankLine(_socket)
{
	displayUnencodedString(_socket, "");
}

// Gets a line of input, returns with a complete string when enter is pressed.
function getInput(_socket, _completeFunction, _bPassword)
{
	if ('undefined' == typeof(_bPassword))
	{
		_bPassword	= false;
	}
	
	var strString	= "";
	
	_socket.addListener("data", handleInput);

	function handleInput(_strInput)
	{
		if (true == isEOL(_strInput))
		{
			_socket.removeListener("data", handleInput);
			
			displayBlankLine(_socket);

			_completeFunction(strString);
		}
		
		else if (true == isDelete(_strInput))
		{
			if (strString.length > 0)
			{
				displayUnencodedString(_socket, _strInput, false);
				displayUnencodedString(_socket, " ", false);
				displayUnencodedString(_socket, _strInput, false);
				
				strString	= strString.substr(0, strString.length - 1);
			}
		}
		
		else
		{
			if (true == _bPassword)
			{
				displayUnencodedString(_socket, "*", false);
			}
			
			else
			{
				displayUnencodedString(_socket, _strInput, false);
			}
			
			strString	+= _strInput;
		}
	}
}

// Display a line of text, from Strings.json, and gets a line of input, returns with a complete string when enter is pressed.
function promptInput(_socket, _strString, _completeFunction)
{
	promptInputRawString(_socket, strings.getString(_strString), _completeFunction);
}

// Display a line of text and gets a line of input, returns with a complete string when enter is pressed.
function promptInputRawString(_socket, _strString, _completeFunction)
{
	displayRawString(_socket, _strString, false);

	getInput(_socket, _completeFunction);
}

// Display a line of text, from Strings.json, and gets a line of input characters are replaced with "*".
// Returns with a complete string when enter is pressed.
function promptPassword(_socket, _strString, _completeFunction)
{
	promptPasswordRawString(_socket, strings.getString(_strString), _completeFunction);
}

// Display a line of text and gets a line of input characters are replaced with "*".
// Returns with a complete string when enter is pressed.
function promptPasswordRawString(_socket, _strString, _completeFunction)
{
	displayRawString(_socket, _strString, false);

	getInput(_socket, _completeFunction, true);
}

// Gets a single keypress
function getKey(_socket, _completeFunction, _bEcho)
{
	if ('undefined' == typeof(_bEcho))
	{
		_bEcho	= true;
	}

	_socket.addListener("data", handleInput);

	function handleInput(_strInput)
	{
		_socket.removeListener("data", handleInput);
		
		if (true == _bEcho)
		{
			displayUnencodedString(_socket, _strInput);
		}
			
		_completeFunction(_strInput);
	}
}

// Display a line of text and gets a single keypress.
function promptKey(_socket, _strString, _completeFunction, _bEcho)
{
	promptKeyRawString(_socket, strings.getString(_strString), _completeFunction, _bEcho);
}

// Display a line of text and gets a single keypress.
function promptKeyRawString(_socket, _strString, _completeFunction, _bEcho)
{
	if ('undefined' == typeof(_bEcho))
	{
		_bEcho	= true;
	}

	displayRawString(_socket, _strString, false);

	getKey(_socket, _completeFunction, _bEcho);
}

// Gets y/n Y/N keypress
function getYorN(_socket, _yesFunction, _noFunction)
{
	_socket.addListener("data", handleInput);

	function handleInput(_strInput)
	{
		if (isYorN(_strInput))
		{
			_socket.removeListener("data", handleInput);
			
			displayUnencodedString(_socket, _strInput.toString().toUpperCase());
				
			if ("y" == _strInput.toString().toLowerCase())
			{
				_yesFunction();
			}
			
			else
			{
				_noFunction();
			}
		}
	}
}

// Display a yes or no prompt and wait for y or n.
function promptYorN(_socket, _strString, _yesFunction, _noFunction)
{
	promptYorNRawString(_socket, strings.getString(_strString), _yesFunction, _noFunction);
}

// Display a yes or no prompt and wait for y or n.
function promptYorNRawString(_socket, _strString, _yesFunction, _noFunction)
{
	displayRawString(_socket, _strString, false);

	getYorN(_socket, _yesFunction, _noFunction);
}

// Is this an EOL character?
function isEOL(_strString)
{
	if ("\r\n" == _strString || "\n" == _strString || "\r" == _strString)
	{
		return	true;
	}	

	return	false;
}

// Was delete pressed?
function isDelete(_strString)
{
	if ("\b" == _strString)
	{
		return	true;
	}

	return	false;
}

// Was y or n pressed?
function isYorN(_strString)
{
	if ("y" == _strString || "Y" == _strString || "n" == _strString || "N" == _strString)
	{
		return	true;
	}
	
	return	false;
}

function disconnect(_socket)
{
	console.log("User disconnected\n");

	userManager.logOff(_socket);
	
	_socket.end();
}

ColorDefines	= 
{
	Black : 0,
	Red : 1,
	Green : 2,
	Yellow : 3,
	Blue : 4,
	Magenta : 5,
	Cyan : 6,
	White : 7,
};

function setColor(_socket, _color, _bBright)
{
	if ('undefined' == typeof(_bBright))
	{
		_bBright	= true;
	}

	var	strColorString	= "\x1b[";
	
	if (true == _bBright)
	{
		strColorString	+= "1;";
	}
	
	else
	{
		strColorString	+= "2;";
	}
	
	switch (_color)
	{
		case ColorDefines.Black:
			strColorString	+= "30m"
			
			break;

		case ColorDefines.Red:
			strColorString	+= "31m"

			break;

		case ColorDefines.Green:
			strColorString	+= "32m"

			break;

		case ColorDefines.Yellow:
			strColorString	+= "33m"

			break;

		case ColorDefines.Blue:
			strColorString	+= "34m"

			break;

		case ColorDefines.Magenta:
			strColorString	+= "35m"

			break;

		case ColorDefines.Cyan:
			strColorString	+= "36m"

			break;

		case ColorDefines.White:
			strColorString	+= "37m"

			break;
	}

	displayRawString(_socket, strColorString, false);
}

function setBackgroundColor(_socket, _color, _bBright)
{
	if ('undefined' == typeof(_bBright))
	{
		_bBright	= true;
	}

	var	strColorString	= "\x1b[";
	
	if (true == _bBright)
	{
		strColorString	+= "1;";
	}
	
	else
	{
		strColorString	+= "2;";
	}
	
	switch (_color)
	{
		case ColorDefines.Black:
			strColorString	+= "40m"
			
			break;

		case ColorDefines.Red:
			strColorString	+= "41m"

			break;

		case ColorDefines.Green:
			strColorString	+= "42m"

			break;

		case ColorDefines.Yellow:
			strColorString	+= "43m"

			break;

		case ColorDefines.Blue:
			strColorString	+= "44m"

			break;

		case ColorDefines.Magenta:
			strColorString	+= "45m"

			break;

		case ColorDefines.Cyan:
			strColorString	+= "46m"

			break;

		case ColorDefines.White:
			strColorString	+= "47m"

			break;
	}

	displayRawString(_socket, strColorString, false);
}
