import { Entity, Column, PrimaryGeneratedColumn, Timestamp, OneToMany } from 'typeorm';

interface UserProfile {
  user_id: number;
  user_email: string;
  user_name: string;
  user_password: string;
  user_career_goal: string;
  user_stacks: string;
  user_introduction: string;
  user_img: string;
  user_created_at: Timestamp;
}

export type signUpUserInput = Pick<UserProfile, 'user_email' | 'user_name' | 'user_password'>;

export type logInUserInput = Pick<UserProfile, 'user_email' | 'user_password'>;

export type updatUserInput = Partial<
  Pick<
    UserProfile,
    'user_name' | 'user_career_goal' | 'user_stacks' | 'user_introduction' | 'user_img'
  >
>;

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
