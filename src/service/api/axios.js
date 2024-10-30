import axios from 'axios';
import CAN_USE_DOM from '@/utils/canUseDom';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 토큰 갱신 상태 관리를 위한 변수들
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 에러 로깅 유틸리티
const ErrorLogger = {
  levels: {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
  },

  log(error, context, level = 'ERROR') {
    const errorLog = {
      timestamp: new Date().toISOString(),
      level,
      context,
      status: error.response?.status || error.status || 0,
      message: error.message || '알 수 없는 오류',
      url: error.config?.url,
      method: error.config?.method,
      subCode: error.response?.data?.error?.subCode,
    };

    // Development 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${errorLog.context}]`, errorLog);
    }

    // 프로덕션 환경에서는 에러 모니터링 서비스로 전송 가능
    // if (process.env.NODE_ENV === 'production') {
    //   sendToErrorMonitoring(errorLog);
    // }

    return errorLog;
  },

  // 특정 에러 타입에 대한 사용자 친화적 메시지 매핑
  getUserMessage(error) {
    const statusMessages = {
      400: '잘못된 요청입니다.',
      401: '인증이 필요합니다.',
      403: '접근 권한이 없습니다.',
      404: '요청하신 리소스를 찾을 수 없습니다.',
      409: '요청이 충돌했습니다.',
      500: '서버 오류가 발생했습니다.',
    };

    return (
      error.response?.data?.error?.message ||
      statusMessages[error.response?.status] ||
      '예상치 못한 오류가 발생했습니다.'
    );
  },
};

export const TokenService = {
  TOKEN_KEY: 'accessToken',
  get: () =>
    CAN_USE_DOM ? localStorage.getItem(TokenService.TOKEN_KEY) : null,
  set: (token) =>
    CAN_USE_DOM && localStorage.setItem(TokenService.TOKEN_KEY, token),
  remove: () => {
    if (CAN_USE_DOM) {
      localStorage.removeItem(TokenService.TOKEN_KEY);
    }
  },
  redirectToLogin: () => {
    if (CAN_USE_DOM && window.location.pathname !== '/auth/login') {
      window.location.href = '/auth/login';
    }
  },
};

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.get();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    ErrorLogger.log(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

export const resetAxiosAuth = () => {
  delete instance.defaults.headers.common['Authorization'];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const originalRequest = error.config;

      if (!CAN_USE_DOM) {
        return Promise.reject(error);
      }

      // 401 에러 처리
      if (error.response?.status === 401) {
        const subCode = error.response?.data?.error?.subCode;

        if (subCode === 1 && !originalRequest._retry) {
          if (isRefreshing) {
            // 토큰 갱신 중인 경우, 대기열에 추가
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return instance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const response = await instance.post('/users/token/refresh');
            const { accessToken } = response.data;

            if (accessToken) {
              TokenService.set(accessToken);
              instance.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${accessToken}`;

              // 대기 중인 요청들 처리
              processQueue(null, accessToken);

              return instance(originalRequest);
            }
          } catch (refreshError) {
            ErrorLogger.log(refreshError, 'Token Refresh', 'ERROR');
            processQueue(refreshError, null);
            TokenService.remove();
            resetAxiosAuth();
            TokenService.redirectToLogin();
            return Promise.reject({
              status: refreshError.response?.status || 401,
              message: '세션이 만료되었습니다. 다시 로그인해주세요.',
            });
          } finally {
            isRefreshing = false;
          }
        }

        if ([2, 3].includes(subCode)) {
          ErrorLogger.log(error, 'Authentication', 'WARN');
          TokenService.remove();
          resetAxiosAuth();
          TokenService.redirectToLogin();
        }

        return Promise.reject({
          status: error.response.status,
          subCode,
          message: ErrorLogger.getUserMessage(error),
        });
      }

      // 기타 에러 처리
      if ([400, 409].includes(error.response?.status)) {
        ErrorLogger.log(error, 'API Error', 'WARN');
        return Promise.reject({
          status: error.response.status,
          message: error.response.data.error.message,
          handled: true,
        });
      }

      // 예상치 못한 에러
      ErrorLogger.log(error, 'Unexpected Error', 'ERROR');
      return Promise.reject({
        status: error.response?.status || 0,
        message: ErrorLogger.getUserMessage(error),
      });
    } catch (interceptorError) {
      ErrorLogger.log(interceptorError, 'Interceptor Error', 'ERROR');
      return Promise.reject({
        status: 0,
        message: '예상치 못한 오류가 발생했습니다.',
      });
    }
  }
);

export default instance;
