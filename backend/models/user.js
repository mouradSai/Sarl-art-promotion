const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { 
		type: String, 
		required: true 
	},

	lastName: {
		 type: String, 
		 required: true 
		},

	email: { 
		type: String, 
		required: true 
	},

	password: { 
	  type: String, 
	  required: true 
	},

	role: {
        type: String,
		required: true,
        enum: ["user", "admin", "superadmin"], // Définissez les rôles possibles
        default: "user" // Rôle par défaut pour les nouveaux utilisateurs
    }
});
userSchema.methods.generateAuthToken = function () {
    // Inclure le rôle de l'utilisateur dans le jeton
    const token = jwt.sign({ _id: this._id, role: this.role, firstName : this.firstName }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};


const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };



