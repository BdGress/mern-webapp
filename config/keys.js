module.exports = {
    mongoURI: process.env.MONGOURI || "mongodb+srv://dbUser:dbPassword@mern-webapp.e9a99.mongodb.net/mern-webapp?retryWrites=true&w=majority", 
    secretOrKey: process.env.SECRET || "secret",
    herokuToken: process.env.HEROKUTOKEN || "a53d4fa8-2d50-4897-aa8d-dc3dde79b52d"
};