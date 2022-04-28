import { EntityDto } from "@/application/dtos/EntityDto";
import { ApiService } from "../../ApiService";
import { ITemplateService } from "./ITemplateService";

export class TemplateService extends ApiService implements ITemplateService {
  constructor() {
    super("Template");
  }
  getAll(): Promise<EntityDto[]> {
    return super.getAll("GetAll");
  }
  get(id: string): Promise<EntityDto> {
    return super.get("Get", id);
  }
  create(data: EntityDto): Promise<EntityDto> {
    return super.post(data, "Create");
  }
  download(id: string): Promise<any> {
    return super.download(undefined, "Download/" + id);
  }
  update(id: string, data: EntityDto): Promise<EntityDto> {
    return super.put(id, data, "Update");
  }
  delete(id: string): Promise<any> {
    return super.delete(id);
  }
}
