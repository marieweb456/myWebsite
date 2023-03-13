import styles from './index.module.css';
import { useEffect, useRef, useState } from 'react';

const ModalImg = ({ isOpen, onClose, children }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen && width >= 900) {
      document.body.style.overflow = 'hidden';
      handleResize();
      window.addEventListener('resize', handleResize);
    } else {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleResize);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleResize = () => {
    if (contentRef.current && width >= 900) {
      const { naturalWidth, naturalHeight } = contentRef.current.querySelector('img');
      const viewportWidth = window.innerWidth - 64; // soustraire le padding et les bordures pour la largeur
      const viewportHeight = window.innerHeight - 64; // soustraire le padding et les bordures pour la hauteur
      const aspectRatio = naturalWidth / naturalHeight;
      const fitWidth =
        aspectRatio > 1
          ? Math.min(naturalWidth, viewportWidth)
          : Math.min(naturalWidth, viewportHeight * aspectRatio);
      const fitHeight =
        aspectRatio > 1
          ? Math.min(naturalHeight, viewportWidth / aspectRatio)
          : Math.min(naturalHeight, viewportHeight);
      contentRef.current.style.width = `${fitWidth}px`;
      contentRef.current.style.height = `${fitHeight}px`;
    }
  };

  // gestion taille écran
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <>
      {width >= 900 ? (
        <div className={`${styles.modal} ${isOpen ? styles.open : styles.closed}`}>
          <div
            className={styles.content}
            ref={contentRef}
            onContextMenu={(e) => e.preventDefault()}
          >
            <button className={styles.closeButton} onClick={onClose}>
              X
            </button>
            {children}
          </div>
        </div>
      ) : (
        null && (isOpen = false)
      )}
    </>
  );
};

export default ModalImg;
