import styles from './MyPageChallengeCard.module.css';

const MyPageChallengeButton = ({
  currentIndex,
  setCurrentIndex,
  action,
  length,
  size,
}) => {
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const goToNext = () => {
    let maxIndex;

    if (size === 'mobile') {
      maxIndex = length - 1;
    } else if (size === 'tablet') {
      maxIndex = Math.ceil(length / 2) - 1;
    } else {
      maxIndex = Math.ceil(length / 3) - 1;
    }

    if (currentIndex < maxIndex) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else if (currentIndex === maxIndex) {
      setCurrentIndex(0);
    }
  };

  const shouldShowButton =
    (size === 'mobile' && length > 1) ||
    (size === 'tablet' && length > 2) ||
    (size === 'web' && length > 3);

  return (
    <>
      {action === 'goToPrevious' && (
        <button
          className={styles.CardButton}
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          style={{
            visibility: shouldShowButton ? 'visible' : 'hidden',
          }}
        >
          &lt;
        </button>
      )}
      {action === 'goToNext' && (
        <button
          className={styles.CardButton}
          onClick={goToNext}
          style={{
            visibility: shouldShowButton ? 'visible' : 'hidden',
          }}
        >
          &gt;
        </button>
      )}
    </>
  );
};

export default MyPageChallengeButton;
