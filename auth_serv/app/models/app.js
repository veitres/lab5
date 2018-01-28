const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {

	const App = sequelize.define('App', {
		appId: DataTypes.STRING,
		appSecret: DataTypes.STRING
	});
	
	return App;
};

