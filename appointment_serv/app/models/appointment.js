module.exports = (sequelize, DataTypes) => {

	const Appointment = sequelize.define('Appointment', {
		docId: DataTypes.INTEGER,
		date: DataTypes.DATE,
		isFree: DataTypes.BOOLEAN
	});
	
	Appointment.getFreeAppointmentsByDoc = function(docId, page, size, callback){
		this.findAndCountAll({
			attributes: ['id','date'],
			where: { docId: docId, isFree: true },
			order: [['id', 'ASC']],
			offset: page*size,
			limit: size
		}
		).then((appointments) => {
			callback(null, appointments);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	Appointment.getAppointment = function(id, callback){
		this.findById(id, 
		{
			attributes: ['id','docId','date'],
			rejectOnEmpty: true
		}
		).then((appointment) => {
			callback(null, appointment);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	Appointment.setAppointmentLocked = function(id, callback){
		this.update(
			{'isFree': false},
			{'where': [{'id': id}, {'isFree': true}]},
			{rejectOnEmpty: true}
		).then((result) => {
			callback(null, result);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	Appointment.setAppointmentUnLocked = function(id, callback){
		this.update(
			{'isFree': true},
			{'where': [{'id': id}, {'isFree': false}]},
			{rejectOnEmpty: true}
		).then((result) => {
			callback(null, result);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	return Appointment;
};

