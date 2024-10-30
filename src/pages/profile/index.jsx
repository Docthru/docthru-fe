import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Loader from '@/components/common/Loader';
import axios from '@/service/api/axios';
import MyPageNav from '@/components/mypage/MyPageNav';
import Profile from '../../components/mypage/Profile';
import styles from '../../styles/pages/profile/Profile.module.css';

export default function ProfileIndex() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const fetchProfileData = useCallback(async (currentUserId) => {
    if (!currentUserId) return;

    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching profile for userId:', currentUserId);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Profile data received:', response.data);
      setProfileData(response.data);
      setError(null);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError(
        error.response?.data?.message || '프로필을 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, []);

  // 토큰에서 userId 추출 및 초기 데이터 로드
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
        setError('토큰 디코드 실패');
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [fetchProfileData, router]);

  const handleProfileUpdate = useCallback(
    async (updatedData) => {
      try {
        setIsUpdating(true);
        // 기존 데이터 임시 저장
        const tempData = {
          ...profileData,
          ...updatedData,
        };
        // 임시 데이터로 UI 업데이트
        setProfileData(tempData);

        // 새로운 데이터 fetching
        await fetchProfileData(userId);
      } catch (error) {
        console.error('Profile update error:', error);
        setError('프로필 업데이트에 실패했습니다.');
      }
    },
    [fetchProfileData, userId, profileData]
  );

  if (isLoading) {
    return <Loader msg="로딩 중" />;
  }

  if (error) {
    return (
      <div className={styles['error-container']}>
        <p className={styles['error-text']}>Error: {error}</p>
        <button
          onClick={() => fetchProfileData(userId)}
          className={styles['retry-button']}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.MainContent}>
      {profileData && (
        <>
          <MyPageNav
            userInfo={{
              ...profileData.user,
              userId: profileData.userId,
            }}
          />
          <Profile
            profileData={profileData}
            userId={userId}
            onUpdate={handleProfileUpdate}
          />
          {isUpdating && (
            <div className={styles['update-overlay']}>
              <div className={styles['update-modal']}>
                <p>업데이트 중...</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
