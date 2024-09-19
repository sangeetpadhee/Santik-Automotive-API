import { Router } from "express";
import { FeedbackForm, UserFeedback, AllFeedbacksUploaded, deletefeedback } from "../Controllers/FeedbackController.js";


const router = Router()

router.post('/Feedback', FeedbackForm)
router.delete('/DeleteFeedback/:_id', deletefeedback)
router.get('/allfeedbacks/:UserId', UserFeedback)
router.get('/AllFeed', AllFeedbacksUploaded )

export default router