import DocTypeChip from '../common/DocTypeChip';
import { Profile } from '../common/Profile';
import Container from './Container';

import styles from './ChallengeDetailInfo.module.css';

const ChallengeDetailInfo = ({ list, id }) => {
  const user = list?.writer;
  
  return (
    <>
      {list ? (
        <div className={styles.ChallengeDetailInfo}>
          <div className={styles['challenge-info']}>
            <div className={styles.title}>{list.title}</div>
            <DocTypeChip field={list.field} docType={list.docType} />
            <div className={styles.description}>{list.description}</div>
            <div className={styles['user-profile']}>
              {user && <Profile user={user} width="24px" type="simple" />}
            </div>
          </div>
          <Container
            list={list}
            id={id}
          />
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

export default ChallengeDetailInfo;
