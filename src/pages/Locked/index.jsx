import { useState, useEffect, useContext } from 'react';
import CryptoJS from 'crypto-js';
import styles from './index.module.css';
import { AuthContext } from '../../store/auth/AuthContext.js';
import Upfile from '../../components/UpFile/index.jsx';
import GalleryLocked from '../../components/GalleryLocked/index.jsx';
import { ImEye } from 'react-icons/im';
import { ImEyeBlocked } from 'react-icons/im';

const Locked = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { currentAdmin } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);

  // formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let hashedPassword = CryptoJS.SHA256(password).toString();

      if (hashedPassword === process.env.REACT_APP_MY_WORD) {
        try {
          setLoggedIn(true);
          dispatch({ type: 'CONNECTED_ON', payload: 'connected' });
          setError('');
        } catch (err) {
          console.log('error in compare');
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
        setError('Invalid Password');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------

  // déconnexion de l'utilisateur lambda du password
  const [refresh, setRefresh] = useState(JSON.parse(localStorage.getItem('refresh') || false));

  useEffect(() => {
    // Récupérer la valeur de refresh à partir du stockage local
    let localRefresh = JSON.parse(localStorage.getItem('refresh'));
    console.log('useEffect in');
    console.log('currentUser : ', currentUser);
    if (currentUser) {
      console.log('in loggedIn');
      const disconnectTime = JSON.parse(localStorage.getItem('disconnectTime'));
      if (disconnectTime) {
        console.log('in disconnectTime');
        const remainingTime = 1000 * 60 * 60 * 2 - (Date.now() - JSON.parse(disconnectTime));
        if (remainingTime > 0) {
          setTimeout(() => {
            console.log('');
            dispatch({ type: 'CONNECTED_OFF' });
            localStorage.setItem('user', null);
            localStorage.setItem('disconnectTime', null);
            setLoggedIn(false);
            window.location.reload();
          }, remainingTime);
        }
      } else {
        console.log('in else disconnectTime');
        const currentTime = Date.now();
        localStorage.setItem('disconnectTime', JSON.stringify(currentTime));
        setTimeout(() => {
          dispatch({ type: 'CONNECTED_OFF' });
          localStorage.setItem('user', null);
          localStorage.setItem('disconnectTime', null);
          setLoggedIn(false);
          window.location.reload();
        }, 1000 * 60 * 60 * 2);
      }
    }

    // Récupérer la valeur de refresh à partir du stockage local ou utiliser la valeur par défaut
    // toutes les 5 minutes l'entièreté de ce useEffect sera répété, pour contrôler l'accès user
    const interval = setInterval(() => {
      setRefresh((prevRefresh) => !prevRefresh);
    }, (localRefresh || 5) * 60 * 1000);

    // Enregistrer la valeur de refresh dans le stockage local à chaque mise à jour
    localStorage.setItem('refresh', JSON.stringify(refresh));

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, refresh, currentUser]);

  // -----------

  // gestion de l'état du bouon pour voir PW
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.contentPageLocked}>
      {currentAdmin || currentUser ? null : (
        <div className={styles.globalPassContent}>
          <form onSubmit={handleSubmit}>
            <div className={styles.passContent}>
              <label htmlFor='pass'>password</label>
              <div className={styles.contentPasswordAndShowBtn}>
                <input
                  id='pass'
                  // type='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength='8'
                  maxLength='15'
                  pattern='[0-9a-zA-Z]{8,15}'
                  required
                />
                <button className={styles.showBtn} type='button' onClick={toggleShowPassword}>
                  {showPassword ? <ImEyeBlocked /> : <ImEye />}
                </button>
              </div>
              {error && <p>{error}</p>}
            </div>
          </form>
        </div>
      )}
      {currentAdmin && <Upfile props='locked' />}
      {(loggedIn || currentAdmin || currentUser) && <GalleryLocked />}
    </div>
  );
};

export default Locked;
