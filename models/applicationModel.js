const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"jobs"
    },
    status: {
        type: String,
        enum:["Applied","Shortlisted","Rejected"],
        default:"Applied"
    }
},
{timestamps:true}
)
const applications=mongoose.model("applications",applicationSchema)
module.exports=applications