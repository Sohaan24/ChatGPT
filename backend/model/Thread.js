const mongoose = require("mongoose");
const {Schema} = mongoose;

const messageSchema = new Schema({
    role : {
        type : String,
        enum : ["user", "assistant"],
        required : true
    },
    content : {
        type : String,
        required : true 
    }
});

const threadSchema = new Schema({
    title : String,
    messages : [messageSchema],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true ,
    }
    
},{
    timestamps : true
});

module.exports  =  mongoose.model("Thread", threadSchema) ;

