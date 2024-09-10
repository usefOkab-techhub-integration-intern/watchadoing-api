import { PrismaClient } from '@prisma/client';

export class CategoryNativeRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async disconnectCategories(categoryIds: number[]): Promise<void> {
    const query = CategoryQuery.disconnectFromWatches(categoryIds);
    await this.prisma.$executeRawUnsafe(query);
  }
}

class CategoryQuery {
    static disconnectFromWatches(categoryIds: number[]): string {
        return `
          DELETE FROM _CategoryToWatch
          WHERE categoryId IN (${categoryIds.join(',')});
        `;
      }
}