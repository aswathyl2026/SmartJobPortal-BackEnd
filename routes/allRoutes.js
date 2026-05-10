const authController=require('../controllers/authController')
const express=require('express')
const jobController = require('../controllers/jobController')
const authMiddleware=require('../middlewares/authMiddleware')
const roleMiddleware=require('../middlewares/roleMiddleware')
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

//------------accessed by all type of user-------------------------------------------
//view all jobs
router.get('/all-job',authMiddleware,roleMiddleware('recruiter','candidate','admin'),jobController.getAllJobController)
//view job by id
router.get('/job/:jobId',authMiddleware,roleMiddleware('recruiter','candidate','admin'),jobController.getJobController)



module.exports=router