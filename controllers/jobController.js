const jobs=require("../models/jobModel")

//job creation
exports.jobCreateController=async (req,res)=>{
    console.log("Inside jobCreateController");
    const {title,company,location,description,salary,requirements}=req.body
    const recruiter=req.user.userId 
    const existingJob=await jobs.findOne({title,company,location})
    if(existingJob){
        res.status(400).json("The Job is alredy posted")
    }else{
        const newJob=await jobs.create({
            title,company,location,description,salary,requirements,recruiter
        })
        res.status(201).json({
            status:true,
            message:"Jop Posted Successfully",
            data:newJob
        })
    }
    
}
//get each  job accessed by all type of user
exports.getJobController=async(req,res)=>{
    console.log("Inside getJobController");
    const {jobId}=req.params
    const Job=await jobs.findById(jobId)
    console.log(Job);
    

     res.status(200).json({
            success:true,
            message:" Jobs is Fetched",
            data:Job
        })
    
   
}
//get all jobs accessed by all type of user
exports.getAllJobController=async(req,res)=>{
    console.log("Inside getJobController");
    const allJob=await jobs.find()
    if(allJob){
        res.status(200).json({
            success:true,
            message:"All Jobs Fetched",
            data:allJob
        })
    }
}
//update job
exports.jobUpdateController=async (req,res)=>{
    console.log("Inside jobUpdateController");
    const {title,company,location,description,salary,requirements,recruiter}=req.body
    const {jobId}=req.params
    
        const updatedJob=await jobs.findByIdAndUpdate({_id:jobId},{
            title,company,location,description,salary,requirements,recruiter
        },{new:true})
        res.status(200).json({
            status:true,
            message:"Jop Posted Successfully",
            data:updatedJob
        })
    
    
}
//delete job
exports.deleteJobController=async(req,res)=>{
    const {jobId}=req.params
    const deletedJob=await jobs.findByIdAndDelete({_id:jobId})
    res.status(200).json({
        success:true,
        message:"Job Deleted Suceessfully",
        data:deletedJob
    })
}