import { DatePipe } from '@angular/common';

export class SM {
  id!: number;

  activity!: string;
  impactedService!: string;

  // Planned
  plannedStartDate!: string; // or Date if you parse it
  plannedEndDate!: string;

  // Actual
  actualStartDate?: string | null;
  actualEndDate?: string | null;

  department!: string;
  status!: string | null;
  email?: string;
  csrf?: string;

  // UI-only helpers
  submitted?: boolean;
  selected?: boolean;
  actionsSelected?: string[];

  // New fields
  comments?: string;
  template?: string;
  crqTicket?: string;
  rag?: string;

  constructor() {
    this.email = '';
    this.department = '';
    this.activity = '';
    this.csrf = '';
    this.impactedService = '';
    this.plannedStartDate = '';
    this.plannedEndDate = '';
    this.status = '';
    this.actionsSelected = [];
    this.comments = '';
    this.template = '';
    this.actualStartDate = null;
    this.actualEndDate = null;
    this.crqTicket = '';
    this.rag = '';
  }
}

