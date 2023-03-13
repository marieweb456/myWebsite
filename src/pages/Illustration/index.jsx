import { useContext } from 'react';
import styles from './index.module.css';
import { AuthContext } from '../../store/auth/AuthContext';
import UpFile from '../../components/UpFile';
import GalleryIllustration from '../../components/GalleryIllustration';

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
