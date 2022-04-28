import { EmailTemplateDto } from "@/application/dtos/core/email/EmailTemplateDto";
import { ApiService } from "../../ApiService";
import { ISetupService } from "./ISetupService";

export class SetupService extends ApiService implements ISetupService {
  constructor() {
    super("Setup");
  }
  getPostmarkTemplates(): Promise<EmailTemplateDto[]> {
    return super.getAll("GetPostmarkTemplates");
  }
  createPostmarkTemplates(): Promise<EmailTemplateDto[]> {
    return super.post(null, "CreatePostmarkTemplates");
  }
}
