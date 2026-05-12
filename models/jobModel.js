const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,

    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
    },
    jobtype: {
        type: String,
        default:"full-time"
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},
{timestamps:true}
)
const jobs=mongoose.model("jobs",jobSchema)
module.exports=jobs