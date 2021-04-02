module.exports = {
    mongoURI: process.env.MONGODB_URI || "mongodb+srv://dbUser:dbPassword@mern-webapp.e9a99.mongodb.net/mern-webapp?retryWrites=true&w=majority", 
    secretOrKey: process.env.SECRET || "secret"
};