const crypto = require('crypto');
const hashSecret = '21477 61225 37 7836 29 2364? 32 575 784 9383.';

module.exports = (sequelize, DataTypes) => {

	const UIToken = sequelize.define('UIToken', {
		token: DataTypes.STRING,
		userId: DataTypes.INTEGER,
		created: DataTypes.DATE,
		lastUsed: DataTypes.DATE
	},{ timestamps: false }
	);
	
	UIToken.findToken = function (token, callback) {
		this.findOne(
		{
			where: { token: token },
			rejectOnEmpty: true
		}
		).then((token) => {
			callback(null, token);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	UIToken.createToken = function (userId, callback) {
		this.create({
			token: crypto.randomBytes(32).toString('base64'),
			userId: userId,
			created: Date.now(),
			lastUsed: Date.now()
		}).then((token) => {
			callback(null, token);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	return UIToken;
};
