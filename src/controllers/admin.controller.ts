import { post, requestBody, response } from '@loopback/rest';
import { AdminRepository } from '../repositories';
import { repository } from '@loopback/repository';

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepo : AdminRepository
  ) {}

  @post('/admin/login')
  @response(200, {
    description: 'Admin login',
    content: { 'application/json': { schema: { type: 'string' } } },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['username', 'password'],
          },
        },
      },
    })
    credentials: { username: string; password: string }
  ): Promise<string> {
    const { username, password } = credentials;
    return this.adminRepo.login(username, password);
  }

  @post('/admin/create')
  @response(204, {
    description: 'Create a new admin',
  })
  async createAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['username', 'password'],
          },
        },
      },
    })
    adminData: { username: string; password: string }
  ): Promise<void> {
    const { username, password } = adminData;
    return this.adminRepo.createAdmin(username, password);
  }
}