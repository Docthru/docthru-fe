import styles from './Headers.module.css';
import Link from 'next/link';
import ProfileDropDown from './ProfileDropDown';
import { pages } from '@/variables/variables';
import Nav from './Nav';
import Notification from './Notification';
import Logo from './Logo';
import cn from '@/utils/clsx';

const LoginButton = () => {
  return (
    <Link href="/auth/login">
      <button type="button" className={styles['login-btn']}>
        로그인
      </button>
    </Link>
  );
};

export function MemberHeader({ user, className }) {
  return (
    <header className={cn(styles.MemberHeader, className)}>
      <div className={styles.container}>
        <Logo />

        <div className={styles.rightSection}>
          {user && <Notification />} {/* 로그인한 사용자에게만 알림 표시 */}
          {user ? <ProfileDropDown user={user} /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
}

export function AdminHeader({ user, className }) {
  return (
    <header className={cn(styles.AdminHeader, className)}>
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
      <Logo isAuthPage={true} />
    </header>
  );
}
