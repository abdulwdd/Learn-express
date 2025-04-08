const express = require('express');
const router = express.Router();
const {
    getEveryEmployee, addNewEmployee, findAnEmployee, deleteEmployee, updateEmployee
} = require("../../controllers/employeeController");

// router.route('/')
// .get(getEveryEmployee)
//.post(verifyAllRoles)
// .post(addNewEmployee)
// .delete(deleteEmployee)


router.route('/')
.get(getEveryEmployee)

.post(addNewEmployee)
.put(updateEmployee)
.delete(deleteEmployee)

router.route("/:id")
.get(findAnEmployee)
module.exports = router;