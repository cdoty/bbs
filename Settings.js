// Local objects
var fs	= require('fs')

exports.load		= load;
exports.getSetting	= getSetting;

// Settings from Settings.json
var	m_strSettings;

// Synchronous reading of settings.
function load()
{
	console.log("Loading settings...\n");

	// Load settings
	loadSettings();
}

function getSetting(_strSetting)
{
	return	m_strSettings[_strSetting];
}

function loadSettings()
{
	data	= fs.readFileSync(__dirname + "/Settings/Settings.json");

	m_strSettings	= JSON.parse(data);
}
