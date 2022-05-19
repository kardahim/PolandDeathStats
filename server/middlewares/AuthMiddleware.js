const { verify } = require("jsonwebtoken")

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")

    if (!accessToken) {
        return res.json({ error: "You're not logged in!" })
    }

    try {
        const validToken = verify(accessToken, "34qwereawdq4we3w3eqf7y6uhesecerttoken");
        req.user = validToken;
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json({ error: "Token is not valid!" });
    }

}
module.exports = { validateToken };