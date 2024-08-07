import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlayListsController } from './playlist.controller';
import { Playlist } from 'src/entities/playlists/playlist.entity';
import { User } from 'src/entities/user/user.entity';
import { Song } from 'src/entities/song/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PlayListsController],
  providers: [PlaylistService, Playlist, User, Song],
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
})
export class PlaylistModule {}
