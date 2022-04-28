export interface EmailTemplateDto {
  name: string;
  alias: string;
  subject: string;
  htmlBody: string;
  active: boolean;
  created: boolean;
  associatedServerId: number;
  templateId: number;
}
