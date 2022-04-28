import { CreateEmployeesRequest } from "@/application/contracts/app/employees/CreateEmployeesRequest";
import { UpdateEmployeeRequest } from "@/application/contracts/app/employees/UpdateEmployeeRequest";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";

export interface IEmployeeService {
  getAll(): Promise<EmployeeDto[]>;
  get(id: string): Promise<EmployeeDto>;
  createMultiple(data: CreateEmployeesRequest): Promise<EmployeeDto[]>;
  update(id: string, data: UpdateEmployeeRequest): Promise<EmployeeDto>;
  delete(id: string): Promise<any>;
}
