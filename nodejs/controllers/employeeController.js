const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Employee } = require('../models/employee');

// GET => localhost:3000/employees/
router.get('/', (req,res) => {
  
  console.log('Processing GET all employees');
  Employee.find((err,docs) => {
    if (!err) {
      console.log('GET got all emplyeed');
      res.send(docs);
    }
    else {
      console.log('Error in GETting all employees: ' +
      JSON.stringify(err,undefined,2));
    }
    console.log('\n');
    });
  console.log('\n');
});

// GET => localhost:3000/employees/<ID>
router.get('/:id', (req,res) => {
  console.log('Processing GET specific employee' + `${req.params.id}` );
  if ( !ObjectId.isValid(req.params.id) ) {
    console.log('Cant GET specific employee, Invalid id');
    return res.status(400).send( `Invalid id : ${req.params.id}` );
  }

  Employee.findById(req.params.id, (err,doc) => {
    if (!err) { res.send(doc); }
    else {
      console.log('Error in GETtting specific employee: ' +
       JSON.stringify(err,undefined,2));
    }
    console.log('\n');
  });
  console.log('\n');
});

// POST => localhost:3000/employees/
router.post('/', ( req,res) => {

  console.log('Processing POST (add)');
  //console.log(JSON.stringify(req));
  var emp = new Employee({
    name: req.body.name,
    position: req.body.position,
    office: req.body.office,
    salary: req.body.salary
  });
  // mongoos wil return an error in err
  // or the doc object filling it with the properties/fields (name, position, ...)
  //  of the Employee object and also an Id that it auto generated
  emp.save((err,doc) => {
    if ( !err ) { 
      console.log('POST New emplyeed saved');
      console.log(JSON.stringify(doc));
      res.send(doc); }
    else {
      console.log('POST Error in New Employee save: ' +
        JSON.stringify(err,undefined,2));
    }
    console.log('\n');
   });
  console.log('\n');
});

// PUT => localhost:3000/employees/<ID>
router.put('/:id', (req,res) => {
  if ( !ObjectId.isValid(req.params.id) ) {
    console.log('Cant PUT, Invalid id '+ `${req.params.id}`);
    return res.status(400).send( `Invalid id : ${req.params.id}` );
  }

  var emp = {
    name: req.body.name,
    position: req.body.position,
    office: req.body.office,
    salary: req.body.salary
  };

  // new means the doc will hold the updated record
  Employee.findByIdAndUpdate(req.params.id, { $set: emp}, { new : true }, 
     (err,doc) => {
    if (!err) {
      console.log('PUT Existing employee edited');
      console.log(JSON.stringify(doc));
       res.send(doc);
    }
    else {
      console.log('PUT Error in retriving employee for editing: ' +
       JSON.stringify(err,undefined,2));
    }
    console.log('\n');
  });
  console.log('\n');
});

// DELETE => localhost:3000/employees/<ID>
router.delete('/:id', (req,res) => {
  if ( !ObjectId.isValid(req.params.id) ) {
    console.log('Cant DELETE, Invalid id'+ `${req.params.id}`);
    return res.status(400).send( `Invalid id : ${req.params.id}` );
  }

  // new means the doc will hold the updated record
  Employee.findByIdAndRemove(req.params.id, (err,doc) => {
    if (!err) {
      res.send(doc);
      console.log('DELETE Existing employee deleted');
      console.log(JSON.stringify(doc));
    }
    else {
      console.log('Error in DELETE: ' +
       JSON.stringify(err,undefined,2));
    }
    console.log('\n');
  });
  console.log('\n');
});

module.exports = router;
