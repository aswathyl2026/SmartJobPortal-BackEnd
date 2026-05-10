const authController=require('../controllers/authController')
const express=require('express')
const jobController = require('../controllers/jobController')
const authMiddleware=require('../middlewares/authMiddleware')
const roleMiddleware=require('../middlewares/roleMiddleware')
const applicationController=require('../controllers/applicationController')
const router=express.Router()

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
//-------------------candidate-------------------------------------------
//apply job
router.post('/apply/:jobId',authMiddleware,roleMiddleware('candidate'),applicationController.applyJobController)
//all applied jobs view
router.get('/alljobs',authMiddleware,roleMiddleware('candidate'),applicationController.getAllApplicationController)


//------------accessed by all type of user-------------------------------------------
//view all jobs
router.get('/all-job',authMiddleware,roleMiddleware('recruiter','candidate','admin'),jobController.getAllJobController)
//view job by id
router.get('/job/:jobId',authMiddleware,roleMiddleware('recruiter','candidate','admin'),jobController.getJobController)



module.exports=router