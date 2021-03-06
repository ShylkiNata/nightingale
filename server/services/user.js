const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    create,
    getById
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ 'email': email });
    if (user && bcrypt.compareSync(password, user.password)) {
        return authResponse(user);
    }
}

async function create(userParam) {
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    userParam.password = bcrypt.hashSync(userParam.password, 10);
    const user = new User(userParam);
    const model = await user.save();

    return authResponse(model);
}

async function getById(id) {
    return await User.findById(id).select('-password');
}

function authResponse(user) {
    const { password, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
        ...userWithoutHash,
        token
    };
}