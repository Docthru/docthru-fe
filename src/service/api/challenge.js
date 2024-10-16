import axios from './axios';

const PATH = '/challenges';

/** GET - 챌린지 목록 조회 */
export async function getChallengeList({ field, docType, status, search }) {
  const params = {
    ...(field && { field }),
    ...(docType && { docType }),
    ...(status && { status }),
    ...(search && { search }),
  };

  const res = await axios.get(`${PATH}`, { params });
  return res.data;
}

/** /:id GET - 챌린지 상세 조회 */
export async function getChallenge(id) {
  const res = await axios.get(`${PATH}/${id}`);
  return res.data;
}

/** /:id PATCH - 상세 챌린지 수정 - 어드민 */
export async function updateChallenge(id, data) {
  const res = await axios.patch(`${PATH}/${id}`, data);
  return res.data;
}

/** /:id DELETE - 상세 챌린지 삭제 - 어드민 */
export async function deleteChallenges(id) {
  const res = await axios.delete(`${PATH}/${id}`);
  return res.data;
}

/** /:id/participation POST - 번역 챌린지 참여 */
export async function createChallenge(id) {
  const res = await axios.post(`${PATH}/${id}/participation`);
  return res.data;
}

/** :id/original GET - 챌린지 원문 조회 */
export async function getChallengeOriginal(id) {
  const res = await axios.get(`${PATH}/${id}/original`);
  return res.data;
}
