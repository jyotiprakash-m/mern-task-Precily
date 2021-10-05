const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    empId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }

}, { timestamps: true })

module.exports = mongoose.model("Employee", EmployeeSchema)