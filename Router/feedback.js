import { Router } from "express";
import { FeedbackForm, UserFeedback, AllFeedbacksUploaded } from "../Controllers/FeedbackController.js";


const router = Router()

router.post('/Feedback', FeedbackForm)
router.get('/allfeedbacks/:UserId', UserFeedback)
router.get('/AllFeed', AllFeedbacksUploaded )

export default router