import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';
import { storage } from '../../firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import styles from './index.module.css';

const Locked = () => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(
    JSON.parse(localStorage.getItem('isBlocked')) || false
  );
  const [blockTime, setBlockTime] = useState(JSON.parse(localStorage.getItem('blockTime')) || null);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [images, setImages] = useState([]);

  let jwt = require('jsonwebtoken');

  const key_token = process.env.REACT_APP_KEY_TOKEN;
  const key_token2 = process.env.REACT_APP_KEY_TOKEN_REF;
  const accessTokenExpiry = 2 * 60; // 2 minutes
  const refreshTokenExpiry = 2 * 60 * 60; // 2 heures exprimé en secondes

  const generateAccessToken = () => {
    return jwt.sign({}, key_token, { expiresIn: '2m' });
  };

  const generateRefreshToken = () => {
    return jwt.sign({}, key_token2, { expiresIn: '2h' });
  };

  const checkAccessToken = () => {
    const accessToken = Cookies.get('access_token');
    return accessToken ? accessToken : null;
  };

  const checkRefreshToken = () => {
    const refreshToken = Cookies.get('refresh_token');
    return refreshToken ? refreshToken : null;
  };

  const setAccessTokenInCookie = (accessToken) => {
    try {
      Cookies.set('access_token', accessToken, {
        secure: true, // uniquement pour HTTPS
        sameSite: 'strict', // uniquement pour le même domaine
        httpOnly: false, // uniquement accessible par le serveur
        expires: accessTokenExpiry / 60 / 60, // convertir les secondes en heures pour l'expiration
      });
    } catch (err) {
      console.log('error in catch : ', err);
    }
  };
  // Math.floor(Date.now() / 1000) + (60 * 60)
  const setRefreshTokenInCookie = (refreshToken) => {
    try {
      Cookies.set('refresh_token', refreshToken, {
        secure: true, // uniquement pour HTTPS
        sameSite: 'strict', // uniquement pour le même domaine
        httpOnly: false, // uniquement accessible par le serveur
        expires: refreshTokenExpiry / 60 / 60, // convertir les secondes en heures pour l'expiration
      });
    } catch (err) {
      console.log('error in catch : ', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('isBlocked', JSON.stringify(isBlocked));
  }, [isBlocked]);

  useEffect(() => {
    localStorage.setItem('blockTime', JSON.stringify(blockTime));
  }, [blockTime]);

  useEffect(() => {
    if (attempts >= 5) {
      const currentTime = Date.now();
      setBlockTime(currentTime);
      setIsBlocked(true);
      setTimeout(() => {
        setAttempts(0);
        setIsBlocked(false);
        setBlockTime(null);
      }, 60 * 60 * 1000);
    }
  }, [attempts]);

  useEffect(() => {
    if (blockTime) {
      const remainingTime = 60 * 60 * 1000 - (Date.now() - blockTime);
      if (remainingTime > 0) {
        setTimeout(() => {
          setAttempts(0);
          setIsBlocked(false);
          setBlockTime(null);
        }, remainingTime);
      }
    }
  }, [blockTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      setError('Too many attempts, try again later.');
      return;
    }
    setAttempts(attempts + 1);

    try {
      let compare = await bcrypt.compare(password, process.env.REACT_APP_WORLD);
      if (compare) {
        try {
          const accessToken = generateAccessToken();
          setAccessTokenInCookie(accessToken);
          setLoggedIn(true);
          setAttempts(0);
          setError('');
        } catch (err) {
          console.log('error in compare');
          setLoggedIn(false);
        }
      } else {
        console.log('Invalid Password');
        setLoggedIn(false);
        setError('Invalid Password');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // produire la refreshToken
  useEffect(() => {
    let intervalId;
    const refreshTokenThreshold = 30; // seuil de rafraîchissement en secondes
    const currentTime = Date.now() / 1000;

    const checkAndRenewRefreshToken = async () => {
      const accessToken = Cookies.get('access_token');
      if (!accessToken) return;

      try {
        const tokenExpiryTime = jwt.decode(accessToken).exp;

        if (tokenExpiryTime - currentTime <= refreshTokenThreshold) {
          const newRefreshToken = generateRefreshToken();
          // mettre à jour le refresh token
          setRefreshTokenInCookie(newRefreshToken);
          setLoggedIn(true);
        }
      } catch (err) {
        console.error(err);
        setLoggedIn(false);
      }
    };

    checkAndRenewRefreshToken();
    if (!intervalId) {
      intervalId = setInterval(checkAndRenewRefreshToken, 2000);
    }
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyToken = (token, obj) => {
    let decoded = null;
    if (token) {
      try {
        if (obj === 1) {
          decoded = jwt.verify(token, key_token);
        } else if (obj === 2) {
          decoded = jwt.verify(token, key_token2);
        }

        console.log('decoded token : ', decoded);
        return decoded;
      } catch (err) {
        console.log('Error in catch verifyToken : ', err);
        return false;
      }
    }
  };

  // control du statut au chargement ou à une modif
  useEffect(() => {
    let isAccessTokenValid = checkAccessToken();
    let isRefreshTokenValid = checkRefreshToken();
    const refreshCook = Cookies.get('refresh_token');
    let accessokenValid = false;
    let refreshTokenValid = false;

    if (isAccessTokenValid) {
      console.log('accessCook present');
      let obj = 1;
      accessokenValid = verifyToken(isAccessTokenValid, obj);
    }
    if (!accessokenValid && isRefreshTokenValid) {
      console.log('!accessCook empty in check');
      let obj = 2;
      refreshTokenValid = verifyToken(isRefreshTokenValid, obj);
      if (isAccessTokenValid) {
        Cookies.remove('access_token');
      }
    }

    if (!accessokenValid && !refreshTokenValid) {
      console.log('accessCook && refreshCook empty');
      if (refreshCook) {
        Cookies.remove('refresh_token');
      }
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  // download des images si le statut est connecté
  useEffect(() => {
    if (loggedIn) {
      const imagesListRef = ref(storage, 'images/category/privates/');
      listAll(imagesListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImages((prev) => [...prev, url]);
            // setImages(url);
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.passContent}>
          <label htmlFor='pass'>Password :</label>
          <input
            id='pass'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength='8'
            maxLength='15'
            pattern='[0-9a-zA-Z]{8,15}'
            required
          />
          <button type='submit'>Submit</button>
        </div>
      </form>
      {error && <p>{error}</p>}
      {loggedIn && images.map((image, index) => <img src={image} alt='' key={index} />)}
    </div>
  );
};

export default Locked;
