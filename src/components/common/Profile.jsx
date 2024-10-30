import styles from './Profile.module.css';
import Image from 'next/image';
import assets from '@/variables/images';
import { formatDate } from '@/utils/utilFunction';
import cn from '@/utils/clsx';
import { CloudinaryImage } from './CloudinaryImage';

export function ProfileImage({ user, width = '32px' }) {
  const isUser = user?.role !== 'ADMIN';

  const getImageSource = () => {
    if (!user) return assets.images.profileMember;
    if (user.image) {
      const publicId = user.image.split('/').pop();
      return publicId;
    }
    return isUser ? assets.images.profileMember : assets.images.profileAdmin;
  };

  return (
    <div className={styles.ProfileImage} style={{ '--width': width }}>
      {user?.image ? (
        <CloudinaryImage
          publicId={getImageSource()}
          alt="profile image"
          fill
          className={styles.image}
          sizes={width}
        />
      ) : (
        <Image
          src={getImageSource()}
          alt="profile image"
          fill
          className={styles.image}
        />
      )}
    </div>
  );
}

export function Profile({ user, size, type, date, className }) {
  if (!user) return null; // user가 없을 때 early return

  const isAdmin = user?.role === 'ADMIN';
  const userGrade = isAdmin
    ? '어드민'
    : user?.grade === 'EXPERT'
    ? '전문가'
    : '일반';
  const isTypeSimple = String(type || ''); // type이 undefined일 때 처리
  const isSmall = size === 'small';

  if (isTypeSimple.includes('simple')) {
    return (
      <div className={cn(styles.Profile, styles.simple, className)}>
        <ProfileImage width="24px" user={user} />
        <span className={styles.name}>{user.nickname}</span>
        {isTypeSimple.includes('2') && (
          <span className={styles.grade}>{userGrade}</span>
        )}
      </div>
    );
  }

  if (date) {
    return (
      <div className={cn(styles.Profile, className)}>
        <ProfileImage user={user} />
        <div className={styles.texts}>
          <span className={styles.name}>{user.nickname}</span>
          <time className={styles.time}>{formatDate(date, true)}</time>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(styles.Profile, className)}>
      <ProfileImage user={user} width={isSmall ? '24px' : '32px'} />
      <div className={styles.texts}>
        <span
          className={
            type === 'workList' ? styles['workList-name'] : styles.name
          }
        >
          {user.nickname}
        </span>
        <span className={styles.grade}>{userGrade}</span>
      </div>
    </div>
  );
}
