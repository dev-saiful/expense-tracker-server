import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Query: {
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.log("Error occured while user query", error);
        throw new Error(error.message || "Internal Server Errod");
      }
    },
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("Error occured while authenticating user", error);
        throw new Error(error.message || "Internal Server Errod");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const alreadyExists = await User.findOne({ username });
        if (alreadyExists) {
          throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hassPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        // create profile avatar
        const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        let profilePicture;
        if (gender === "male") {
          profilePicture = boyProfile;
        } else {
          profilePicture = girlProfile;
        }

        const userCreated = new User({
          username,
          name,
          password: hassPassword,
          gender,
          profilePicture,
        });
        await userCreated.save();
        await context.login(userCreated);
        return userCreated;
      } catch (error) {
        console.log("Error occured while user signup", error);
        throw new Error(error.message || "Internal Server Errod");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        console.log("Error occured while login", error);
        throw new Error(error.message || "Internal Server Errod");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logout successfully" };
      } catch (error) {
        console.log("Error occured while logout", error);
        throw new Error(error.message || "Internal Server Errod");
      }
    },
  },
  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (error) {
        console.log("Error in user.transaction resolver", error);
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
};

export default userResolver;
