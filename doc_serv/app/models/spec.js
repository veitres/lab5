module.exports = (sequelize, DataTypes) => {

	const Spec = sequelize.define('Spec', {
		spec: DataTypes.STRING
		},
		{ timestamps: false }
	);
  
	Spec.getAllSpecs = function(page, size, callback){
		this.findAndCountAll({
			offset: page*size,
			limit: size
		}
		).then((specs) => {
			callback(null, specs);
		}).catch(function (err) {
			callback(err, null);
		});
	};

	return Spec;
};

