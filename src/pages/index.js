import { useState } from 'react';
import { useRouter } from 'next/router';

import { useGetChallenges } from '@/service/queries/challenge';

import Head from 'next/head';
import ChallengeSearchBarLarge from '../components/common/ChallengeSearchBarLarge';
import images from '../variables/images';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/application/Pagination';

import AllCardSection from '@/components/challenge/AllCardSection';
import ChallengeDropdown from '../components/challenge/ChallengeDropdown';

import styles from '../styles/pages/Home.module.css';

export default function Home() {
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState({
    field: '',
    docType: '',
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleOptionChange = (option) => {
    setSelectedOption((pev) => ({ ...pev, option }));
    setCurrentPage(1);
  };

  const { data, isPending } = useGetChallenges(selectedOption);

  if (isPending) {
    return <Loader />;
  }
  // console.log('data', data);
  // console.log('list', data?.list);
  // console.log('meta', data?.meta);
  return (
    <>
      <Head>
        <title>챌린지 목록 페이지</title>
      </Head>

      <div className={styles.title}>
        <span>챌린지 목록</span>
        <button
          className={styles['new-challenge-button']}
          onClick={() => router.push('/application')}
        >
          <span>신규 챌린지 신청</span>
          <img
            src={images.icons.plus}
            alt="plus Icon"
            className={styles.icon}
          />
        </button>
      </div>
      <div className={styles.SearchContainer}>
        <ChallengeDropdown onOptionChange={handleOptionChange} />
        <ChallengeSearchBarLarge
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <AllCardSection
        data={data}
        site={'home'}
      />
      {data?.meta && (<Pagination
        currentPage={data.meta.currentPage}
        totalPages={data.meta.totalPages} // 계산된 totalPages 사용
        onPageChange={setCurrentPage}
      />
      )}
    </>
  );
}
