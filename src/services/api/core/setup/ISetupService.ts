import { EmailTemplateDto } from "@/application/dtos/core/email/EmailTemplateDto";

export interface ISetupService {
  getPostmarkTemplates(): Promise<EmailTemplateDto[]>;
  createPostmarkTemplates(): Promise<EmailTemplateDto[]>;
}
