const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		// Récupération du rôle de l'utilisateur
		const role = user.role;

		// Récupération du rôle de l'utilisateur
		const firstName = user.firstName;


		// Génération du jeton d'authentification
		const token = user.generateAuthToken();

		// Envoi de la réponse avec le token et le rôle
		res.status(200).send({ data: { token, role, firstName }, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server " });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
