import { Entity, Column, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserProfile } from '../..//user-profile/entities/user-profile.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  mustChangePassword: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  lastPasswordChange: Date;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  userProfile: UserProfile;
}
