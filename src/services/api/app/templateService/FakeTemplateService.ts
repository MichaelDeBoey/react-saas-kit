/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityDto } from "@/application/dtos/EntityDto";
import { ITemplateService } from "./ITemplateService";

export class FakeTemplateService implements ITemplateService {
  getAll(): Promise<EntityDto[]> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  get(_id: string): Promise<EntityDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  create(_data: EntityDto): Promise<EntityDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  download(_id: string): Promise<any> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  update(_id: string, _data: EntityDto): Promise<EntityDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  delete(_id: string): Promise<any> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
