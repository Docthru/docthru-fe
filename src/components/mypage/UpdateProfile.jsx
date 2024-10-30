// UpdateProfile.js
import styles from './UpdateProfile.module.css';
import assets from '@/variables/images';
import Svg from '@/components/common/Svg';
import Image from 'next/image';
import Button from '@/components/common/Button';

export default function UpdateProfile({
  profileName,
  data,
  handleNameValue,
  handleUpload,
  onUpdate,
  isUpdating,
}) {
  const handleSubmit = async () => {
    const formData = new FormData();

    // 프로필 이미지가 변경되었다면 추가
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }

    // 닉네임 추가
    if (profileName) {
      formData.append('nickname', profileName);
    }

    await onUpdate(formData);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles['profile-img']}>
        <div className={styles['img-container']}>
          <Image
            className={styles['img']}
            src={data?.profileImg || assets.images.profileMember}
            fill
            alt="profile image"
            priority
          />
        </div>
        <button
          className={styles['import-button']}
          onClick={() => document.getElementById('fileInput').click()}
          disabled={isUpdating}
          type="button"
        >
          <Svg name="import" width="30px" />
        </button>
      </div>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleUpload(e)}
        disabled={isUpdating}
      />

      <div className={styles['profile-info']}>
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          className={styles['profile-input']}
          value={profileName}
          onChange={handleNameValue}
          disabled={isUpdating}
        />
        <Button
          onClick={handleSubmit}
          className={styles['profile-button']}
          variant="black"
          disabled={isUpdating}
        >
          {isUpdating ? '업데이트 중...' : '수정하기'}
        </Button>
      </div>
    </section>
  );
}
