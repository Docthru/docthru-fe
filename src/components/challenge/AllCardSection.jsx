import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';

import Pagination from '../../components/application/Pagination';

import Card from '../../components/challenge/Card';

import styles from './AllCardSection.module.css';

const AllCardSection = ({
  data,
  currentPage,
  setCurrentPage,
  searchTerm,
  selectedOption,
  site,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 743px)' });
  const { meta, list } = data;

  // const getMobilePage = () => {
  //   isMobile ? setItemsPerPage(4) : setItemsPerPage(5);
  // };

  // useEffect(() => {
  //   getMobilePage();
  // }, [isMobile]);

  // const filteredData = seedData.filter((item) => {
  //   const today = new Date();
  //   const deadline = new Date(item.deadline);

  //   if (
  //     searchTerm &&
  //     !item.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   ) {
  //     return false;
  //   }

  //   if (site === 'ongoing') {
  //     if (deadline > today) {
  //       return item;
  //     }
  //   } else if (site === 'done') {
  //     if (deadline <= today) {
  //       return item;
  //     }
  //   } else return item;

  //   if (selectedOption === '') {
  //     return true;
  //   }
  //   if (selectedOption === 'Next.js') {
  //     return item.field === 'NEXTJS';
  //   } else if (selectedOption === 'Modern JS') {
  //     return item.field === 'MODERNJS';
  //   } else if (selectedOption === 'API') {
  //     return item.field === 'API';
  //   } else if (selectedOption === 'Web') {
  //     return item.field === 'WEB';
  //   } else if (selectedOption === 'Career') {
  //     return item.field === 'CAREER';
  //   }
  // });

  // // 페이지 수 계산
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // // 현재 페이지의 데이터만 추출
  // const list = filteredData.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  return (
    <>
      <div className={styles.challengeTableWrapper}>
        {list.length > 0 ? (
          <>
            <div className={styles.AllCardSection}>
              {list.map((challenge) => (
                <Card key={`${list.id}`} data={challenge} site={site} />
              ))}
            </div>
            {/* <div className={styles.paginationWrapper}>
             
            </div> */}
          </>
        ) : (
          <div className={styles.noChallenges}>아직 챌린지가 없어요.</div>
        )}
      </div>
    </>
  );
};

export default AllCardSection;
