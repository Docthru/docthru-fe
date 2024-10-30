import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Loader from '@/components/common/Loader';
import axios from '@/service/api/axios';
import MyPageNav from '@/components/mypage/MyPageNav.jsx';
import Profile from '../../components/mypage/Profile.jsx';
import styles from '@/styles/pages/profile/Profile.module.css';

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const fetchProfileData = useCallback(async () => {
    if (!id || !router.isReady) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('Fetching profile for id:', id);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}`,
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
    }
  }, [id, router.isReady]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(window.atob(payload));
        setLoggedInUserId(decoded.userId);
      } catch (error) {
        console.error('토큰 디코드 실패:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleProfileUpdate = useCallback(
    async (updatedData) => {
      try {
        setIsLoading(true);
        await fetchProfileData();
      } catch (error) {
        console.error('Profile update error:', error);
        setError('프로필 업데이트에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfileData]
  );

  if (!router.isReady || isLoading) {
    return <Loader msg="로딩 중" />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
        <button
          onClick={() => fetchProfileData()}
          className={styles.retryButton}
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
            userId={loggedInUserId}
            onUpdate={handleProfileUpdate}
          />
        </>
      )}
    </div>
  );
}
