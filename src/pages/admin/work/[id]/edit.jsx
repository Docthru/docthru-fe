import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUpdateWork } from '@/service/mutations/work';
import { useGiveUpChallenge } from '@/service/mutations/challenge';
import WorkForm from '@/components/work/WorkForm';
import Head from 'next/head';
import Loader from '@/components/common/Loader';
import { useGetWork } from '@/service/queries/work';
import SourceViewer from '@/components/work/SourceViewer';

export default function AdminEditWorkPage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const workId = router.query.id;
  const isAdmin = router.pathname.startsWith('/admin');

  const { mutate: updateWork } = useUpdateWork();
  const { mutate: giveUpChallenge } = useGiveUpChallenge();

  const { data, isPending } = useGetWork(workId);

  useEffect(() => {
    if (data && data.content) {
      setContent(data.content);
    }
  }, [data]);

  const handleUpdateWork = () => {
    setIsLoading(true);
    updateWork(
      { id: workId, data: { content } },
      {
        onSuccess: () => {
          setIsLoading(false);
        },
      }
    );
  };
  useEffect(() => {
    if (isPending || isLoading) return <Loader />;
  });

  return (
    <>
      <Head>
        <title>작업물 수정 페이지</title>
        <meta
          name="description"
          content="관리자가 작업물 상세 페이지를 수정하는 페이지입니다."
        />
      </Head>
      <WorkForm
        isAdmin={isAdmin}
        id={workId}
        content={content}
        setContent={setContent}
        submitAction={handleUpdateWork}
        giveUpAction={() => giveUpChallenge(challenge.id)}
      />
    </>
  );
}