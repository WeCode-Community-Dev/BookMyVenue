import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        const name = dto.name.trim();
        const slug = this.toSlug(name);

        try {
            return await this.prisma.category.create({
                data: {
                    name,
                    slug,
                    description: dto.description?.trim() || null,
                },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async findListed() {
        return this.prisma.category.findMany({
            where: { isListed: true },
            orderBy: { name: 'asc' },
        });
    }

    async findAllForAdmin() {
        return this.prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: string, dto: UpdateCategoryDto) {
        const data: Prisma.CategoryUpdateInput = {};

        if (dto.name?.trim()) {
            const name = dto.name.trim();
            data.name = name;
            data.slug = this.toSlug(name);
        }

        if (dto.description !== undefined) {
            data.description = dto.description.trim() || null;
        }

        try {
            return await this.prisma.category.update({
                where: { id },
                data,
            });
        } catch (error) {
            this.handlePrismaError(error, id);
        }
    }

    async setListed(id: string, isListed: boolean) {
        try {
            return await this.prisma.category.update({
                where: { id },
                data: { isListed },
            });
        } catch (error) {
            this.handlePrismaError(error, id);
        }
    }

    private toSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    private handlePrismaError(error: unknown, id?: string): never {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new ConflictException('Category name or slug already exists.');
        }

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            throw new NotFoundException(`Category ${id ?? ''} not found.`);
        }

        throw error;
    }
}