// service/api/notifications.js
import axios from './axios';

const PATH = '/notifications';
/** GET - 사용자의 모든 알림 조회 */
export async function fetchNotifications(userId, includeRead = false) {
  try {
    const res = await axios.get(`${PATH}/users/${userId}/notifications`, {
      params: { includeRead: includeRead.toString() },
    });
    return res.data;
  } catch (error) {
    console.error('알림 조회 중 오류 발생:', error);
    throw error;
  }
}
/** PUT - 알림을 읽음으로 표시 */
export async function markAsRead(notificationId) {
  // 알림 ID를 이용한 경로
  const id = Number(notificationId);
  console.log(`알림 ID: ${notificationId}`);
  const res = await axios.put(`${PATH}/${id}/read`);
  return res.data;
}
