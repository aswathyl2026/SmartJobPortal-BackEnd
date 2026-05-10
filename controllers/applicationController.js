const applications = require('../models/applicationModel')
const jobs = require('../models/jobModel')

//candidate apply for job
exports.applyJobController = async (req, res) => {
    console.log("Inside applyJobController");
    const candidate = req.user.userId
    const { jobId } = req.params

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
        candidate,job:jobId
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
    }).populate("job")
    res.status(200).json({
        success:true,
        message:"Fetched all jobs applied",
        data:allAppliedJobs
    }) 
}
//recruiter view of job applied by candidate
exports.viewAppliedJobController=async(req,res)=>{
    console.log("Inside viewAppliedJobControlle");
    const recruiter=req.user.userId
    const {jobId}=req.params
    const jobApplied=await jobs.findById(jobId)
    if(!jobApplied){
      return  res.status(409).json("Job Not Found")
    }
    //recruiter check
    if(jobApplied.recruiter.toString()!==recruiter){
      return   res.status(409).json("Acess denied")
    }

    const applicants=await applications.find({job:jobId}).populate("job").populate("candidate")
    res.status(200).json({
        success:true,
        message:"all applicant fetched",
        data:applicants
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