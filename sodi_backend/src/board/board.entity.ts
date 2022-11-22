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

  @Column({ type: 'bigint', name: 'board_hits', comment: '게시글 조회수' })
  hits: number;

  @Column({ type: 'bigint', name: 'board_likes', comment: '게시글 좋아요 수' })
  likes: number;

  @Column({ name: 'board_longitude', comment: '게시글의 위치 X' })
  longitude: number;

  @Column({ name: 'board_latitude', comment: '게시글의 위치 Y' })
  latitude: number;

  @Column({
    name: 'board_image_1',
    nullable: false,
    comment: '게시글의 이미지 1',
    type: 'longblob',
    default: '',
  })
  image1: string;

  @Column({
    name: 'board_image_2',
    comment: '게시글의 이미지 2 ',
    type: 'longblob',
    default: '',
  })
  image2: string;

  @Column({
    name: 'board_image_3',
    comment: '게시글의 이미지 3 ',
    type: 'longblob',
    default: '',
  })
  image3: string;

  @Column({
    name: 'board_image_4',
    comment: '게시글의 이미지 4 ',
    type: 'longblob',
    default: '',
  })
  image4: string;

  @Column({
    name: 'board_image_5',
    comment: '게시글의 이미지 5 ',
    type: 'longblob',
    default: '',
  })
  image5: string;

  @OneToMany(() => Comment, (comment) => comment.id)
  commentList: Comment[];
}
