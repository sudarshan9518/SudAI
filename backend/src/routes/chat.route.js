const express = require('express')
const authMiddleware  = require("../middlewares/auth.middleware")
const charController = require("../controllers/chat.controller")


const router = express.Router()


router.post('/',authMiddleware.authUser, charController.createChat )

/* GET /api/chat/ */
router.get('/', authMiddleware.authUser, charController.getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware.authUser, charController.getMessages)

/* DELETE /api/chat/:id */
router.delete('/:id', authMiddleware.authUser, charController.deleteChat)

module.exports = router; 