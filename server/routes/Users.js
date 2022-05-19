const express = require('express')
const router = express.Router()
const { User } = require("../db/models")
const bcrypt = require("bcrypt")
const { validateToken} = require("../middlewares/AuthMiddleware.js")
const {sign} = require('jsonwebtoken')


// jeśli będziemy tego potrzebować to trzeba to przepuszczać przez dodatkowy middleware sprawdzający role...
// Get all Users            
// router.get("/", async (req, res) => {
//     const users = await User.findAll();
//     res.json(users);
// });

// Register
router.post("/", async (req, res) => {      // hashowanie po stronie serwera? XDDD
    const {email, password} = req.body;
    bcrypt.hash(password,10).then((hash) => {
        User.create({
            email:email,
            password:hash
        })
    })
    res.json("success");
});

// Login
router.post("/login", async(req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email: email}});

    if(!user) {
        res.json({error: "User with given email does not exist."});
    }
    else {
        bcrypt.compare(password, user.password).then((match) => {
            if(!match) {
                res.json({error:"Password incorrect!"});
            }
            else {
                const accessToken = sign({email: user.email, id: user.id}, "34qwereawdq4we3w3eqf7y6uhesecerttoken");
                res.json({token: accessToken, email: email, id: user.id});
            }
    
        });
    }
    
});

// Validate login
router.get("/auth",validateToken, (req, res) => {
    res.json(req.user)
})

// Get User by id
router.get("/:id", async (req, res) => {
    const id=req.params.id
    const user = await User.findByPk(id, {
        attributes: {exclude: ['password']}
    });
    res.json(user)
});

// Get User by email
router.get("/email/:email", async (req, res) => {
    const email = req.params.username
    const user = await User.findOne({where: {email: email}, attributes: {exclude: ['password']}});
    res.json(user);
});

module.exports = router
