const router = require("express").Router();
const _ = require("lodash");
const authorize = require("../middleware/authorize");
const { Profile } = require("../models/profile");
// const { setProfile } = require("../controllers/profileController");

// module.exports.getProfile = async (req, res) => {
//     const userId = req.user._id;
//     const profile = await Profile.findOne({ user: userId });
//     return res.status(200).send(profile);
// };

const setProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const userProfile = _.pick(req.body, [
            "phone",
            "address1",
            "address2",
            "city",
            "state",
            "postcode",
            "country",
        ]);
        userProfile["user"] = userId;
        let profile = await Profile.findOne({ user: userId });
        if (profile) {
            await Profile.updateOne({ user: userId }, userProfile);
        } else {
            profile = new Profile(userProfile);
            await profile.save();
        }

        return res.status(200).send("Profile Updated Successfully");
    } catch (err) {
        console.log(err);
    }
};

router.route("/").post(authorize, setProfile);

module.exports = router;
