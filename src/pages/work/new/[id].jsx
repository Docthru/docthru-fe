'use client';

import Head from 'next/head';
import styles from '@/styles/pages/work/mutateWork.module.css';
import assets from '@/variables/images';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';
import cn from '@/utils/clsx';
import Border from '@/components/common/Border';
import TextEditor from '@/components/work/TextEditor';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '@/components/common/Loader';
import { useGiveUpChallenge } from '@/service/mutations/challenge';
import { useCreateWork } from '@/service/mutations/work';

//challengeId 받아야됨...
export default function CreateWorkPage() {
  const [content, setContent] = useState('');

  const textEditorRef = useRef(null);
  const router = useRouter();
  const challengeId = router.query.id;

  const { mutate } = useGiveUpChallenge();
  const { mutate: createWork } = useCreateWork();

  if (!challengeId) return <Loader />;

  const handleSave = () => {
    if (textEditorRef.current) {
      textEditorRef.current.saveContent();
    }
  };

  const handleGiveUpChallenge = () => {
    mutate(challengeId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { content };
    console.log('data', data);

    createWork({ id: challengeId, data });
  };

  return (
    <>
      <Head>
        <title>작업 도전하기</title>

        <meta
          name="description"
          content="새로운 작업을 도전하고 생성하는 페이지입니다."
        />
      </Head>

      <div className={styles.top}>
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

        <div className={styles.buttons}>
          <Button
            variant="cancel"
            className={cn(styles.btn, styles.cancel)}
            width="60"
            onClick={handleGiveUpChallenge}
          >
            <span>포기</span>
            <Image
              src={assets.icons.giveUp}
              width={24}
              height={24}
              alt="give-up challenge button"
            />
          </Button>
          <Button
            variant="white-border"
            onClick={handleSave}
            className={cn(styles.btn, styles.save)}
          >
            임시저장
          </Button>
          <Button
            variant="black"
            className={cn(styles.btn, styles.submit)}
            onClick={handleSubmit}
          >
            제출하기
          </Button>
        </div>
      </div>

      <h1 className={styles.title}>도전하는 챌린지 제목</h1>

      <Border gap="24px" />

      <TextEditor
        ref={textEditorRef}
        id={challengeId}
        content={content}
        setContent={setContent}
      />
    </>
  );
}
