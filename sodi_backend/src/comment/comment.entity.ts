import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ name: 'comment_content', comment: '댓글의 내용' })
  content: string;

  @Column({ name: 'comment_class', comment: '댓글의 계층' })
  depth: number;

  @Column({ name: 'comment_order', comment: '댓글과 대댓글의 순서' })
  order: number;

  @Column({ name: 'comment_group_num', comment: '댓글 그룹' })
  groupNum: number;

  @ManyToOne(() => Board, (board) => board.id)
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
