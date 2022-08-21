// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to log in!');
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Invalid login!');
            }
            const passwordValidation = await user.isCorrectPassword(password);
            if (!passwordValidation) {
                throw new AuthenticationError('Invalid login!');
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            if (!user) {
                throw new AuthenticationError('Something is wrong!')
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { content }, context) => {
            try {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: content } },
                    { new: true, runValidators: true }
                );
                return updateUser;
            } catch (err) {
                // console.log(err.message);
                throw new AuthenticationError('You need to be logged in!');
            }
        },
        removeBook: async (parent, { bookId }, context) => {
            const updateUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            if (!updateUser) {
                throw new AuthenticationError("Couldn't find user with this id!");
            }
            return updateUser;
        },
    }
}

module.exports = resolvers;