const jobs=require("../models/jobModel")
const { GoogleGenerativeAI } = require("@google/generative-ai")
//job creation
exports.jobCreateController=async (req,res)=>{
    console.log("Inside jobCreateController");
    const {title,company,location,description,salary,requirements,
        jobtype}=req.body
    const recruiter=req.user.userId 
    const existingJob=await jobs.findOne({title,company,location})
    if(existingJob){
        res.status(400).json("The Job is alredy posted")
    }else{
        const newJob=await jobs.create({
            title,company,location,description,salary,requirements,jobtype,recruiter
        })
        res.status(201).json({
            status:true,
            message:"Jop Posted Successfully",
            data:newJob
        })
    }
    
}

//get all job by recruiter
exports.allMyJobsController=async (req,res)=>{
    console.log("Inside allMyJobsController");
    const recruiter=req.user.userId 
    const myJob=await jobs.find({recruiter})
    if(!myJob){
        res.status(400).json("Thre is no job...Lets Add One")
    }else{
       
        res.status(200).json({
            status:true,
            message:"Job fetched",
            data:myJob
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
exports.jobUpdateController = async (req, res) => {

    console.log("Inside jobUpdateController");

    const {

        title,
        company,
        location,
        description,
        salary,
        requirements,
        recruiter,
        jobtype

    } = req.body

    const { jobId } = req.params

    const updatedJob = await jobs.findByIdAndUpdate(

        { _id: jobId },

        {

            title,
            company,
            location,
            description,
            salary,
            requirements,
            recruiter,
            jobtype

        },

        { new: true }

    )

    res.status(200).json({

        status: true,

        message: "Job Updated Successfully",

        data: updatedJob

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

exports.generateAIJobController = async (req, res) => {
    try {
        console.log("Inside generateAIJobController")

        const { title, company, location, requirements } = req.body

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }

        const genAPI = new GoogleGenerativeAI(process.env.GEMINI_API)

        const model = genAPI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const prompt = `
            Write a professional job description for the following role:
            - Job Title: ${title}
            ${company     ? `- Company: ${company}`           : ""}
            ${location    ? `- Location: ${location}`         : ""}
            ${requirements? `- Requirements: ${requirements}` : ""}

            Include:
            1. A brief overview of the role (2-3 sentences)
            2. Key responsibilities (4-5 bullet points)
            3. Required qualifications (3-4 bullet points)

            Keep it professional and under 250 words.
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            return res.status(500).json({
                success: false,
                message: "AI returned empty response"
            })
        }

        return res.status(200).json({
            success: true,
            content: text
        })

    } catch (error) {
        console.error("GEMINI ERROR:", error.message)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
