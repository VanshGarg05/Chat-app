import express from "express"
import {protectRoute} from "../middleware/auth.js"
import { getMessages, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/message.controller.js"


const router = express.Router()


router.route('/users').get(protectRoute,getUserForSidebar)
router.route('/:id').get(protectRoute,getMessages)
router.route('/mark/:id').put(protectRoute,markMessageAsSeen)
router.route('/send/:id').post(protectRoute,sendMessage)


export default router