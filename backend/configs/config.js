

import dotenv from "dotenv";

dotenv.config();

const configs = {
    dbURL: process.env.MONGO_URL,
    googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    googleAuthClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    googleAuthServerCallbackURL: process.env.GOOGLE_AUTH_SERVER_CALLBACK,
    googleAuthClientSuccessURL: process.env.GOOGLE_AUTH_CLIENT_URL_SUCCESS,
};

export default configs;
