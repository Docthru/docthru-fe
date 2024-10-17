import { useState, useEffect, useRef } from 'react';
import styles from './KebabMenu.module.css';
import assets from '@/variables/images';
import Image from 'next/image';

export default function KebabMenu({ onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickEdit = () => {
    setIsOpen(false);
    onEdit();
  };

  const handleClickDelete = () => {
    setIsOpen(false);
    onDelete();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <div className={styles.KebabMenu} ref={dropDownRef}>
        <button onClick={toggleDropDown}>
          <Image
            src={assets.icons.meatballsMenu}
            width={24}
            height={24}
            alt="kebab menu icon"
          />
        </button>
        {isOpen && (
          <ul className={styles.lists}>
            <li onClick={handleClickEdit} className={styles.list}>
              수정하기
            </li>
            <li onClick={handleClickDelete} className={styles.list}>
              삭제하기
            </li>
          </ul>
        )}
      </div>
    </>
  );
}
