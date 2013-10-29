var fs			= require('fs')
var utilities	= require('./Utilities')

exports.enter	= enter;

// Menu items from MainMenu.json
var	m_items;

// Have the menu items been loaded?
var	m_loaded	= false;

function enter(_socket)
{
	if (false == m_loaded)
	{
		loadItems();
	
		m_loaded	= true;
	}
	
	// Show the menu
	showMenu();

	function handleMainMenu()
	{
		// Change colors
		utilities.setColor(_socket, ColorDefines.White);
		utilities.setBackgroundColor(_socket, ColorDefines.Black);
		
		utilities.promptKey(_socket, "mainMenuPrompt", handleInput, false);
	}

	function handleInput(_strInput)
	{
		var	command	= _strInput.toString().toLowerCase();

		if (true == isItemValid(command))
		{
			// Display the input
			utilities.displayUnencodedString(_socket, command.toUpperCase(), false);
			utilities.displayBlankLine(_socket);
		
			// Launch the module
			var	module	= getItem(command);

			if (module != null)
			{
				module.enter(_socket, showMenu);
			}
		}
	
		else
		{
			utilities.getKey(_socket, handleInput, false);
		}
	}

	function loadItems()
	{
		data	= fs.readFileSync(__dirname + "/Settings/MainMenu.json");

		var	strItems	= JSON.parse(data);

		// Create the module array
		m_items	= new Array();
		
		// Load each module and assign the function to the module array under the key name.
		for (var key in strItems)
		{
			if (key.length > 0 && strItems[key].length > 0)
			{
				m_items[key]	= require("./" + strItems[key])
			}
		}
	}

	function isItemValid(_strName)
	{
		// See if the module exists in the modules array
		if ('undefined' == typeof(m_items[_strName]))
		{
			return	false;
		}
		
		return	true;
	}

	function getItem(_strName)
	{
		if (true == isItemValid(_strName))
		{
			// Return the module function
			return	m_items[_strName];
		}
		
		else
		{
			return	null;
		}
	}

	function showMenu()
	{
		utilities.displayFile(_socket, __dirname + "/Screens/" + screens.getScreen("mainMenu"), handleMainMenu);
	}
}
