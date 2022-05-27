const { User } = require('../db/models')
const bcrypt = require("bcrypt")
const { validateToken } = require('../middlewares/AuthMiddleware')
const { sign } = require('jsonwebtoken')

module.exports = {
    // get all users
    getUsers: async (req, res) => {
        const users = await User.findAll();
        res.json(users);
    },

    // register
    register: async (req, res) => {
        const { email, password, firstname, lastname } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (user) {
            res.json({ error: "User with given email already exists." });
        }
        else {
            bcrypt.hash(password, 10).then((hash) => {
                User.create({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hash
                })
            })
            res.json("success");
        }
    },

    // login
    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            res.json({ error: "Użytkownik nie istnieje" });
        }
        else {
            bcrypt.compare(password, user.password).then((match) => {
                if (!match) {
                    res.json({ error: "Hasło jest niepoprawne" });
                }
                else {
                    const accessToken = sign({ email: user.email, id: user.id }, "34qwereawdq4we3w3eqf7y6uhesecerttoken");
                    res.json({ token: accessToken, email: email, id: user.id });
                }

            });
        }
    },
    // validate login
    validateToken: async (req, res) => {
        res.json(req.user)
    },

    // get users by id
    getById: async (req, res) => {
        const id = req.params.id
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user)
    },

    // get users by email
    getByEmail: async (req, res) => {
        const email = req.params.email
        const user = await User.findOne({ where: { email: email }, attributes: { exclude: ['password'] } });
        res.json(user);
    }
}