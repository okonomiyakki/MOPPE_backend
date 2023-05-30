import { Entity, Column, PrimaryGeneratedColumn, Timestamp, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ length: 50, nullable: false })
  user_email!: string;

  @Column({ length: 50, nullable: false })
  user_name!: string;

  @Column({ length: 50, nullable: false })
  user_password!: string;

  @Column({ length: 100, nullable: true, default: null })
  user_career_goal!: string;

  @Column({ length: 250, nullable: true, default: null })
  user_stacks!: string;

  @Column({ length: 150, nullable: true, default: null })
  user_introduction!: string;

  @Column({ length: 200, nullable: true, default: null })
  user_img!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  user_created_at!: Timestamp;

  // @OneToMany(() => Study, (study) => study.user)
  // studies!: Study[];

  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments!: Comment[];

  // @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  // bookmarks!: Bookmark[];
}
