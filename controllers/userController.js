const users = require('../models/userModel')
const bcrypt = require('bcrypt')


// ================= UPDATE PROFILE =================

exports.updateProfileController = async (req, res) => {

    console.log("Inside updateProfileController")

    const userId = req.user.userId

    const { username, company, email } = req.body

    const profilePicture = req.file ? req.file.filename : ""

    const existingUser = await users.findById(userId)

    const updatedUser = await users.findByIdAndUpdate(
        { _id: userId },
        {
            username,
            company,
            email,
            picture: profilePicture || existingUser.picture
        },
        { new: true }
    )

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        data: updatedUser
    })

}

//============================ GET PROFILE=====================
exports.getProfileController = async (req, res) => {
    try {
        const userId = req.user.userId
        const user = await users.findById(userId).select('picture')
        if (!user) return res.status(404).json({ message: 'User not found' })

        res.status(200).json({
            success: true,
            picture: user.picture
                ? `${req.protocol}://${req.get('host')}/uploads/${user.picture}`
                : null
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ================= RESET PASSWORD =================

exports.resetPasswordController = async (req, res) => {

    console.log("Inside resetPasswordController")

    const userId = req.user.userId

    const { oldPassword, newPassword } = req.body

    const existingUser = await users.findById(userId)

    const isMatch = await bcrypt.compare(
        oldPassword,
        existingUser.password
    )

    if (!isMatch) {

        return res.status(400).json("Old Password Incorrect")

    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    existingUser.password = hashedPassword

    await existingUser.save()

    res.status(200).json({
        success: true,
        message: "Password Reset Successfully"
    })

}