const express = require('express');
const router = express.Router();
const { handleUserLogin } = require('../controllers/loginController');  

router.post("/", handleUserLogin);

module.exports = router;  
