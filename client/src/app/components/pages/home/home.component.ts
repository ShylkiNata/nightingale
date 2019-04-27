﻿import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Employee, User, Table } from '../../../core/models';
import { EmployeeService } from '../../../core/services';
import { EmployeeModalComponent } from '../../particles';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from "@angular/forms";

import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    fa: Object = {
        plus: faPlus,
        edit: faEdit,
        remove: faTrash
    };

    employees: Employee[] = [];
    table:Table = new Table();
    filter = new FormControl('');

    constructor(private employerService: EmployeeService,
                private modalService: NgbModal) {

        this.filter.valueChanges.pipe().subscribe(text => {
            this.table.page = 1;
            this.table.search = text;
            this.fetchEmployeeList();
        });
    }

    ngOnInit() {
        this.fetchEmployeeList();
    }

    private async fetchEmployeeList() {
        this.employerService.search(this.table).pipe(first()).subscribe(data => {
            this.employees = data.docs;

            let table = this.table;
            this.table = (({ docs, ...table }) => ({...table}))(data)
        });
    }

    private updatePage(page: number) {
        this.table.page = page;
        this.fetchEmployeeList();
    }

    open(employee:Employee = new Employee()) {
        const modalRef = this.modalService.open(EmployeeModalComponent);
        modalRef.componentInstance.updateEmployeeList.subscribe(() => {
            this.fetchEmployeeList().then(() => {
                modalRef.close();
            });
        });
        modalRef.componentInstance.employee = employee;
    }

    delete(id: number) {
        this.employerService.delete(id).pipe(first()).subscribe(() => {
            this.fetchEmployeeList();
        });
    }
}