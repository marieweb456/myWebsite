import { useState, useEffect, useContext } from 'react';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import styles from './index.module.css';
import { AuthContext } from '../../store/auth/AuthContext.js';
import Upfile from '../../components/UpFile/index.jsx';
import GalleryLocked from '../../components/GalleryLocked/index.jsx';

const Locked = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { currentAdmin } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);

  // let hashedPassword = CryptoJS.SHA256('goodvibes').toString();

  // console.log('hashedPassword : ', hashedPassword);

  // const handleTest = async (e) => {
  //   let text = 'goodvibes';
  //   let hash = await bcrypt.hash(text);
  //   console.log('hash : ', hash);
  // };
  // handleTest();

  // formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // let text = 'goodvibes';
      // let hash = await bcrypt.hash(text);
      // console.log('hash : ', hash);
      // alert('hash : ', hash);

      let hashedPassword = CryptoJS.SHA256(password).toString();
      // let compare = hashedPassword === process.env.REACT_APP_WORLD_HASH;
      console.log('hashedPassword : ', hashedPassword);

      // let compare = password === process.env.REACT_APP_WORLD;
      // console.log('process.env.REACT_APP_WORD : ', process.env.REACT_APP_WORD);
      // console.log('password : ', password);

      let compare = await bcrypt.compare(password, process.env.REACT_APP_WORD);
      if (compare) {
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

  // // déconnexion de l'utilisateur lambda du password
  useEffect(() => {
    if (loggedIn) {
      const currentTime = Date.now();
      localStorage.setItem('disconnectTime', JSON.stringify(currentTime));
      setTimeout(() => {
        dispatch({ type: 'CONNECTED_OFF' });
        localStorage.setItem('user', null);
        window.location.reload();
      }, 1000 * 60 * 60 * 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  useEffect(() => {
    const disconnectTime = JSON.parse(localStorage.getItem('disconnectTime'));
    if (disconnectTime) {
      const remainingTime = 1000 * 60 * 60 * 2 - (Date.now() - disconnectTime);
      if (remainingTime > 0) {
        setTimeout(() => {
          dispatch({ type: 'CONNECTED_OFF' });
          localStorage.setItem('user', null);
          window.location.reload();
        }, remainingTime);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.contentPageLocked}>
      {currentAdmin || currentUser ? null : (
        <div className={styles.globalPassContent}>
          <form onSubmit={handleSubmit}>
            <div className={styles.passContent}>
              <label htmlFor='pass'>password {process.env.REACT_APP_WORD}</label>
              <input
                id='pass'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength='8'
                maxLength='15'
                pattern='[0-9a-zA-Z]{8,15}'
                required
                // autoFocus
              />
              {/* <button type='submit'>Submit</button> */}
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
