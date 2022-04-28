import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import { CreateContractRequest } from "@/application/contracts/app/contracts/CreateContractRequest";
import { SendContractRequest } from "@/application/contracts/app/contracts/SendContractRequest";
import { UpdateContractRequest } from "@/application/contracts/app/contracts/UpdateContractRequest";
import { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";

export interface IContractService {
  getAllByStatusFilter(filter: ContractStatusFilter, workspaceId?: string): Promise<ContractDto[]>;
  getAllByLink(linkId: string): Promise<ContractDto[]>;
  getContract(id: string): Promise<ContractDto>;
  downloadFile(id: string): Promise<any>;
  send(id: string, payload: SendContractRequest): Promise<any>;
  create(data: CreateContractRequest): Promise<ContractDto>;
  update(id: string, data: UpdateContractRequest): Promise<ContractDto>;
  delete(id: string): Promise<any>;
}
