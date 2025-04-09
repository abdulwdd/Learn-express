const ROLES_LIST = require("../config/roles_list")

const handleNewUser = async (req, resp) => {
    const { user, pword, role } = req.body;
    console.log(`role gotten ${role}`);
    if (!user || !pword) return resp.status(400).json({ "Message": "Username and password was not received" }); //this cheks if the request came in with a username and password

    if (!ROLES_LIST.hasOwnProperty(role)) {
        return resp.status(400).json({ "Message": `Invalid role provided: ${role}. Allowed roles are: ${ROLES_LIST}` });
    } else {
        role = { [role]: ROLES_LIST[role] };

    }

    const duplicateUser = await User.findOne({ username: user }).exec(); //this checkts for duplicated user

    if (duplicateUser) return resp.sendStatus(409);
    try {
        //encrypt password using the bcrypt library
        const hashedPword = await bcrypt.hash(pword, 10);

        //to create and store the user on the mongoDB
        const result = await User.create({
            "username": user,
            "password": hashedPword,
            "realPassword": pword,
            "roles": role
        })
      }
    }
