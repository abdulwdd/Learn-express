const Emplpoyees = require("../model/Employees")

const getEveryEmployee = async(req, resp) => {
    const employ = await Employees.find();
    if(!employ) return resp.status(204).json({"message": "No employees found"})

    resp.json(employ);
};

const addNewEmployee = async (req, resp) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return resp.status(400).json({"message": "The first name and last name are required" })
    }
    
    try {
        const resultSave = await Employees.create({
            firstname: req.body.firstname,
            lastname: req.body.firstname
        });
        resp.status(201).json({"message": `Account for ${req.body.firstname} ${req.body.lastname} created`})
    } catch (error) {
        console.error(error)
    }
};



const updateEmployee = async (req, resp) => {
    if(!req?.body?.id) {
        return resp.status(400).json({"message":"ID parameter is required"});
    }
    const employee = await Employees.findOne({_id: req.body.id}).exec();

    if(!employee) {
        return resp.status(400).json({"message": `Employee ID ${req.body}`})
    }
    if (req.body.firstname) employee.firstname = req.body.firstname    
    if (req.body.lastname) employee.lastname = req.body.lastname
    
    const result = await employee.save();
    resp.json(result);
}

const deleteEmployee = async (req, resp) => {
   
   if(!req.body?.id) return resp.status(400).json({"message": "Employee ID required"});

   const employee = await Employees.findOne({_id: req.body.id}).exec();

    if(!employee) {
        return resp.status(400).json({"message": `Employee ID ${req.body.id} doesn't exist`});
    }

    const result = await employee.deleteOne({_id: req.body.id});
    resp.json(result)
}

const findAnEmployee = async (req, resp) => {
    if(!req?.params?.id) return resp.status(400).json({"message": "Employee ID required"});

   const employee = await Employees.findOne({ _id: req.params.id}).exec();
   if(!employee) {
    return resp.status(400).json({"message": `No employee with ${req.params.id} found on our database`});
   }
   resp.json(employee); 
}

module.exports = { getEveryEmployee, deleteEmployee, findAnEmployee, addNewEmployee, updateEmployee};
