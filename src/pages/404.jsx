import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/404.module.css';
import assets from '@/variables/images';

export default function NotFoundPage() {
  return (
    <div>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <Image
            src={assets.images.book}
            alt="닫기"
            className={styles.book}
            width={350}
            height={350}
          />
          <h1 className={styles.notFoundTitle}>404</h1>
          <p className={styles.notFoundMessage}>
            이런! 찾으시던 페이지는 존재하지 않는 것 같아요!
          </p>
          <p className={styles.notFoundSubmessage}>
            존재하지 않는 페이지이거나, 오타일 가능성이 높아요!
          </p>
          <Link href="/" className={styles.button}>
            <ArrowLeft size={20} />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
