const express = require('express')
const authMiddleware  = require("../middlewares/auth.middleware")
const charController = require("../controllers/chat.controller")


const router = express.Router()


router.post('/',authMiddleware.authUser, charController.createChat )



module.exports = router; 