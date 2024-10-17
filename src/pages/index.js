import { useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import ChallengeSearchBarLarge from '../components/common/ChallengeSearchBarLarge';
import images from '../variables/images';

import AllCardSection from '@/components/challenge/AllCardSection';
import ChallengeDropdown from '../components/challenge/ChallengeDropdown';
import styles from '../styles/pages/Home.module.css';
import { useGetChallenges } from '@/service/queries/challenge';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/application/Pagination';
import { keepPreviousData } from '@tanstack/react-query';

export default function Home() {
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState({
    field: '',
    docType: '',
    status: '',
  });
  const { data, isPending } = useGetChallenges(selectedOption, {
    enabled: true,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const { meta = {}, list = [] } = data || {};
  const { totalPages = 1, currentPage: page = 1 } = meta;
  const [currentPage, setCurrentPage] = useState(page);

  const handleOptionChange = (option) => {
    setSelectedOption((pev) => ({ ...pev, option }));
  };

  if (isPending) {
    return <Loader />;
  }

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
        list={list}
        searchTerm={searchTerm}
        selectedOption={selectedOption}
        site={'home'}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages} // 계산된 totalPages 사용
        onPageChange={setCurrentPage}
      />
    </>
  );
}
