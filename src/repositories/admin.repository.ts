import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';


export class AdminRepository {
  private prisma = new PrismaClient();
  private saltRounds = 10; 
  private jwtSecret = process.env.JWT_SECRET || 'secret';


  async login(username: string, password: string): Promise<string> {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = sign({ id: admin.id, username: admin.username }, this.jwtSecret, {
      expiresIn: '1h', 
    });

    return token;
  }

  async createAdmin(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    await this.prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }
}