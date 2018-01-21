module.exports = (sequelize, DataTypes) => {

	const User = sequelize.define('User', {
		fio: DataTypes.STRING,
		appointments: DataTypes.ARRAY(DataTypes.INTEGER)
	});
	
	User.getUserBaseInfo = function(id, callback){
		this.findById(id, 
		{
			attributes: ['id','fio'],
			rejectOnEmpty: true
		}
		).then((user) => {
			callback(null, user);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	User.getUserAppointmentsArray = function(id, callback){
		this.findById(id, 
		{
			attributes: ['appointments'],
			rejectOnEmpty: true
		}
		).then((user) => {
			callback(null, user);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	User.addToUserAppointmentsArray = function(id, appoinmentId, callback){
		this.findById(id, 
		{
			attributes: ['appointments'],
			rejectOnEmpty: true
		}
		).then((appointments) => {
			let idx = appointments.appointments.indexOf(parseInt(appoinmentId));
			if (idx < 0) {
				this.update(
					{'appointments': sequelize.fn('array_append', sequelize.col('appointments'), appoinmentId)},
					{'where': {'id': id}}
				).then((result) => {
					callback(null, result);
				});
			} else {
				throw 'AppointmentExisted';
			}
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	User.deleteFromUserAppointmentsArray = function(id, appoinmentId, callback){
		this.findById(id, 
		{
			attributes: ['appointments'],
			rejectOnEmpty: true
		}
		).then((user) => {
			let idx = user.appointments.indexOf(parseInt(appoinmentId));
			if (idx >= 0) {
				user.appointments.splice(idx, 1);
				
				this.update(
					{'appointments': user.appointments},
					{'where': {'id': id}}
				).then((result) => {
					callback(null, result);
				});
			} else {
				throw 'AppointmentNotFound';
			}
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	return User;
};

