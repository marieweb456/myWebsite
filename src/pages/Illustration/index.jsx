import { useContext } from 'react';
import styles from './index.module.css';
import { AuthContext } from '../../store/auth/AuthContext.js';
import UpFile from '../../components/UpFile/index.jsx';
import GalleryIllustration from '../../components/GalleryIllustration/index.jsx';

const Illustration = () => {
  const { currentAdmin } = useContext(AuthContext);

  return (
    <div className={styles.contentPageHome}>
      <div className={styles.container}>
        {currentAdmin && <UpFile props='illustration' />}

        <div id='galleryIllustration'>
          <GalleryIllustration />
        </div>
      </div>
    </div>
  );
};

export default Illustration;
