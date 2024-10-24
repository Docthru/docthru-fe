// cNotification.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import Image from 'next/image';
import assets from '../../variables/images';
import styles from './Notification.module.css';
import { fetchNotifications, markAsRead } from '../../service/api/notification';
import Loader from '../common/Loader';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가
  const { user } = useAuth();

  const getNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetchNotifications(user.id, true);
      console.log('Received notifications:', response); // 디버깅용 로그

      if (response.length === 0) {
        // 알림이 없을 때는 에러가 아니라 알림이 없음을 처리
        setNotifications([]);
        setError(null);
      } else {
        setNotifications(response);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error); // 디버깅용 로그
      setError('알림을 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      console.log(`읽음 처리할 알림 아이디: ${notificationId}`); // 알림 아이디 출력
      const response = await markAsRead(notificationId); // 읽음 처리 API 호출
      console.log(`읽음 처리 요청이 ${notificationId} 알림으로 전송됨`); // 알림 전송 확인
      console.log('읽음 처리 응답:', response); // 응답 내용 출력
      await getNotifications(); // 알림 목록 갱신
      console.log('알림 목록 갱신 완료');
    } catch (error) {
      console.error(`알림 ID ${notificationId} 읽음 처리 중 오류 발생`); // 알림 아이디와 함께 오류 메시지
      console.error('오류 메시지:', error.message); // 에러 메시지 출력
      console.error('서버 응답:', error.response?.data || '응답 없음'); // 서버 응답이 있으면 출력
      console.error('상태 코드:', error.response?.status || '상태 코드 없음'); // 상태 코드 출력
      console.error('전체 오류 정보:', error); // 전체 오류 객체 출력
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  const formatNotification = (notification) => {
    console.log('알림 데이터:', notification);
    return notification.content;
  };

  return (
    <div className={styles.notificationContainer}>
      <button
        onClick={toggleNotifications}
        className={styles.notificationButton}
      >
        <Image
          src={
            hasUnreadNotifications
              ? assets.icons.bellAlert
              : assets.icons.bellEmpty
          }
          alt="알림"
          width={24}
          height={24}
        />
      </button>
      {showNotifications && (
        <div className={styles.notificationList}>
          {loading ? ( // 로딩 중일 때 Loader 컴포넌트 표시
            <Loader msg="알림을 불러오는 중" />
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${
                  notification.isRead ? styles.read : styles.unread
                }`}
              >
                <p className={styles.notificationMessage}>
                  {formatNotification(notification)}
                </p>
                <p className={styles.notificationDate}>
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={styles.readButton}
                  >
                    읽음 처리
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noNotifications}>새로운 알림이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
