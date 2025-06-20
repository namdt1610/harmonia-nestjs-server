import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { StreamQueueService } from './stream-queue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class AddTrackDto {
  trackId: string;
  position?: number;
}

class MoveTrackDto {
  fromIndex: number;
  toIndex: number;
}

class SetVolumeDto {
  volume: number; // 0.0 to 1.0
}

class SetRepeatDto {
  repeat: 'none' | 'one' | 'all';
}

class SetShuffleDto {
  shuffle: boolean;
}

@ApiTags('stream-queue')
@Controller('stream-queue')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StreamQueueController {
  constructor(private readonly streamQueueService: StreamQueueService) {}

  @Get()
  @ApiOperation({ summary: 'Get user queue' })
  @ApiResponse({ status: 200, description: 'Queue retrieved successfully' })
  async getQueue(@Request() req) {
    const queue = await this.streamQueueService.getQueue(req.user.sub);
    return {
      success: true,
      data: queue,
    };
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current playing track' })
  @ApiResponse({
    status: 200,
    description: 'Current track retrieved successfully',
  })
  async getCurrentTrack(@Request() req) {
    const currentTrack = this.streamQueueService.getCurrentTrack(req.user.sub);
    return {
      success: true,
      data: currentTrack,
    };
  }

  @Get('size')
  @ApiOperation({ summary: 'Get queue size' })
  @ApiResponse({
    status: 200,
    description: 'Queue size retrieved successfully',
  })
  async getQueueSize(@Request() req) {
    const size = this.streamQueueService.getQueueSize(req.user.sub);
    return {
      success: true,
      data: { size },
    };
  }

  @Post('add-track')
  @ApiOperation({ summary: 'Add track to queue' })
  @ApiResponse({
    status: 200,
    description: 'Track added to queue successfully',
  })
  async addTrack(@Request() req, @Body() addTrackDto: AddTrackDto) {
    try {
      const queue = await this.streamQueueService.addTrack(
        req.user.sub,
        addTrackDto.trackId,
        addTrackDto.position,
      );
      return {
        success: true,
        data: queue,
        message: 'Track added to queue successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete('tracks/:index')
  @ApiOperation({ summary: 'Remove track from queue' })
  @ApiResponse({
    status: 200,
    description: 'Track removed from queue successfully',
  })
  async removeTrack(@Request() req, @Param('index') index: string) {
    try {
      const queue = await this.streamQueueService.removeTrack(
        req.user.sub,
        parseInt(index),
      );
      return {
        success: true,
        data: queue,
        message: 'Track removed from queue successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put('move-track')
  @ApiOperation({ summary: 'Move track in queue' })
  @ApiResponse({ status: 200, description: 'Track moved successfully' })
  async moveTrack(@Request() req, @Body() moveTrackDto: MoveTrackDto) {
    try {
      const queue = await this.streamQueueService.moveTrack(
        req.user.sub,
        moveTrackDto.fromIndex,
        moveTrackDto.toIndex,
      );
      return {
        success: true,
        data: queue,
        message: 'Track moved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear queue' })
  @ApiResponse({ status: 200, description: 'Queue cleared successfully' })
  async clearQueue(@Request() req) {
    const queue = await this.streamQueueService.clearQueue(req.user.sub);
    return {
      success: true,
      data: queue,
      message: 'Queue cleared successfully',
    };
  }

  @Put('current/:index')
  @ApiOperation({ summary: 'Set current track by index' })
  @ApiResponse({ status: 200, description: 'Current track set successfully' })
  async setCurrentTrack(@Request() req, @Param('index') index: string) {
    try {
      const queue = await this.streamQueueService.setCurrentTrack(
        req.user.sub,
        parseInt(index),
      );
      return {
        success: true,
        data: queue,
        message: 'Current track set successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('next')
  @ApiOperation({ summary: 'Skip to next track' })
  @ApiResponse({
    status: 200,
    description: 'Skipped to next track successfully',
  })
  async nextTrack(@Request() req) {
    const queue = await this.streamQueueService.nextTrack(req.user.sub);
    return {
      success: true,
      data: queue,
      message: 'Skipped to next track',
    };
  }

  @Post('previous')
  @ApiOperation({ summary: 'Skip to previous track' })
  @ApiResponse({
    status: 200,
    description: 'Skipped to previous track successfully',
  })
  async previousTrack(@Request() req) {
    const queue = await this.streamQueueService.previousTrack(req.user.sub);
    return {
      success: true,
      data: queue,
      message: 'Skipped to previous track',
    };
  }

  @Post('toggle-play-pause')
  @ApiOperation({ summary: 'Toggle play/pause' })
  @ApiResponse({ status: 200, description: 'Play/pause toggled successfully' })
  async togglePlayPause(@Request() req) {
    const queue = await this.streamQueueService.togglePlayPause(req.user.sub);
    return {
      success: true,
      data: queue,
      message: `${queue.isPlaying ? 'Playing' : 'Paused'}`,
    };
  }

  @Put('volume')
  @ApiOperation({ summary: 'Set volume' })
  @ApiResponse({ status: 200, description: 'Volume set successfully' })
  async setVolume(@Request() req, @Body() setVolumeDto: SetVolumeDto) {
    const queue = await this.streamQueueService.setVolume(
      req.user.sub,
      setVolumeDto.volume,
    );
    return {
      success: true,
      data: queue,
      message: `Volume set to ${Math.round(queue.volume * 100)}%`,
    };
  }

  @Put('repeat')
  @ApiOperation({ summary: 'Set repeat mode' })
  @ApiResponse({ status: 200, description: 'Repeat mode set successfully' })
  async setRepeat(@Request() req, @Body() setRepeatDto: SetRepeatDto) {
    const queue = await this.streamQueueService.setRepeat(
      req.user.sub,
      setRepeatDto.repeat,
    );
    return {
      success: true,
      data: queue,
      message: `Repeat mode set to ${queue.repeat}`,
    };
  }

  @Put('shuffle')
  @ApiOperation({ summary: 'Set shuffle mode' })
  @ApiResponse({ status: 200, description: 'Shuffle mode set successfully' })
  async setShuffle(@Request() req, @Body() setShuffleDto: SetShuffleDto) {
    const queue = await this.streamQueueService.setShuffle(
      req.user.sub,
      setShuffleDto.shuffle,
    );
    return {
      success: true,
      data: queue,
      message: `Shuffle ${queue.shuffle ? 'enabled' : 'disabled'}`,
    };
  }

  @Post('add-album/:albumId')
  @ApiOperation({ summary: 'Add entire album to queue' })
  @ApiResponse({
    status: 200,
    description: 'Album added to queue successfully',
  })
  async addAlbum(@Request() req, @Param('albumId') albumId: string) {
    try {
      const queue = await this.streamQueueService.addAlbum(
        req.user.sub,
        albumId,
      );
      return {
        success: true,
        data: queue,
        message: 'Album added to queue successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('add-playlist/:playlistId')
  @ApiOperation({ summary: 'Add entire playlist to queue' })
  @ApiResponse({
    status: 200,
    description: 'Playlist added to queue successfully',
  })
  async addPlaylist(@Request() req, @Param('playlistId') playlistId: string) {
    try {
      const queue = await this.streamQueueService.addPlaylist(
        req.user.sub,
        playlistId,
      );
      return {
        success: true,
        data: queue,
        message: 'Playlist added to queue successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
