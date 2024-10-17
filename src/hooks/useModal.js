'use client';

import AlertModal from '@/components/modals/AlertModal';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export function useModalAction() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);
  const [nextAction, setNextAction] = useState();

  const router = useRouter();
  const modalRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [isModalOpen]);

  const onModalOpen = ({ msg = '', path = null, action = null }) => {
    setIsModalOpen(true);
    setModalMsg(msg);

    if (path) {
      setRedirectTo(path);
    }
    if (action) {
      setNextAction(action);
    }
  };

  const onModalClose = () => {
    if (modalRef.current) {
      modalRef.current.close();
      setIsModalOpen(false);

      if (redirectTo) {
        router.push(redirectTo);
        setRedirectTo(null);
      }

      if (typeof nextAction === 'function') {
        nextAction();
        setNextAction(null);
      }
    }
  };

  return {
    modalRef,
    onModalOpen,
    onModalClose,
    isModalOpen,
    modalMsg,
  };
}

export const useModal = () => {
  const { modalRef, onModalOpen, onModalClose, isModalOpen, modalMsg } =
    useModalAction();

  const Modal = () => {
    return (
      isModalOpen && (
        <AlertModal msg={modalMsg} ref={modalRef} onClose={onModalClose} />
      )
    );
  };

  return { Modal, onModalOpen };
};
