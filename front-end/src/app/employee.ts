import { DatePipe } from '@angular/common';

export class Employee {
    id!: number;
    activity: string;
  impactedService: string;
  startDate: string; // use Date if needed
  endDate: string;
  department: string;
  status: string | null;
  email?: string;
  csrf?: string;
  submitted?: boolean;
  selected?: boolean;



  constructor() {
    // this.id = 0;
    // // this.fname="";
    // this.lname="";
    this.email="";
    this.department=""
    this.activity="";
    this.csrf="";
    this.impactedService="";
    this.startDate="";
    this.endDate="";
   this.status="";
    // this.joiningDate = new Date();
  //  // Set the default date value
  //  const today = new Date();
  //  const year = today.getFullYear();
  //  const month = ('0' + (today.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
  //  const day = ('0' + today.getDate()).slice(-2);

  //  this.joiningDate = `${year}-${month}-${day}`;
}}
