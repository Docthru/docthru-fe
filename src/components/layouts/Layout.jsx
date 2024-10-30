'use client';

import { useRouter } from 'next/router';
import { AdminHeader, MemberHeader, AuthHeader } from './Headers';
import styles from './Layout.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PUBLIC_ROUTES, AUTH_ROUTES } from '@/variables/variables';
import { useAlertModal } from '@/hooks/useModal';
import cn from '@/utils/clsx';

export default function Layout({ children }) {
  const router = useRouter();
  const routes = useMemo(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
    const isAuthPage = AUTH_ROUTES.includes(router.pathname);
    const isAdminRoute = router.pathname.startsWith('/admin');
    const isAuthRoute = router.pathname.startsWith('/auth');
    //동적 경로와 new페이지는 max-width:890px
    const isNarrowerPage = /\[.*\]|\/new/.test(router.route);
    const isUserRoute = router.pathname.startsWith('/me');
    const isTextEditPage =
      router.route === '/work/new/[id]' || router.route === '/work/[id]/edit';

    return {
      isPublicRoute,
      isAuthPage,
      isAdminRoute,
      isAuthRoute,
      isNarrowerPage,
      isUserRoute,
      isTextEditPage,
    };
  }, [router.route, router.pathname]);

  const { user, isLoading, isRedirecting } = useAuth();
  const { Modal, onModalOpen } = useAlertModal();

  const handleRedirects = useCallback(() => {
    if (!isRedirecting && !isLoading) {
      if (!user && !routes.isPublicRoute) {
        onModalOpen({ msg: '로그인이 필요합니다.', path: '/auth/login' });
        return;
      }

      if (user && routes.isAuthPage) {
        return;
      }

      if (user && routes.isAdminRoute) {
        if (user.role !== 'ADMIN')
          onModalOpen({ msg: '권한이 없는 페이지 요청입니다.', path: '/' });
        return;
      }

      if (user && routes.isUserRoute) {
        if (user.role === 'ADMIN') {
          router.push('/admin');
        }
      }
    }
  }, [
    user,
    isRedirecting,
    routes.isAuthPage,
    routes.isAdminRoute,
    router.asPath,
  ]);

  useEffect(() => {
    if (!isLoading && !isRedirecting && user !== undefined) {
      handleRedirects();
    }
  }, [handleRedirects, isLoading, isRedirecting, user]);

  const renderHeader = () => {
    const hiddenOnMobile = routes.isTextEditPage ? styles.headerHidden : '';

    if (routes.isAuthRoute) return <AuthHeader />;
    if (user?.role === 'ADMIN')
      return <AdminHeader user={user} className={hiddenOnMobile} />;
    return <MemberHeader user={user} className={hiddenOnMobile} />;
  };

  return (
    <>
      {renderHeader()}
      <main
        className={cn(styles.main, {
          [styles['text-edit']]: routes.isTextEditPage,
          [styles.detail]: routes.isNarrowerPage && !routes.isTextEditPage,
        })}
      >
        {children}
      </main>
      <Modal />
    </>
  );
}
