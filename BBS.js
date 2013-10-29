// Global objects
screens			= require("./Screens")
settings		= require("./Settings")
strings			= require("./Strings")
modules			= require("./Modules")
userManager		= require("./UserManager");

// Local objects
var net			= require("net")
var utilities	= require("./Utilities")

// Load modules
modules.load();

// Load screens
screens.load();

// Load settings
settings.load();

// Load strings
strings.load();

// Load user manager, and connect to mongo db. Must be done after loading settings.
userManager.load();

// Create the server
var server  = net.createServer(connection).listen(2300);

console.log("Server started\n");

function connection(_socket)
{
	_socket.addListener("connect", connectFunction);
	_socket.addListener("end", endFunction);

	function connectFunction()
	{
		console.log("User connected\n");
		
		if (true == modules.isModuleValid("connect"))
		{
			// Show connect screen
			modules.getModule("connect").enter(_socket, connectComplete);
		}
		
		else
		{
			connectComplete();
		}
	}

	function connectComplete()
	{
		if (true == modules.isModuleValid("login"))
		{
			// Show connect screen
			modules.getModule("login").enter(_socket, loginComplete);
		}
		
		else
		{
			// Use default login
			login	= require("./Login");
			
			// Handle login
			login.enter(_socket, loginComplete);
		}
	}

	function loginComplete()
	{
		if (true == modules.isModuleValid("welcome"))
		{
			// Show welcome screen
			modules.getModule("welcome").enter(_socket, welcomeComplete);
		}
		
		else
		{
			// No welcome screen, we're done.
			welcomeComplete();
		}
	}

	function welcomeComplete()
	{
		if (true == modules.isModuleValid("preMenu"))
		{
			// Show pre menu (news, last callers ect.)
			modules.getModule("preMenu").enter(_socket, welcomeComplete);
		}
		
		else
		{
			preMenuComplete();
		}
	}
	
	function preMenuComplete()
	{
		if (true == modules.isModuleValid("mainMenu"))
		{
			// Show main menu
			modules.getModule("mainMenu").enter(_socket, welcomeComplete);
		}
		
		else
		{
			// Use default main menu
			mainMenu	= require("./MainMenu");
			
			// Handle main menu
			mainMenu.enter(_socket);
		}
	}
	
	function endFunction()
	{
		utilities.disconnect(_socket);
	}
}
