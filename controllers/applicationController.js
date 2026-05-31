const applications = require('../models/applicationModel')
const jobs = require('../models/jobModel')

//candidate apply for job
exports.applyJobController = async (req, res) => {
    console.log("Inside applyJobController");
    const candidate = req.user.userId
    const { jobId } = req.params
    const resume=req.file.filename
    // check job is still in jobs
    const job = await jobs.findById(jobId)
    if (!job) {
        return res.status(409).json("No Job Found!!!!")
    }
    //check wwheather  alredy applied or not
    const existingApplication = await applications.findOne({
        candidate, job: jobId
    })
    if (existingApplication) {
        return res.status(409).json("You are alredy applied")
    }

    const newApplication= new applications({
        candidate,job:jobId,resume,status:"Applied"
    })
    await newApplication.save()
    res.status(201).json({
        success:true,message:"You have Applied",data:newApplication
    })
}

//candidate view my applications
exports.getAllApplicationController=async(req,res)=>{
    console.log("Inside getAllApplicationController");
    const candidate=req.user.userId
    const allAppliedJobs=await applications.find({
        candidate
    }).populate("job").populate("candidate")
    res.status(200).json({
        success:true,
        message:"Fetched all jobs applied",
        data:allAppliedJobs
    }) 
}
//recruiter view of job applied by candidate
exports.viewAppliedJobController = async (req, res) => {
    console.log("Inside viewAppliedJobController")

    const recruiter = req.user.userId
    const { jobId } = req.params

    const jobApplied = await jobs.findById(jobId)

    if (!jobApplied) {
        return res.status(409).json("Job Not Found")
    }

    if (jobApplied.recruiter.toString() !== recruiter) {
        return res.status(409).json("Access denied")
    }

    const applicants = await applications.find({
        job: jobId
    })
    .populate("job")
    .populate("candidate")

    const updatedApplicants = applicants.map((item) => ({
        ...item.toObject(),
        resumeUrl: item.resume
            ? `${req.protocol}://${req.get("host")}/uploads/${item.resume}`
            : null
    }))

    res.status(200).json({
        success: true,
        message: "all applicant fetched",
        data: updatedApplicants
    })
}
//update staus of applicant
exports.updateApplicationController=async(req,res)=>{
    console.log("Inside updateApplicationController");
    const recruiter=req.user.userId
    const {appnId}=req.params
    const {status}=req.body
    
    const application=await applications.findById(appnId)
    const jobApplied=await jobs.findById(application.job)
    console.log(application);
    
    if(!application){
      return  res.status(409).json("application Not Found")
    }

     if(!jobApplied){
      return  res.status(409).json("Job Not Found")
    }
    //recruiter check
    if(jobApplied.recruiter.toString()!==recruiter){
      return   res.status(409).json("Acess denied")
    }

    const statusApplicant=await applications.findByIdAndUpdate(appnId,{status},{new:true}).populate("job").populate("candidate")
    res.status(200).json({
        success:true,
        message:"all applicant fetched",
        data:statusApplicant
    })
    
}
//all applicants

exports.getAllRecruiterApplicantsController = async (req, res) => {

    console.log("Inside getAllRecruiterApplicantsController")

    const recruiterId = req.user.userId

    const recruiterJobs = await jobs.find({
        recruiter: recruiterId
    })

    const jobIds = recruiterJobs.map((item) => item._id)

    const applicants = await applications.find({
        job: { $in: jobIds }
    })
    .populate("candidate")
    .populate("job")
    .sort({ createdAt: -1 })

    const updatedApplicants = applicants.map((item) => ({
        ...item.toObject(),
        resumeUrl: item.resume
            ? `${req.protocol}://${req.get("host")}/uploads/${item.resume}`
            : null
    }))

    res.status(200).json({
        success: true,
        message: "All applicants fetched successfully",
        data: updatedApplicants
    })
}

