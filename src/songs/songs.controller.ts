import { Song } from 'src/entities/song/song.entity';
import { Connection } from './../common/constants/connection';
import { CreateSongDTO } from './dto/createSong.dto';
import { SongsService } from './songs.service';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/updateSong.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/artistJwt-guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(
    private songsService: SongsService,
    @Inject('CONNECTION') private connection: Connection,
  ) {
    console.log(
      `hey this is Connection strig ${this.connection.CONNECTION_STRING}`,
    );
  }
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Song>> {
    try {
      limit = limit > 100 ? 100 : limit;
      console.log(process.env.PORT);
      return this.songsService.paginate({ page, limit });
    } catch (error) {
      throw new HttpException(
        'server Error ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Post()
  @UseGuards(JwtArtistGuard)
  async create(@Body() createSongDto: CreateSongDTO) {
    return this.songsService.create(createSongDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateSongDto: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, UpdateSongDto);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }
}
