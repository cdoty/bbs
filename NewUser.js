// Global objects
userManager		= require('./UserManager')

// Local objects
var utilities	= require('./Utilities')

exports.enter	= enter;

function enter(_socket, _loginFunction)
{
	var m_strUserName;
	var m_strPassword;
		
	// Clear the user name and password
	m_strUserName	= "";
	m_strPassword	= "";
	
	// Display user name prompt
	displayUserNamePrompt();
	
	function displayUserNamePrompt()
	{
		utilities.displayBlankLine(_socket);
		utilities.promptInput(_socket, "newUsernamePrompt", handleUserName);
	}
	
	function handleUserName(_strUserName)
	{
		// Check for blank user name
		if (0 == _strUserName.length)
		{
			utilities.displayString(_socket, "invalidUserNameError");
			utilities.displayBlankLine(_socket);
			
			utilities.promptInput(_socket, "newUsernamePrompt", handleUserName);
		}
		
		else
		{
			m_strUserName	= _strUserName;
			
			// Display checking user name message
			utilities.displayString(_socket, "checkingUserNameMessage");
			utilities.displayBlankLine(_socket);

			// See if the user is in the database
			userManager.checkUserName(m_strUserName, userNameAvailable, userNameTaken);
		}
	}

	function userNameAvailable()
	{
		utilities.promptPassword(_socket, "newPasswordPrompt", handlePassword1);
	}
	
	function userNameTaken()
	{
		// Display user name taken error message
		utilities.displayString(_socket, "userNameError");
		utilities.displayBlankLine(_socket);
		
		// Redisplay user name prompt
		displayUserNamePrompt();
	}
	
	function handlePassword1(_strPassword)
	{
		// Check for blank password
		if (0 == _strPassword.length)
		{
			utilities.displayString(_socket, "invalidPasswordError");
			utilities.displayBlankLine(_socket);

			utilities.promptPassword(_socket, "newPasswordPrompt", handlePassword1);
		}
		
		else if (_strPassword.length < settings.getSetting("minPasswordLength"))
		{
			utilities.displayString(_socket, "passwordLengthError");
			utilities.displayBlankLine(_socket);

			utilities.promptPassword(_socket, "newPasswordPrompt", handlePassword1);
		}
		
		else
		{
			m_strPassword	= _strPassword;
			
			utilities.promptPassword(_socket, "reenterPasswordPrompt", handlePassword2);
		}		
	}

	function handlePassword2(_strPassword)
	{
		if (0 == _strPassword.length)
		{
			utilities.displayString(_socket, "invalidPasswordError");
			utilities.displayBlankLine(_socket);

			utilities.promptPassword(_socket, "reenterPasswordPrompt", handlePassword2);
		}
		
		else
		{
			if (_strPassword != m_strPassword)
			{
				m_strPassword	= "";
				
				utilities.displayString(_socket, "passwordMatchError");
				utilities.displayBlankLine(_socket);

				utilities.promptPassword(_socket, "newPasswordPrompt", handlePassword1);
			}
			
			else
			{
				// Save user to the database
				userManager.addUser(m_strUserName, m_strPassword, _loginFunction, addUserErrorFunction);
			}
		}
	}

	function addUserErrorFunction()
	{
		// Display unable to add user error message.
		utilities.displayBlankLine(_socket);
		utilities.displayString(_socket, "addUserError");

		displayUserNamePrompt();
	}
}
