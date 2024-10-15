import AlertModal from '@/components/modals/AlertModal';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export function useModalAction() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);

  const router = useRouter();

  const modalRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [isModalOpen]);

  const onModalOpen = ({ msg, path }) => {
    setIsModalOpen(true);
    setModalMsg(msg);

    if (path) {
      setRedirectTo(() => router.push(path));
    }
  };

  const onModalClose = () => {
    if (modalRef.current) {
      if (redirectTo) {
        router.push(redirectTo);
      }
      modalRef.current.close();
      setIsModalOpen(false);
      setRedirectTo(null);
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
    isModalOpen && (
      <AlertModal msg={modalMsg} ref={modalRef} onClose={onModalClose} />
    );
  };

  return { Modal, onModalOpen };
};