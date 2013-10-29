// Local objects
var fs	= require('fs')

exports.load			= load;
exports.isModuleValid	= isModuleValid;
exports.getModule		= getModule;

// Modules functions from Modules.json
var	m_modules;

// Synchronous reading of modules.
function load()
{
	console.log("Loading modules...\n");
	
	// Load modules
	loadModules();
}

function isModuleValid(_strName)
{
	// See if the module exists in the modules array
	if ('undefined' == typeof(m_modules[_strName]))
	{
		return	false;
	}
	
	return	true;
}

function getModule(_strName)
{
	if (true == isModuleValid(_strName))
	{
		// Return the module function
		return	m_modules[_strName];
	}
	
	else
	{
		return	null;
	}
}

function loadModules()
{
	data	= fs.readFileSync(__dirname + "/Settings/Modules.json");

	var	strModules	= JSON.parse(data);

	// Create the module array
	m_modules	= new Array();
	
	// Load each module and assign the function to the module array under the key name.
	for (var key in strModules)
	{
		if (key.length > 0 && strModules[key].length > 0)
		{
			m_modules[key]	= require("./" + strModules[key])
		}
	}
}
