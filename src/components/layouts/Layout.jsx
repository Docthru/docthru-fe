import { useRouter } from 'next/router';
import { AdminHeader, MemberHeader, AuthHeader } from './Headers';
import styles from './Layout.module.css';
import { useCallback, useEffect } from 'react';
import Loader from '../common/Loader';
import { useAuth } from '@/hooks/useAuth';
import { PUBLIC_ROUTES, AUTH_ROUTES } from '@/variables/variables';
import { useAlertModal } from '@/hooks/useModal';

export default function Layout({ children, className = '' }) {
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
  const isAuthPage = AUTH_ROUTES.includes(router.pathname);
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isAuthRoute = router.pathname.startsWith('/auth');

  const isNarrowerPage = /\[.*\]|\/new/.test(router.pathname);

  const { user, isLoading } = useAuth(!isPublicRoute);

  const handleRedirects = useCallback(() => {
    if (!isLoading && user !== undefined) {
      if (!user && !isPublicRoute) {
        router.push('/auth/login');

        return;
      }
      if (user && isAuthPage) {
        router.push('/');

        return;
      }
      if (user && isAdminRoute && user.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [isLoading, user, isPublicRoute, isAuthPage, isAdminRoute, router]);

  useEffect(() => {
    if (!isLoading) {
      handleRedirects();
    }
  }, [handleRedirects, isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {isAuthRoute ? (
        <AuthHeader />
      ) : isAdminRoute ? (
        <AdminHeader user={user} />
      ) : (
        <MemberHeader user={user} />
      )}
      <main className={`${styles.main} ${isNarrowerPage && styles.detail}`}>
        {children}
      </main>
    </>
  );
}
