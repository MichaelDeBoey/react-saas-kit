import { CreateEmployeesRequest } from "@/application/contracts/app/employees/CreateEmployeesRequest";
import { UpdateEmployeeRequest } from "@/application/contracts/app/employees/UpdateEmployeeRequest";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import { ApiService } from "../../ApiService";
import { IEmployeeService } from "./IEmployeeService";

export class EmployeeService extends ApiService implements IEmployeeService {
  constructor() {
    super("Employee");
  }
  getAll(): Promise<EmployeeDto[]> {
    return super.getAll("GetAll");
  }
  get(id: string): Promise<EmployeeDto> {
    return super.get("Get", id);
  }
  createMultiple(data: CreateEmployeesRequest): Promise<EmployeeDto[]> {
    return super.post(data, "CreateMultiple");
  }
  // download(id: string): Promise<any> {
  //   return super.download(undefined, "Download/" + id);
  // }
  update(id: string, data: UpdateEmployeeRequest): Promise<EmployeeDto> {
    return super.put(id, data, "Update");
  }
  delete(id: string): Promise<any> {
    return super.delete(id);
  }
}
