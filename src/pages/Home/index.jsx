import { useContext } from 'react';
import styles from './index.module.css';
import { AuthContext } from '../../store/auth/AuthContext.js';
import UpFile from '../../components/UpFile/index.jsx';
import GalleryPortfolio from '../../components/GalleryPortfolio/index.jsx';

const Home = () => {
  const { currentAdmin } = useContext(AuthContext);

  return (
    <div className={styles.contentPageHome}>
      <div className={styles.container}>
        {currentAdmin && <UpFile props='portfolio' />}

        <div id='galleryPortfolio'>
          <GalleryPortfolio />
        </div>
      </div>
    </div>
  );
};

export default Home;
