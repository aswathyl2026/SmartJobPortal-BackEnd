const authController=require('../controllers/authController')
const userController=require('../controllers/userController')
const express=require('express')
const jobController = require('../controllers/jobController')
const authMiddleware=require('../middlewares/authMiddleware')
const roleMiddleware=require('../middlewares/roleMiddleware')
const applicationController=require('../controllers/applicationController')
const multerMiddleware = require('../middlewares/multerMiddleware')
const router=express.Router()
const imageMulter= require('../middlewares/imageMulter')
//register user
router.post('/register',authController.registerController)
//login user
router.post('/login',authController.loginController)

//----------- recruter------------------------------
//create job
router.post('/create-job',authMiddleware,roleMiddleware('recruiter'),jobController.jobCreateController)
//update job
router.put('/edit-job/:jobId',authMiddleware,roleMiddleware('recruiter'),jobController.jobUpdateController)
//delete job
router.delete('/delete-job/:jobId',authMiddleware,roleMiddleware('recruiter'),jobController.deleteJobController)
//view applicants by recruiter for specificejob
router.get('/applicant/:jobId',authMiddleware,roleMiddleware('recruiter'),applicationController.viewAppliedJobController)
//update status
router.put('/status/:appnId',authMiddleware,roleMiddleware('recruiter'),applicationController.updateApplicationController)
//view all created j0b
router.get('/myjobs',authMiddleware,roleMiddleware('recruiter'),jobController.allMyJobsController)
//view all applicants
router.get('/recruiter-all-applicants',authMiddleware,roleMiddleware('recruiter'),applicationController.getAllRecruiterApplicantsController)
//-------------------candidate-------------------------------------------
//apply job
router.post('/apply/:jobId',authMiddleware,roleMiddleware('candidate'),multerMiddleware.single('resume'),applicationController.applyJobController)
//all applied jobs view
router.get('/alljobs',authMiddleware,roleMiddleware('candidate'),applicationController.getAllApplicationController)
//single appln view




//------------accessed by all type of user-------------------------------------------
//view all jobs
router.get('/all-job',authMiddleware,roleMiddleware('recruiter','candidate','admin'),jobController.getAllJobController)
//view job by id
router.get('/job/:jobId',authMiddleware,roleMiddleware('recruiter','candidate','admin'),jobController.getJobController)

// update recruiter profile

router.put('/update-profile',authMiddleware,roleMiddleware('recruiter','candidate','admin'),imageMulter.single('picture'),userController.updateProfileController)
// reset password
router.put('/reset-password',authMiddleware,roleMiddleware('recruiter','candidate','admin'),userController.resetPasswordController)


module.exports=router