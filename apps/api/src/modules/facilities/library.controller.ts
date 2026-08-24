import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LibraryService } from './library.service';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ModuleType, IssueStatus } from '@prisma/client';
import { RequireModule } from '../../common/guards/require-module.decorator';
import { ModuleEnabledGuard } from '../../common/guards/module-enabled.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Audited } from '../../common/audit/audit.decorator';

class CreateBookDto {
  @ApiProperty({ example: 'Fundamentals of Nursing' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Patricia A. Potter', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ example: 'Elsevier Health Sciences', required: false })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiProperty({ example: '978-0323677721', required: false })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiProperty({ example: 'Nursing Care', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: '10th Edition', required: false })
  @IsOptional()
  @IsString()
  edition?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  copiesCount?: number;
}

class AddBookCopyDto {
  @ApiProperty({ example: 'book-cuid-123' })
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @ApiProperty({ example: 'FON-006' })
  @IsNotEmpty()
  @IsString()
  accessionNo: string;

  @ApiProperty({ example: 'Good', required: false })
  @IsOptional()
  @IsString()
  condition?: string;
}

class IssueBookDto {
  @ApiProperty({ example: 'book-cuid-123' })
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @ApiProperty({ example: 'copy-cuid-123', required: false })
  @IsOptional()
  @IsString()
  copyId?: string;

  @ApiProperty({ example: 'student-cuid-123' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 14, required: false })
  @IsOptional()
  @IsNumber()
  dueDays?: number;
}

class ReturnBookDto {
  @ApiProperty({ example: 'Good', required: false })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  fineAmount?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  waiveFine?: boolean;
}

@ApiTags('Library & Circulation Management')
@RequireModule(ModuleType.LIBRARY)
@UseGuards(JwtAuthGuard, PermissionsGuard, ModuleEnabledGuard)
@ApiBearerAuth()
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // ----------------------------------------------------
  // DASHBOARD & CATALOG
  // ----------------------------------------------------

  @Get('dashboard')
  @RequirePermissions('library.read')
  @ApiOperation({ summary: 'Get library collection statistics, copies availability, and overdue loan counters' })
  getDashboard() {
    return this.libraryService.getLibraryDashboard();
  }

  @Get('books')
  @RequirePermissions('library.read')
  @ApiOperation({ summary: 'List and search library books and physical copies' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getBooks(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.libraryService.getBooks({
      search,
      category,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('books/:id')
  @RequirePermissions('library.read')
  @ApiOperation({ summary: 'Get book metadata, accession copies inventory, and active loans' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  getBookById(@Param('id') id: string) {
    return this.libraryService.getBookById(id);
  }

  @Post('books')
  @RequirePermissions('library.book.manage')
  @Audited({ entity: 'LibraryBook', action: 'CREATE' })
  @ApiOperation({ summary: 'Catalog a new book title and auto-generate physical barcode copies' })
  createBook(@Body() dto: CreateBookDto, @CurrentUser() user: any) {
    return this.libraryService.createBook(dto, user?.id);
  }

  @Post('copies')
  @RequirePermissions('library.book.manage')
  @Audited({ entity: 'BookCopy', action: 'CREATE' })
  @ApiOperation({ summary: 'Register a new physical book copy with unique accession number' })
  addCopy(@Body() dto: AddBookCopyDto) {
    return this.libraryService.addCopy(dto);
  }

  // ----------------------------------------------------
  // CIRCULATION: ISSUE, RETURN & FINES
  // ----------------------------------------------------

  @Get('issues')
  @RequirePermissions('library.read')
  @ApiOperation({ summary: 'List active and historical book circulation loans' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'status', enum: IssueStatus, required: false })
  getIssues(
    @Query('studentId') studentId?: string,
    @Query('status') status?: IssueStatus,
  ) {
    return this.libraryService.getCirculationIssues({ studentId, status });
  }

  @Post('issues')
  @RequirePermissions('library.issue')
  @Audited({ entity: 'LibraryIssue', action: 'CREATE' })
  @ApiOperation({ summary: 'Issue a physical book copy to a student with loan limits validation' })
  issueBook(@Body() dto: IssueBookDto, @CurrentUser() user: any) {
    return this.libraryService.issueBook(dto, user?.id);
  }

  @Post('issues/:id/return')
  @RequirePermissions('library.return')
  @Audited({ entity: 'LibraryIssue', action: 'UPDATE' })
  @ApiOperation({ summary: 'Process book return, calculate overdue fines, and release copy to AVAILABLE' })
  @ApiParam({ name: 'id', description: 'Issue UUID' })
  returnBook(
    @Param('id') id: string,
    @Body() dto: ReturnBookDto,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.returnBook(id, dto, user?.id);
  }
}
