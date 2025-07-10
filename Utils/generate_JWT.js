const jwt = require('jsonwebtoken');

const generate_JWT = async (_id) => {
    try {
        const token = jwt.sign({id : _id},process.env.JWT_Secret,{expiresIn : '1d'});
        return token
    } catch (error) {
        console.log("error in utils generate JWT file : ", error);
    }
}

module.exports = generate_JWT;