import Link from 'next/link';
import styles from './ProfileDropDown.module.css';
import { ProfileImage, Profile } from '../common/Profile';
import { useEffect, useRef, useState } from 'react';
import { useLogout } from '@/hooks/useAuth';

export default function ProfileDropDown({ user }) {
  const logout = useLogout();

  const isUser = user?.role === 'USER';

  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  return (
    <div className={styles.ProfileDropDown} ref={dropDownRef}>
      <button onClick={toggleDropdown}>
        <ProfileImage user={user} />
      </button>

      {isOpen && (
        <div className={styles['dropdown-menu']}>
          <Profile user={user} />
          <ul className={styles.lists}>
            {isUser && (
              <li>
                <Link href="/me" className={styles.link}>
                  나의 챌린지
                </Link>
              </li>
            )}
            <li>
              <button
                className={styles.logout}
                type="button"
                onClick={async () => await logout()}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
