import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get listed categories for app discovery' })
  async findListed() {
    return {
      success: true,
      data: await this.categoryService.findListed(),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Get all categories for admin management' })
  async findAllForAdmin() {
    return {
      success: true,
      data: await this.categoryService.findAllForAdmin(),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create category' })
  async create(@Body() dto: CreateCategoryDto) {
    return {
      success: true,
      message: 'Category created successfully.',
      data: await this.categoryService.create(dto),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return {
      success: true,
      message: 'Category updated successfully.',
      data: await this.categoryService.update(id, dto),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(':id/list')
  @ApiOperation({ summary: 'List category' })
  async list(@Param('id') id: string) {
    return {
      success: true,
      message: 'Category listed successfully.',
      data: await this.categoryService.setListed(id, true),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(':id/unlist')
  @ApiOperation({ summary: 'Unlist category' })
  async unlist(@Param('id') id: string) {
    return {
      success: true,
      message: 'Category unlisted successfully.',
      data: await this.categoryService.setListed(id, false),
    };
  }
}