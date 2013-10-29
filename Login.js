// Local objects
var utilities	= require('./Utilities')
var userManager	= require('./UserManager')

exports.enter	= enter;

function enter(_socket, _completeFunction)
{
	var m_strUserName;
	var	m_iFailedAttempts	= 0;
			
	// Display the login prompt with the new user instructions.
	displayLoginMessage(true);
	
	function displayLoginMessage(_bNewUserMessage)
	{
		if ('undefined' == typeof(_bNewUserMessage))
		{
			_bNewUserMessage	= false;
		}

		// Clear the user name and password
		m_strUserName	= "";
	
		// Change colors
		utilities.setColor(_socket, ColorDefines.White);
		utilities.setBackgroundColor(_socket, ColorDefines.Black);
		
		utilities.displayBlankLine(_socket);
		
		if (true == _bNewUserMessage)
		{
			utilities.displayString(_socket, "newUserMessage");
		}
		
		utilities.promptInput(_socket, "usernamePrompt", handleUserName);
	}

	function handleUserName(_strUserName)
	{
		if (_strUserName == strings.getString("newUsername"))
		{
			// Reset failed logins.
			m_iFailedAttempts	= 0;

			if (true == modules.isModuleValid("newUser"))
			{
				// Show new user screen
				modules.getModule("newUser").enter(_socket, displayLoginMessage);
			}
			
			else
			{
				// Use default new user
				login	= require("./NewUser");
				
				// Show default new user screen
				login.enter(_socket, displayLoginMessage);
			}
		}
		
		else if (0 == _strUserName.length)
		{
			utilities.displayString(_socket, "invalidUserNameError");
			utilities.displayBlankLine(_socket);
			
			utilities.promptInput(_socket, "usernamePrompt", handleUserName);
		}
		
		else
		{
			m_strUserName	= _strUserName;
			
			utilities.promptPassword(_socket, "passwordPrompt", handlePassword);
		}
	}

	function handlePassword(_strPassword)
	{
		if (0 == _strPassword.length)
		{
			utilities.displayString(_socket, "invalidPasswordError");
			utilities.displayBlankLine(_socket);

			utilities.promptInput(_socket, "passwordPrompt", handlePassword);
		}
		
		else
		{
			userManager.validateUser(m_strUserName, _strPassword, loggedIn, invalidLogin)
		}
	}

	function loggedIn()
	{
		userManager.logOn(_socket, m_strUserName);
		
		_completeFunction();
	}
	
	function invalidLogin()
	{
		// Display login error message
		utilities.displayBlankLine(_socket);
		utilities.displayString(_socket, "invalidLoginMessage");

		m_iFailedAttempts++;
		
		if (m_iFailedAttempts >= settings.getSetting("maxLoginAttempts"))
		{
			// Display maximum failed logins error message.
			utilities.displayBlankLine(_socket);
			utilities.displayString(_socket, "maxLoginsError");
			utilities.displayString(_socket, "goodByeMessage");
	    
			utilities.disconnect(_socket);
		}
		
		else
		{		
			// Show login prompt again
			displayLoginMessage(true);
		}
	}
}
