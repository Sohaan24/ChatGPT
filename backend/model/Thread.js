const mongoose = require("mongoose");
const Schema = mongoose.Schema ;


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
    
},{
    timestamps : true
});

const Thread  =  mongoose.model("Thread", threadSchema) ;

module.exports = Thread ;