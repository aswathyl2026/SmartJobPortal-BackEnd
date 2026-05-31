const users= require('../models/userModel')
const jobs = require('../models/jobModel')
const applications = require('../models/applicationModel')

// ── STATS ─────────────────────────────────────────────────────────
exports.getStatsController = async (req, res) => {
    try {
        console.log("Inside getStatsController")

        const [totalUsers, totalRecruiters, totalJobs, totalApplications] = await Promise.all([
            users.countDocuments({ role: 'candidate' }),
            users.countDocuments({ role: 'recruiter' }),
            jobs.countDocuments(),
            applications.countDocuments()
        ])

        res.status(200).json({
            success: true,
            message: "Stats fetched",
            data: { totalUsers, totalRecruiters, totalJobs, totalApplications }
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── USERS ─────────────────────────────────────────────────────────

// Get all candidates
exports.getAllUsersController = async (req, res) => {
    try {
        console.log("Inside getAllUsersController")

        const allUsers = await users
            .find({ role: 'candidate' })
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "All users fetched",
            data: allUsers
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// Delete a user
exports.deleteUserController = async (req, res) => {
    try {
        console.log("Inside deleteUserController")

        const { userId } = req.params

        const deletedUser = await users.findByIdAndDelete(userId)
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Also delete all applications by this user
        await applications.deleteMany({ candidate: userId })

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// Block / Unblock a user  (status field is Boolean in your model: true=active, false=blocked)
exports.toggleBlockUserController = async (req, res) => {
    try {
        console.log("Inside toggleBlockUserController")

        const { userId } = req.params

        const user = await users.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        user.status = !user.status   // true → false (block) or false → true (unblock)
        await user.save()

        res.status(200).json({
            success: true,
            message: `User ${user.status ? 'unblocked' : 'blocked'} successfully`,
            data: user
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── RECRUITERS ────────────────────────────────────────────────────

// Get all recruiters
exports.getAllRecruitersController = async (req, res) => {
    try {
        console.log("Inside getAllRecruitersController")

        const allRecruiters = await users
            .find({ role: 'recruiter' })
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "All recruiters fetched",
            data: allRecruiters
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── JOBS ──────────────────────────────────────────────────────────

// Get all jobs (admin sees everything)
exports.adminGetAllJobsController = async (req, res) => {
    try {
        console.log("Inside adminGetAllJobsController")

        const allJobs = await jobs
            .find()
            .populate('recruiter', 'username email company')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "All jobs fetched",
            data: allJobs
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// Delete a job (admin)
exports.adminDeleteJobController = async (req, res) => {
    try {
        console.log("Inside adminDeleteJobController")

        const { jobId } = req.params

        const deletedJob = await jobs.findByIdAndDelete(jobId)
        if (!deletedJob) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }

        // Also delete all applications for this job
        await applications.deleteMany({ job: jobId })

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            data: deletedJob
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── APPLICATIONS ──────────────────────────────────────────────────

// Get all applications (admin sees everything)
exports.adminGetAllApplicationsController = async (req, res) => {
    try {
        console.log("Inside adminGetAllApplicationsController")

        const allApplications = await applications
            .find()
            .populate('candidate', 'username email')
            .populate('job', 'title company location salary jobtype')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "All applications fetched",
            data: allApplications
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// Delete an application (admin)
exports.adminDeleteApplicationController = async (req, res) => {
    try {
        console.log("Inside adminDeleteApplicationController")

        const { appId } = req.params

        const deletedApp = await applications.findByIdAndDelete(appId)
        if (!deletedApp) {
            return res.status(404).json({ success: false, message: "Application not found" })
        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully",
            data: deletedApp
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}
