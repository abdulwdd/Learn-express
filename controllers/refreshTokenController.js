const userDB = {
    setMyUsers: function (data) { this.users = data }
}
const jwt = require("jsonwebtoken");

async function handleRefreshToken (req, resp) {
    const cookies = req.cookies;

    if(!cookies?.jwt) return resp.sendStatus(401); 
    const refreshToken = cookies.jwt;

    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) return resp.sendStatus(403);  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err || foundUser.username !== decoded.username) {
            return resp.sendStatus(403);  
        }

        const accessToken = jwt.sign(
            { "username": decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }  
        );

        resp.json({ accessToken });
    });
}

module.exports = handleRefreshToken;
