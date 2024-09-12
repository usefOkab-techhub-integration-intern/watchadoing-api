import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { BadRequestError, NotFoundError, InternalServerError } from '../utils/errors'; // Import custom errors

export class AdminRepository {
  private prisma = new PrismaClient();
  private saltRounds = 10; 
  private jwtSecret = process.env.JWT_SECRET || 'secret';

  async login(username: string, password: string): Promise<string> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { username },
      });

      if (!admin) {
        throw new NotFoundError('Admin not found');
      }

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        throw new BadRequestError('Invalid credentials');
      }

      const token = sign({ id: admin.id, username: admin.username }, this.jwtSecret, {
        expiresIn: '1h', 
      });
      return token;
    } catch (error) {
      if (error.message == 'Invalid credentials') {
        throw error;
      } else if (error.message == 'Admin not found') {
        throw error;
      } else {
        throw new InternalServerError(`Login failed: ${error.message}`);
      }
    }
  }

  async createAdmin(username: string, password: string): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      await this.prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error(`Failed to create admin: ${error.message}`);
      throw new InternalServerError(`Failed to create admin: ${error.message}`);
    }
  }
}