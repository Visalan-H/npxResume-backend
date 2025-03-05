const {Schema,model}=require('mongoose');

const resumeSchema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    resumePdfText:{
        type:String,
        required:true,
    }
},{timestamps:true})

const Resume=model('Resume',resumeSchema);
module.exports=Resume;