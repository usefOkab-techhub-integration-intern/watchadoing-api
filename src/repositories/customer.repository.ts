import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { NativeQuery } from './native.repository';
import { PageSortParams } from '../models/paging.sorting.model';
import { CustomerCreation, CustomerFilter, CustomerUpdate } from '../models';
import { NotFoundError, InternalServerError } from '../utils/errors'; // Import custom errors

export class CustomerRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findFiltered(
    pageSortParams: PageSortParams,
    filter?: CustomerFilter
  ) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;
      const customers = await this.prisma.customer.findMany({
        where: filter?.build(),
        include: {
          orders: {
            include: {
              shipment: true,
              orderLines: {
                include: {
                  watch: {
                    include: {
                      categories: true
                    }
                  }
                }
              }
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });
      return this.dto.mapCustomerArray(customers);
    } catch (error) {
      console.error(`Failed to fetch filtered customers: ${error.message}`);
      throw new InternalServerError(`Failed to fetch filtered customers: ${error.message}`);
    }
  }

  async findDeleted(pageSortParams: PageSortParams) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;
      const customers = await this.prisma.customer.findMany({
        where: {
          isDeleted: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });
      return this.dto.mapCustomerArray(customers);
    } catch (error) {
      console.error(`Failed to fetch deleted customers: ${error.message}`);
      throw new InternalServerError(`Failed to fetch deleted customers: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              shipment: true,
              orderLines: {
                include: {
                  watch: {
                    include: {
                      categories: true
                    }
                  }
                }
              }
            }
          }
        },
      });
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }
      return customer;
    } catch (error) {
      console.error(`Failed to fetch customer by ID: ${error.message}`);
      throw new InternalServerError(`Failed to fetch customer by ID: ${error.message}`);
    }
  }

  async bulkCreate(dataArray: CustomerCreation[]) {
    try {
      const results = [];
      for (const data of dataArray) {
        const result = await this.prisma.customer.create({
          data: data,
        });
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(`Failed to bulk create customers: ${error.message}`);
      throw new InternalServerError(`Failed to bulk create customers: ${error.message}`);
    }
  }

  async bulkUpdate(dataArray: CustomerUpdate[]) {
    try {
      const results = [];
      for (const data of dataArray) {
        const result = await this.prisma.customer.update({
          where: { id: data.id },
          data: data,
        });
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(`Failed to bulk update customers: ${error.message}`);
      throw new InternalServerError(`Failed to bulk update customers: ${error.message}`);
    }
  }

  async bulkSoftDelete(ids: number[]) {
    try {
      await this.prisma.$executeRawUnsafe(NativeQuery.disconnectOrderDataFromCustomer(ids));

      return this.prisma.customer.updateMany({
        where: {
          id: { in: ids },
        },
        data: { isDeleted: true },
      });
    } catch (error) {
      console.error(`Failed to bulk soft delete customers: ${error.message}`);
      throw new InternalServerError(`Failed to bulk soft delete customers: ${error.message}`);
    }
  }
}