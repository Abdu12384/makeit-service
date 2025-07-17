import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../domain/interface/servicesInterface/user-existence-service.interface";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IAdminRepository } from "../../domain/interface/repositoryInterfaces/users/admin.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { IAdminEntity } from "../../domain/entities/admin.entity";
import { IVendorEntity } from "../../domain/entities/vendor.entity";
import { IClientEntity } from "../../domain/entities/client.entity";






@injectable()
export class UserExistenceService implements IUserExistenceService {
  constructor(
    @inject('IClientRepository')
    private _clientRepository: IClientRepository,

    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository,

    @inject('IAdminRepository')
    private _adminRepository: IAdminRepository
  ) {}

  async findUserByEmail(email: string): Promise<{
    exists: boolean;
    user: IClientEntity | IVendorEntity | IAdminEntity | null;
    role: 'client' | 'vendor' | 'admin' | null;
  }> {
    const [client, admin, vendor] = await Promise.all([
      this._clientRepository.findOne({ email }),
      this._adminRepository.findOne({ email }),
      this._vendorRepository.findOne({ email }),
    ]);

    if (client) return { exists: true, user: client, role: 'client' };
    if (admin) return { exists: true, user: admin, role: 'admin' };
    if (vendor) return { exists: true, user: vendor, role: 'vendor' };

    return { exists: false, user: null, role: null };
  }
}

