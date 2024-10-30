import styles from './WorkDetail.module.css';
import DocTypeChip from '@/components/common/DocTypeChip';
import { Profile } from '@/components/common/Profile';
import LikeButton from '@/components/common/LikeButton';
import KebabMenu from '@/components/common/KebabMenu';
import { formatDate } from '@/utils/utilFunction';
import { useDeleteWork, useMutateLikes } from '@/service/mutations/work';
import { useDeleteModal } from '@/hooks/useModal';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css';
import cn from '@/utils/clsx';

export default function WorkDetail({ data }) {
  const router = useRouter();

  if (!data) {
    return <div>데이터 없음</div>;
  }

  const { isLike: isLiked, workId, challenge, isEditable, ...rest } = data;

  const { onModalOpen, Modal } = useDeleteModal();
  const { mutate: LikeMutate } = useMutateLikes(workId);
  const { mutate: deleteWork } = useDeleteWork();

  const handleEdit = (workId) => {
    return router.push(`/work/${workId}/edit`);
  };

  const handleDelete = (workId) => {
    if (workId) {
      deleteWork({ id: workId });
    }
  };

  const clickDelete = () => {
    onModalOpen({
      msg: '정말 삭제하시겠습니까?',
      action: () => handleDelete(workId),
    });
  };

  const toggleLikeButton = () => {
    if (workId) {
      LikeMutate({ id: workId, isLiked });
    }
  };

  return (
    <>
      <section className={styles.WorkDetail}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{data.challenge.title}</h1>
          {isEditable && (
            <KebabMenu
              onEdit={() => handleEdit(workId)}
              onDelete={() => clickDelete(workId)}
            />
          )}
        </div>
        <DocTypeChip field={challenge.field} docType={challenge.docType} />
        <div className={styles.info}>
          <div className={styles['user-info']}>
            <Profile user={rest} type="simple" />
            <LikeButton
              data={data}
              isButton={true}
              onClick={toggleLikeButton}
            />
          </div>
          <time className={styles.time}>{formatDate(data.createdAt)}</time>
        </div>
        <div className={cn('ql-snow', styles.container)}>
          <div
            className={cn(styles.content, 'ql-editor')}
            dangerouslySetInnerHTML={{ __html: data.content }}
          ></div>
        </div>
      </section>
      <Modal />
    </>
  );
}
