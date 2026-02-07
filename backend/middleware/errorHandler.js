const errorHandler = async(err, req, res, next)=>{
    console.log("Error Stack :", err.stack) ;
    const errStatus = res.statusCode === 200 ? 500 : res.statusCode ;

    res.status(errStatus).json({
        success : false ,
        message : err.message || "Internal Server Error" ,
        errorStack : process.env.NODE_ENV === "production" ? null : err.stack ,
    }); 
};

module.exports = errorHandler ;