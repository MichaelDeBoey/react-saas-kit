import { EntityDto } from "@/application/dtos/EntityDto";

export interface ITemplateService {
  getAll(): Promise<EntityDto[]>;
  get(id: string): Promise<EntityDto>;
  download(id: string): Promise<any>;
  create(data: EntityDto): Promise<EntityDto>;
  update(id: string, data: EntityDto): Promise<EntityDto>;
  delete(id: string): Promise<any>;
}
