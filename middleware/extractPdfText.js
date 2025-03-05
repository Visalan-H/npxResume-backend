const pdfParse = require('pdf-parse')


const extractPdfText=async(req,res,next)=>{
    try {
        const data = await pdfParse(req.file.buffer);
        req.body.text=data.text;
        next();
        
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports=extractPdfText;