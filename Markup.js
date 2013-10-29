// Local objects
var userManager	= require('./UserManager')

exports.handleMarkup	= handleMarkup;

// Replace markup strings with the correct values
// Current replacements:
// %UN - User Name
// %LL - Last login
function handleMarkup(_socket, _strString)
{
	_strString	= _strString.toString();
	
	var	regExp	= /%UN/g;
	
	if (true == regExp.test(_strString))
	{
		_strString	= _strString.replace(regExp, userManager.getUserName(_socket));
	}
	
	regExp	= /%LL/g;
	
	if (true == regExp.test(_strString))
	{
		_strString	= _strString.replace(regExp, userManager.getLastLogin(_socket));
	}
	
	return	_strString;
}
