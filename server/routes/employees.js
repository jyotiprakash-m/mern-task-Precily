const router = require('express').Router();

const Employee = require("../models/Employee")

// Create Employee 
router.post('/', async (req, res) => {
    const newEmployee = new Employee(req.body);
    try {
        const saveEmployee = await newEmployee.save()
        res.status(200).json(saveEmployee)
    } catch (err) {
        res.status(500).json(err)
    }
})


// Get All Employee

router.get("/", async (req, res) => {
    try {
        let employees = await Employee.find()
        res.status(200).json(employees)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get Employee by ID

router.get("/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.status(200).json(employee)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete the employee 

router.delete("/:id", async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    try {
        await employee.delete();
        res.status(200).json("Employee has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }

});


// Update Employee

router.put("/:id", async (req, res) => {

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(500).json(err);
    }


});

module.exports = router;