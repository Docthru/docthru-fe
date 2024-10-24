import assets from '@/variables/images';
import Image from 'next/image';
import styles from './Headers.module.css';
import Link from 'next/link';
import ProfileDropDown from './ProfileDropDown';
import { pages } from '@/variables/variables';
import Nav from './Nav';
import Notification from './Notification';

const LoginButton = () => {
  return (
    <Link href="/auth/login">
      <button type="button" className={styles['login-btn']}>
        로그인
      </button>
    </Link>
  );
};

export function MemberHeader({ user }) {
  return (
    <header className={styles.MemberHeader}>
      <div className={styles.container}>
        <Link href="/">
          <Image
            className={styles.logo}
            src={assets.images.logo}
            alt="logo"
            width={120}
            height={27}
            priority
          />
        </Link>

        <div className={styles.rightSection}>
          {user && <Notification />} {/* 로그인한 사용자에게만 알림 표시 */}
          {user ? <ProfileDropDown user={user} /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
}

export function AdminHeader({ user }) {
  return (
    <header className={styles.AdminHeader}>
      <div className={styles.container}>
        <Nav links={pages} />
        <ProfileDropDown user={user} />
      </div>
    </header>
  );
}

export function AuthHeader() {
  return (
    <header className={styles.AuthHeader}>
      <Link href="/">
        <Image
          className={styles.logo}
          src={assets.images.logo}
          alt="logo"
          width={320}
          height={72}
          priority
        />
      </Link>
    </header>
  );
}
