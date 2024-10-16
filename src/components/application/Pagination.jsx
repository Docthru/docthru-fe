import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page); // 페이지 업데이트
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles['page-button']} ${
            i === currentPage ? styles.active : ''
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles['arrow-button']}
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        style={{ color: currentPage === 1 ? '#A3A3A3' : '#262626' }} // 색상 적용
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            currentPage === 1
              ? styles['disabled-arrow']
              : styles['enabled-arrow']
          }
        >
          <path
            d="M23 14L17 20L23 26"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {renderPages()}

      <button
        className={styles['arrow-button']}
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        style={{ color: currentPage === totalPages ? '#A3A3A3' : '#262626' }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            currentPage === totalPages
              ? styles['disabled-arrow']
              : styles['enabled-arrow']
          }
        >
          <path
            d="M17 14L23 20L17 26"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
