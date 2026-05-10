const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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