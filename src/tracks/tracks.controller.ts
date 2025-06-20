import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  TracksService,
  CreateTrackDto,
  UpdateTrackDto,
  TrackQueryParams,
} from './tracks.service';
import { Track } from '../schemas/track.schema';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new track' })
  @ApiResponse({
    status: 201,
    description: 'Track created successfully',
    type: Track,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Artist or Album not found' })
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', 3)) // audio, video, image
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Track> {
    // Handle file uploads if provided
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file.mimetype.startsWith('audio/')) {
          createTrackDto.file = `/media/tracks/audio/${file.filename}`;
        } else if (file.mimetype.startsWith('video/')) {
          createTrackDto.video = `/media/tracks/video/${file.filename}`;
        } else if (file.mimetype.startsWith('image/')) {
          createTrackDto.image = `/media/tracks/images/${file.filename}`;
        }
      });
    }

    return this.tracksService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Tracks retrieved successfully' })
  async findAll(
    @Query() queryParams: TrackQueryParams,
  ): Promise<{ tracks: Track[]; total: number }> {
    return this.tracksService.findAll(queryParams);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular tracks' })
  @ApiResponse({
    status: 200,
    description: 'Popular tracks retrieved successfully',
  })
  async getPopular(@Query('limit') limit?: string): Promise<Track[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.tracksService.getPopularTracks(limitNum);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent tracks' })
  @ApiResponse({
    status: 200,
    description: 'Recent tracks retrieved successfully',
  })
  async getRecent(@Query('limit') limit?: string): Promise<Track[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.tracksService.getRecentTracks(limitNum);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tracks' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ): Promise<Track[]> {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.tracksService.searchTracks(query, limitNum);
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Get tracks by artist' })
  @ApiResponse({
    status: 200,
    description: 'Artist tracks retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async getByArtist(
    @Param('artistId') artistId: string,
    @Query('limit') limit?: string,
  ): Promise<Track[]> {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.tracksService.getTracksByArtist(artistId, limitNum);
  }

  @Get('album/:albumId')
  @ApiOperation({ summary: 'Get tracks by album' })
  @ApiResponse({
    status: 200,
    description: 'Album tracks retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async getByAlbum(@Param('albumId') albumId: string): Promise<Track[]> {
    return this.tracksService.getTracksByAlbum(albumId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by ID' })
  @ApiResponse({
    status: 200,
    description: 'Track retrieved successfully',
    type: Track,
  })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async findOne(@Param('id') id: string): Promise<Track> {
    return this.tracksService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update track' })
  @ApiResponse({
    status: 200,
    description: 'Track updated successfully',
    type: Track,
  })
  @ApiResponse({ status: 404, description: 'Track not found' })
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Track> {
    // Handle file uploads if provided
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file.mimetype.startsWith('audio/')) {
          updateTrackDto.file = `/media/tracks/audio/${file.filename}`;
        } else if (file.mimetype.startsWith('video/')) {
          updateTrackDto.video = `/media/tracks/video/${file.filename}`;
        } else if (file.mimetype.startsWith('image/')) {
          updateTrackDto.image = `/media/tracks/images/${file.filename}`;
        }
      });
    }

    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete track' })
  @ApiResponse({ status: 204, description: 'Track deleted successfully' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.tracksService.remove(id);
  }

  @Post(':id/play')
  @ApiOperation({ summary: 'Increment play count' })
  @ApiResponse({
    status: 200,
    description: 'Play count incremented',
    type: Track,
  })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async play(@Param('id') id: string): Promise<Track> {
    return this.tracksService.incrementPlayCount(id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Increment download count' })
  @ApiResponse({
    status: 200,
    description: 'Download count incremented',
    type: Track,
  })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async download(@Param('id') id: string): Promise<Track> {
    return this.tracksService.incrementDownloadCount(id);
  }
}
