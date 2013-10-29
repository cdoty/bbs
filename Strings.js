// Local objects
var fs	= require('fs')

exports.load		= load;
exports.getString	= getString;

// Strings from Strings.json
var	m_strStrings;

// Synchronous reading of settings.
function load()
{
	console.log("Loading strings...\n");

	// Load strings
	loadStrings();
}

function getString(_strName)
{
	return	m_strStrings[_strName];
}

function loadStrings()
{
	data	= fs.readFileSync(__dirname + "/Settings/Strings.json");

	m_strStrings	= JSON.parse(data);
}
