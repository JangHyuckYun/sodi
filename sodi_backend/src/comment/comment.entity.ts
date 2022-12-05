import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../board/board.entity';
import { JoinColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'comment_id',
    comment: '댓글 idx',
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'user_id',
    comment: '댓글을 작성한 유저의 id',
  })
  userId: number;

  @Column({
    name: 'comment_writer',
    comment: '댓글을 작성한 유저의 이름',
  })
  writer: string;

  @Column({
    name: 'comment_reply_id',
    comment: '상위 댓글을 작성한 유저의 아이디',
    default: 0,
  })
  replyId: number;

  @Column({ name: 'comment_content', comment: '댓글의 내용', default: '' })
  content: string;

  @Column({ name: 'comment_depth', comment: '댓글의 계층', default: 0 })
  depth: number;

  @Column({
    name: 'comment_order',
    comment: '댓글과 대댓글의 순서',
    default: 0,
  })
  order: number;

  @Column({ name: 'comment_group_num', comment: '댓글 그룹', default: 0 })
  groupNum: number;

  @CreateDateColumn({ name: 'comment_create_date', comment: '댓글 생성 시간' })
  createDate: Date;

  @ManyToOne(() => Board, (board) => board.comments)
  @JoinColumn()
  board: Board;
}
