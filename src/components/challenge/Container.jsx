import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './Container.module.css';
import assets from '@/variables/images';
import { useRouter } from 'next/router';

const Container = ({
  deadline,
  participants,
  maxParticipants,
  progress = false,
  id,
  type,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 743px)' });
  const router = useRouter();

  const getButtonStyles = () => {
    return progress
      ? { backgroundColor: '#262626', color: '#FFFFFF' }
      : { backgroundColor: '#E5E5E5', color: '#737373' };
  };

  const formatDeadline = (dateTime) => {
    const date = new Date(dateTime);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return `${date.toLocaleString('ko-KR', options)} 마감`;
  };

  const getButtonType = (type) => {
    return type == 'start' ? '작업 도전하기' : '도전 계속하기';
  };

  return (
    <div className={styles.container}>
      <div className={styles['info-row']}>
        <img
          src={assets.icons.deadline}
          alt="deadline icon"
          className={styles.icon}
        />
        <span className={styles.text}>{formatDeadline(deadline)}</span>
        <img
          src={assets.icons.person}
          alt="person icon"
          className={styles.icon}
        />
        <span className={styles.text}>
          {participants}/{maxParticipants}
        </span>
      </div>

      {!isMobile ? (
        <>
          <div className={styles['view-original-button-row']}>
            <button className={styles['primary-button']}>원문 보기</button>
          </div>
          <div className={styles['challenge-button-row']}>
            <button
              className={styles['gray-button']}
              style={getButtonStyles()}
              onClick={() => router.push(`/work/create/?Id=${id}`)}
            >
              {getButtonType(type)}
            </button>
          </div>
        </>
      ) : (
        <div className={styles['mobile-buttons-row']}>
          <button className={styles['primary-button']}>원문 보기</button>
          <button
            className={styles['gray-button']}
            style={getButtonStyles()}
            onClick={() => router.push(`/work/edit/?Id=${id}`)}
          >
            {getButtonType(type)}
          </button>
        </div>
      )}
    </div>
  );
};

export default Container;
