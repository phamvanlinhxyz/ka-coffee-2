const createUserToken = (user) => {
    return { userId: user._id };
};

module.exports = createUserToken;
