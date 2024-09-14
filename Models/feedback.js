import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
    UserDetail:{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
          imageLink: {
            type: String,
            required: true,
          },

    },
    CarName:{type:String, required:true},
    Feedback:{type:String, required:true}
})

export const feedback = mongoose.model('feedback', feedbackSchema)