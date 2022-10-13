const mongoose = require ('mongoose');

const ProfileSchema = new mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pic: {
        type: mongoose.Schema.Types.String,
        required: true
    }
});

const Profile = mongoose.model("profile", ProfileSchema);

module.exports = Profile