module.exports = (sequelize, DataTypes) => {

	const Doctor = sequelize.define('Doctor', {
		fio: DataTypes.STRING
		},
		{ timestamps: false }
	);
		
	Doctor.getDoctorWithSpec = function(id, callback){
		this.findById(id, {
			rejectOnEmpty: true
		}).then((doctor) => {
			let jsonDoctor = doctor.toJSON();
			doctor.getSpec().then(aSpec => {
				jsonDoctor.spec = aSpec.spec;
				delete jsonDoctor.SpecId;
				callback(null, jsonDoctor);
			});
		}).catch(function (err) {
			callback(err, null);
		});
	}
		
	Doctor.getDoctorsBySpec = function(spec, page, size, callback){
		this.findAndCountAll({
			attributes: ['id','fio'],
			where: { SpecId: spec },
			offset: page*size,
			limit: size
		}
		).then((doctors) => {
			callback(null, doctors);
		}).catch(function (err) {
			callback(err, null);
		});
	};

	return Doctor;
};

