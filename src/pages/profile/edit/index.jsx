import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from '@/service/api/axios';
import UpdateProfile from '@/components/mypage/UpdateProfile';
import MyPageNav from '@/components/mypage/MyPageNav';
import Loader from '@/components/common/Loader';
import { toast } from 'react-hot-toast';
import styles from '@/styles/pages/profile/editprofilepage.module.css';

function EditProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const fetchProfileData = useCallback(async (currentUserId) => {
    if (!currentUserId) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(response.data);
      setProfileName(response.data.user.nickname || '');
      setProfileImg(response.data.user.image || null);
      setError(null);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError(
        error.response?.data?.message || '프로필을 불러오는데 실패했습니다.'
      );
      toast.error('프로필을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(window.atob(payload));
        setUserId(decoded.userId);
        fetchProfileData(decoded.userId);
      } catch (error) {
        console.error('토큰 디코드 실패:', error);
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [fetchProfileData, router]);

  const handleProfileNameChange = (event) => {
    setProfileName(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB를 초과할 수 없습니다.');
        event.target.value = '';
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        event.target.value = '';
        return;
      }

      // 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64URL = reader.result;
        setProfileImg(base64URL);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (formData) => {
    if (!formData.get('nickname') && !formData.get('image')) {
      toast.error('변경할 내용이 없습니다.');
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/my`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        toast.success('프로필이 성공적으로 업데이트되었습니다.');
        await fetchProfileData(userId);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.status === 413) {
        toast.error('파일 크기가 너무 큽니다.');
      } else if (error.response?.status === 415) {
        toast.error('지원하지 않는 파일 형식입니다.');
      } else {
        toast.error(
          error.response?.data?.message || '프로필 업데이트에 실패했습니다.'
        );
      }
      setError(
        error.response?.data?.message || '프로필 업데이트에 실패했습니다.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <Loader msg="프로필 정보를 불러오는 중..." />;
  }

  if (error) {
    return (
      <div className={styles.error_container}>
        <p className={styles.error_text}>Error: {error}</p>
        <button
          onClick={() => fetchProfileData(userId)}
          className={styles.retry_button}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const data = {
    profileImg,
    profileName,
  };

  return (
    <>
      {profileData && (
        <>
          <MyPageNav
            userInfo={{
              ...profileData.user,
              userId: profileData.userId,
            }}
          />
          <UpdateProfile
            data={data}
            profileName={profileName}
            handleNameValue={handleProfileNameChange}
            handleUpload={handleFileUpload}
            onUpdate={handleProfileUpdate}
            isUpdating={isUpdating}
          />
        </>
      )}
    </>
  );
}

export default EditProfilePage;
