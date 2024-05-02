const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Route pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// Route pour supprimer un utilisateur par son ID
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Route pour mettre à jour le rôle d'un utilisateur par son ID
router.put("/:id/role", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send({ message: "User role updated successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
