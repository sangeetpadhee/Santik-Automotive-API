import { feedback } from "../Models/feedback.js";
import { User } from "../Models/user.js";

export const FeedbackForm = async(req,res)=>{
    try{
    const{UserId, CarName, Feedback} = req.body
    const UserFind = await User.findById(UserId);
    if(!UserFind){
        return res.status(404).json({ message: 'User not found' });
     }
     const defaultImageUrl = "https://cdn-icons-png.flaticon.com/512/3293/3293466.png";
    const newFeedback = new feedback({
        UserDetail: {
        userId: UserFind._id,
        name: UserFind.name,
        email: UserFind.email,
        imageLink: UserFind.profileImg || defaultImageUrl,
      }, 
      CarName, Feedback
    });
    await newFeedback.save()
    res.status(201).json({message:"Feedback Sumbitted Successfully", newFeedback})
    }catch(error){
        console.error(error)
        res.status(404).json({message:"Server Error"})
    }
}

export const UserFeedback=async(req,res)=>{
    try{
        const{UserId} = req.params;
        const Allfeedback = await feedback.find({'UserDetail.userId':UserId})
        if(!Allfeedback){
            return res.json({message:"Your Feedback Is Empty"})
        }
        res.json({message:"Feedback Fetched Successfully", feedback: Allfeedback})
    }catch(error){
        console.error(error);
        res.status(404).json({message:"Server Error"})
    }
}

export const deletefeedback = async(req,res)=>{
    try{
        const {_id} = req.params
        const deletefeed = await feedback.findById({_id})
        if(!deletefeed){
            return res.json({message:"Your Feedback Is Empty"})
        }
        await deletefeed.deleteOne()
        res.json({message:"Feedback Deleted Successfully", deletefeed})
    }catch(error){
        console.error(error)
        res.status(404).json({message:"Server Error"})
    }
}
export const AllFeedbacksUploaded = async(req,res)=>{
    try {
        const allfeed = await feedback.find(); // Fetch all feedback
        if (allfeed.length === 0) {
          return res.json({ message: "No feedback available." });
        }
        res.json({ message: "Feedback fetched successfully", feedback: allfeed });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
}