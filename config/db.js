const mongoose=require("mongoose")
const connectionString=process.env.DBCONNECTION

mongoose.connect(connectionString).then(res=>{
    console.log("DataBase connected Successfully");
    
}).catch(error=>{
    console.log("DataBase connection failed");
    console.log(error);
    
})