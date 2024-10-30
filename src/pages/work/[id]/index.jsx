import Head from 'next/head';
import { useRouter } from 'next/router';
import WorkDetail from '@/components/work/WorkDetail';
import { useGetWork } from '@/service/queries/work';
import Loader from '@/components/common/Loader';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import FeedbackList from '@/components/feedback/FeedbackList';

export default function WorkDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isPending } = useGetWork(id);

  if (isPending) {
    return <Loader msg="작업물 상세 페이지로 이동중" />;
  }

  if (!data) {
    return <p>데이터 없음</p>;
  }

  const { isClosed } = data;
  return (
    <>
      <Head>
        <title>작업물 상세페이지</title>
        <meta
          name="description"
          content="작업물에 대한 상세 정보를 보여주는 페이지입니다."
        />
      </Head>
      <WorkDetail data={data} />
      {isClosed || <FeedbackForm id={id} />}

      <FeedbackList id={id} isClosedChallenge={isClosed} />
    </>
  );
}
