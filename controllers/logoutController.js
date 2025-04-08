const userDB = {
    users: require("../model/myUsers.json"),
    setUsers: function(data){this.users = data}
}
const fsPromises = require("fs").promises;
const path = require("path");

async function handleLogout(req, resp) {
    const cookies = req.cookies;
    if(!cookies?.jwt) return resp.status(204).json({"message": "no cookie found"});

    const refreshToken = cookies.jwt;

    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);

    if(!foundUser) {
        resp.clearCookie("jwt", refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000
        })
        return resp.sendStatus(204)
    }

    const otherUsers = userDB.users.filter(humanBeing => humanBeing.
        refreshToken !== foundUser.refreshToken
    );
    const currentUser = {...foundUser, refreshToken: ''};
    userDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, "..", "model","myUsers.json"),
        JSON.stringify(userDB.users)
    );
    resp.clearCookie("jwt", refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000
    })
    return resp.sendStatus(204)
}

module.exports = handleLogout