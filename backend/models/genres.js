
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Genre", genreSchema);
