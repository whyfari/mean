import { Component, OnInit } from '@angular/core';

import { EmployeeService } from '../shared/employee.service';
import { NgForm } from '@angular/forms';

import { Employee } from '../shared/employee.model';
import { isNullOrUndefined } from 'util';

declare var M : any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers : [EmployeeService]
})

export class EmployeeComponent implements OnInit {

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.resetForm();
    this.refreshEmployeeList();
  }

  resetForm ( form?: NgForm ) {
  
    if ( form ) {
      form.reset();
    }

    // TODO_FA why?
    // for some reason, the field is valid even when empty, but when it's 'touched'
    // (which does happen when we do this)
    // and still empty, then it becomes ng-dirty or something but also invalid
    // and then the whole form becomes invalid?
    // so then our submit button is disabled because it checks the form's validity
    this.employeeService.selectedEmployee = {
        _id : "",
        name : "",
        position : "",
        office : "",
        salary:  null
    };
  }

  onSubmit( form : NgForm ) {
    //if ( form.value._id == "" ) {
    //DEBUG_FA having issues with this value being null when it should be just empty?
    // so adding null check
    if ( form.value._id == "" || isNullOrUndefined(form.value._id) ) {
        console.log('POSTting: (adding) ' + JSON.stringify(form.value));
        this.employeeService.postEmployee(form.value).subscribe((res) => {
          console.log('POST (add) sucessful');
          this.resetForm(form);
          this.refreshEmployeeList();
          M.toast({ html: 'Saved sucessfully', classes: 'rounded' });
        });
    } else {
        console.log('PUTting (editing) ' + JSON.stringify(form.value));
        this.employeeService.putEmployee(form.value).subscribe((res) => {
          console.log('PUT (edit) sucessfull');
          this.resetForm(form);
          this.refreshEmployeeList();
          M.toast({ html: 'Updated sucessfully', classes: 'rounded' });
        });
    }
  }

  refreshEmployeeList() {
    console.log('GETtting employees list');
    this.employeeService.getEmployeeList().subscribe((res) => {
      console.log('GET (got) list sucessful');
      this.employeeService.employees = res as Employee[];
    });
  }

  onEdit( emp: Employee ) {
    this.employeeService.selectedEmployee = emp;
  }
  
  onDelete( _id: string, form : NgForm ) {
    //if ( confirm ('Are you sure you want to delete this record?') ) {
    if ( true ) {
       console.log('DELETing: ' + _id); 
       this.employeeService.deleteEmployee(_id).subscribe((res) => {
          console.log('DELETE successful ');
          this.resetForm(form);
          this.refreshEmployeeList();
          M.toast({ html: 'Deleted sucessfully', classes: 'rounded' });
       }); 
    }
  }

}
