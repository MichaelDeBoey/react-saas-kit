/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateEmployeesRequest } from "@/application/contracts/app/employees/CreateEmployeesRequest";
import { UpdateEmployeeRequest } from "@/application/contracts/app/employees/UpdateEmployeeRequest";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import { FakeUserService } from "../../core/users/FakeUserService";

import { IEmployeeService } from "./IEmployeeService";

const fakeUserService = new FakeUserService();

const fakeEmployees = [
  { firstName: "Charles", lastName: "Gilliam Wiebe", email: "charles@company.com" },
  { firstName: "Geneva", lastName: "Denis Tompson", email: "geneva@company.com" },
  { firstName: "Carol", lastName: "Harrington Hunter", email: "carol@company.com" },
  { firstName: "Kevin", lastName: "Calderon Hodge", email: "kevin@company.com" },
  { firstName: "Betty", lastName: "Houston Walters", email: "betty@company.com" },
  { firstName: "Richard", lastName: "Fleming Smith", email: "richard@company.com" },
  { firstName: "Brenda", lastName: "Rice Torres", email: "brenda@company.com" },
  { firstName: "Mark", lastName: "Gil Halsey", email: "mark@company.com" },
  { firstName: "Christy", lastName: "Nolte Meyerson", email: "christy@company.com" },
  { firstName: "Brandi", lastName: "Salazar Wilmore", email: "brandi@company.com" },
];
const employees: EmployeeDto[] = [];
for (let index = 1; index <= 10; index++) {
  const employee: EmployeeDto = {
    createdByUserId: fakeUserService.users[0].id,
    createdByUser: fakeUserService.users[0],
    createdAt: new Date(),
    id: (index + 300).toString(),
    firstName: fakeEmployees[index - 1].firstName,
    lastName: fakeEmployees[index - 1].lastName,
    email: fakeEmployees[index - 1].email,
  };
  employees.push(employee);
}

export class FakeEmployeeService implements IEmployeeService {
  employees: EmployeeDto[] = employees;
  getAll(): Promise<EmployeeDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(employees);
      }, 500);
    });
  }
  get(id: string): Promise<EmployeeDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const employee = this.employees.find((f) => f.id === id);
        if (employee) {
          resolve(employee);
        } else {
          reject();
        }
      }, 500);
    });
  }
  createMultiple(data: CreateEmployeesRequest): Promise<EmployeeDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        data.employees.forEach((element) => {
          element.id = (this.employees.length + 1).toString();
          this.employees.push(element);
        });
        resolve(data.employees);
      }, 500);
    });
  }
  update(id: string, data: UpdateEmployeeRequest): Promise<EmployeeDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = this.employees.find((f) => f.id?.toString() === id);
        if (item) {
          item.firstName = data.firstName;
          item.lastName = data.lastName;
          item.email = data.email;
          resolve(item);
        } else {
          reject();
        }
      }, 500);
    });
  }
  delete(_id: string): Promise<any> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
