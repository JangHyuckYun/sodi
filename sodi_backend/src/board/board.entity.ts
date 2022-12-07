import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'board_id',
    comment: '게시글 idx',
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'user_id',
    comment: '게시글 작성한 유저의 idx',
  })
  userId: number;

  @Column({ name: 'board_title', nullable: false, comment: '게시글 제목' })
  title: string;

  @Column({ name: 'board_content', comment: '게시글 내용' })
  content: string;

  @Column({ name: 'board_country', comment: '게시글 나라' })
  country: string;

  @Column({ type: 'bigint', name: 'board_hits', comment: '게시글 조회수' })
  hits: number;

  @Column({ type: 'bigint', name: 'board_likes', comment: '게시글 좋아요 수' })
  likes: number;

  @Column({
    name: 'board_longitude',
    comment: '게시글의 위치 X',
    type: 'float',
  })
  longitude: number;

  @Column({ name: 'board_latitude', comment: '게시글의 위치 Y', type: 'float' })
  latitude: number;

  @Column({
    name: 'board_images',
    nullable: false,
    comment: '게시글의 이미지 모음',
    // type: 'longblob',
    default: '[]',
  })
  images: string;

  @OneToMany(() => Comment, (comment) => comment.board, {
    lazy: true,
    cascade: true,
  })
  comments: Comment[];
}
