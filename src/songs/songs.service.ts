import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/entities/artists/artist.entity';
import { Song } from 'src/entities/song/song.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/createSong.dto';
import { UpdateSongDto } from './dto/updateSong.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable({ scope: Scope.REQUEST })
export class SongsService {
  constructor(
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
  ) {}
  private readonly songs = [];

  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;
    // console.log(songDTO.artists);
    const artists = await this.artistRepo.findByIds(songDTO.artists);
    // console.log(artists);

    // song.artists = artists;

    return await this.songRepo.save(song);
  }

  async findAll(): Promise<Song[]> {
    return await this.songRepo.find();
  }

  async findOne(id: number): Promise<Song> {
    return await this.songRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.songRepo.delete(id);
  }

  async update(
    id: number,
    updateSongDto: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songRepo.update(id, updateSongDto);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepo.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');

    return paginate<Song>(queryBuilder, options);
  }
}
