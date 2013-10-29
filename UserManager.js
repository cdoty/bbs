// Local objects
var	mongo		= require("mongodb")
var crypto		= require('crypto');

exports.load			= load;
exports.addUser			= addUser;
exports.validateUser	= validateUser;
exports.checkUserName	= checkUserName;
exports.getUserName		= getUserName;
exports.getLastLogin	= getLastLogin;
exports.logOn			= logOn;
exports.logOff			= logOff;

var m_mongodb;
var m_userArray;

function load()
{
	console.log("Loading users...\n");
	
	// Create user array
	m_userArray	= new Array();
	
	// Create mongo db
	m_mongodb	= new mongo.Db(settings.getSetting("mongoDatabaseName"),
		new mongo.Server(settings.getSetting("mongoHostName"), settings.getSetting("mongoPort"), {auto_reconnect: true}),
		{});

	// Open a connection to the database
	openDatabase();
}

// Add a user
function addUser(_strUserName, _strPassword, _completeFunction, _failureFunction)
{
	var	user	= {userName: _strUserName, passwordHash: calculateDigest(_strPassword)};

	m_mongodb.collection("users", function(_error, _userCollection)
	{
		if (_error)
		{
			databaseError(_error)
	
			return	_failureFunction();
		}

		// Add the user
		_userCollection.insert(user)
		
		_completeFunction();
	});
}

// Validate a user
function validateUser(_strUserName, _strPassword, _successFunction, _failureFunction)
{
	m_mongodb.collection("users", function(_error, _userCollection)
	{
		if (_error)
		{
			databaseError(_error);
			
			return	_failureFunction();
		}
		
		var	user	= _userCollection.findOne({userName: _strUserName}, function(_error, _document)
		{
			if (null == _document || _document.passwordHash != calculateDigest(_strPassword))
			{
				_failureFunction();
			}

			else
			{
				_successFunction();
			}
		});
	});
}

// Check user name. Returns true if the user name is not used.
function checkUserName(_strUserName, _successFunction, _failureFunction)
{
	m_mongodb.collection("users", function(_error, _userCollection)
	{
		if (_error)
		{
			databaseError(_error);
			
			return	_successFunction();
		}
		
		var	user	= _userCollection.findOne({userName: _strUserName}, function(_error, _document)
		{
			if (null == _document)
			{
				_successFunction();
			}

			else
			{
				_failureFunction();
			}
		});
	});
}

// Calculate SHA1 digest of a string
function calculateDigest(_strString)
{
	// Calculate MD5 hash of the string
	var	shaHash	= crypto.createHash('md5');
	
	shaHash.update(_strString);
	
	var	strHash	= shaHash.digest('hex');
	
	return	strHash;
}

// Open database
function openDatabase()
{
	m_mongodb.open(function(_error, db)
	{
		if (_error)
		{
			databaseError(_error)
		}
		
		else
		{
			var	userName	= settings.getSetting("mongoUserName");
			var	password	= settings.getSetting("mongoPassword");
	
			// Log in, if needed
			if (userName.length > 0 && password.length > 0)
			{
				db.authenticate(userName, password, function(_error)
				{
					if (_error)
					{
						databaseError(_error)
					}
				});
			}
		}
	});
}

// Display database error message
function databaseError(_error)
{
	console.log("Database error: " + _error + "\n");
}

function getUserName(_socket)
{
	if (null == _socket.m_strUserName)
	{
		return	"";
	}
	
	return	_socket.m_strUserName;
}

function getLastLogin(_socket)
{
	if (null == _socket.m_iLastLogin)
	{
		return	"";
	}
			
	var	date = new Date();
	
	date.setTime(_socket.m_iLastLogin);
	
	return	date.toString();
}

function logOn(_socket, _strUserName)
{
	m_userArray.push(_socket);
	
	// Get the current time, in ms since 1970
	var	iTime	= new Date().getTime();	

	_socket.m_strUserName	= _strUserName;
	_socket.m_iLastLogin	= iTime;

	m_mongodb.collection("users", function(_error, _userCollection)
	{
		if (_error)
		{
			databaseError(_error);
			
			return	_failureFunction();
		}
		
		var	user	= _userCollection.findOne({userName: _strUserName}, function(_error, _document)
		{
			_document.lastLogin		= iTime;
				
			_userCollection.update({userName: _strUserName}, _document, function(_error, _document)
			{
				if (_error)
				{
					databaseError(_error)
				}
			});
		});
	});
}

function logOff(_socket)
{
	var	iIndex	= m_userArray.indexOf(_socket);
	
	if (iIndex != -1)
	{
		m_userArray.splice(iIndex, 1);
	}
}