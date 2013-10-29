// Local objects
var fs	= require('fs')

exports.load		= load;
exports.getScreen	= getScreen;

// Screens from Screens.json
var	m_strScreens;

// Synchronous reading of settings.
function load()
{
	console.log("Loading screens...\n");

	// Load screens
	loadScreens();
}

function getScreen(_strScreen)
{
	return	m_strScreens[_strScreen];
}

function loadScreens()
{
	data	= fs.readFileSync(__dirname + "/Settings/Screens.json");

	m_strScreens	= JSON.parse(data);
}
