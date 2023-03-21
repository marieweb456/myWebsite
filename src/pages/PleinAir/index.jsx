import { useContext } from 'react';
import styles from './index.module.css';
import { AuthContext } from '../../store/auth/AuthContext.js';
import UpFile from '../../components/UpFile/index.jsx';
import GalleryPleinAir from '../../components/GalleryPleinAir/index.jsx';

const PleinAir = () => {
  const { currentAdmin } = useContext(AuthContext);

  return (
    <div className={styles.contentPageHome}>
      <div className={styles.container}>
        {currentAdmin && <UpFile props='pleinAir' />}
        <div id='galleryPleinAir'>
          <GalleryPleinAir />
        </div>
      </div>
    </div>
  );
};

export default PleinAir;
