import styles from './index.module.css';
// import { useContext, useState } from 'react';
import { useContext, useEffect, useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
// import { auth } from '../../firebase';
import { auth, providerGoogle } from '../../firebase.js';
// import { firebase } from '../../firebase';
import { useNavigate } from 'react-router-dom';
// import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../store/auth/AuthContext.js';

const Login = () => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  // const location = useLocation();
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // // gestion option connection formulaire via mail / mp
  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       console.log('user with email mdp : ', user);
  //       if (error) setError(false);
  //       dispatch({ type: 'LOGIN', payload: user });
  //       // if (location.pathname === '/login') navigate('/dashboard');
  //       setLoggedIn(true);
  //       // navigate('/dashboard');
  //     })
  //     .catch((error) => {
  //       setError(true);
  //       setLoggedIn(false);
  //       console.log('error connexion : ', error);
  //     });
  // };

  const SignInWithGoogle = (e) => {
    e.preventDefault();

    signInWithPopup(auth, providerGoogle)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user.uid !== process.env.REACT_APP_AUTH_UID) {
          throw new Error('Utilisateur non autorisé');
        }
        dispatch({ type: 'LOGIN', payload: 'adminConnect511' });
        setLoggedIn(true);
        if (error) setError(false);
        if (errorMsg) setErrorMsg(null);
      })
      .catch((error) => {
        setError(true);
        setErrorMsg('Unauthorized user');
        setLoggedIn(false);
        dispatch({ type: 'LOGOUT' });
        console.log('error connexion : ', error);
      });
  };

  useEffect(() => {
    if (loggedIn && isMounted) navigate('/portfolio');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, isMounted]);

  return loggedIn ? null : (
    <div className={styles.contentPage}>
      {errorMsg && <p>{errorMsg}</p>}
      <h2 className={styles.paragLogin}>Please, identify yourself</h2>

      {/* <form className={styles.contentForm} onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='email'
          className={styles.input}
          onChange={(e) => setEmail(e.target.value) && setError(false)}
        />
        <input
          type='password'
          placeholder='password'
          className={styles.input}
          onChange={(e) => setPassword(e.target.value) && setError(false)}
        />
        <button type='submit' className={styles.buttonConnect}>
          Se connecter
        </button>
        {error && <span>Mauvais email ou mot de passe entré</span>}
      </form>
      <br />
      ----- ou -----
      <br />
      <br /> */}
      <br />
      <div className={styles.contentBtnGoogle}>
        <div onClick={SignInWithGoogle} className={styles.btnGoogle}>
          Sign in with Google
        </div>
      </div>
    </div>
  );
};

export default Login;
