import Image from 'next/image';
import Link from 'next/link';
import styles from './Logo.module.css';
import cn from '@/utils/clsx';
import assets from '@/variables/images';

export default function Logo({ isAuthPage, className }) {
  return (
    <Link href="/" className={className}>
      <Image
        className={cn(styles.logo, {
          [styles['auth-page-logo']]: isAuthPage,
        })}
        src={assets.images.logo}
        alt="logo"
        width={320}
        height={72}
        priority
      />
    </Link>
  );
}
