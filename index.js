const app = require("./app")


app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port 3000");
});
// DB_URL=mongodb+srv://parcelwalaa:parcelwalaa@cluster0.fl2at.mongodb.net/?retryWrites=true&w=majority