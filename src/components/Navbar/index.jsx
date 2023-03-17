import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/auth/AuthContext';
import { useContext } from 'react';
import styles from './index.module.css';
import { useState, useEffect } from 'react';
import Logo from '../../assets/images/logo3_marie.png';

const Navbar = () => {
  const { dispatch } = useContext(AuthContext);
  const { currentAdmin } = useContext(AuthContext);

  // gestion de l'effet "activeLink"
  const [activeLink, setActiveLink] = useState('/portfolio');
  const [isActive, setIsActive] = useState(false);

  const handleClick = (link) => {
    setActiveLink(link);
    setIsActive(!isActive);
  };

  const handleClickBurger = () => {
    setIsActive(!isActive);
  };

  // gestion de la navbar avec la largeur d'écran
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // gestion du scroll
  const [navbarSize, setNavbarSize] = useState(false);

  const changeSizeNavbar = () => {
    if (window.scrollY >= 75) {
      setNavbarSize(true);
    } else {
      setNavbarSize(false);
    }
  };

  window.addEventListener('scroll', changeSizeNavbar);

  // détecter url et attribuer l'effet "activeLink" en fonction
  useEffect(() => {
    const currentPath = window.location.pathname;
    // console.log('currentPath : ', currentPath);
    switch (currentPath) {
      case '/portfolio':
        setActiveLink('portfolio');
        break;
      case '/pleinAir':
        setActiveLink('pleinAir');
        break;
      case '/illustration':
        setActiveLink('illustration');
        break;
      case '/locked':
        setActiveLink('locked');
        break;
      case '/about':
        setActiveLink('about');
        break;
      case '/login':
        setActiveLink('login');
        break;
      default:
        setActiveLink('portfolio');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <>
      {width >= 1060 && (
        <nav className={`${styles.mainNav} ${navbarSize ? `${styles.mainNavSize}` : ''}`}>
          <ul>
            <li>
              <Link
                className={styles.mainNavLogo}
                onClick={() => handleClick('portfolio')}
                to='/portfolio'
              >
                <img src={Logo} className={styles.logo} alt='Marie Ponceau' />
              </Link>
            </li>
            <div className={styles.mainNavRight}>
              <li>
                <Link
                  className={styles.mainNavItem}
                  onClick={() => handleClick('portfolio')}
                  to='/portfolio'
                >
                  <h2 className={`${activeLink === 'portfolio' ? `${styles.active}` : ''}`}>
                    PORTFOLIO
                  </h2>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.mainNavItem}
                  onClick={() => handleClick('pleinAir')}
                  to='/pleinAir'
                >
                  <h2 className={`${activeLink === 'pleinAir' ? `${styles.active}` : ''}`}>
                    PLEIN AIR
                  </h2>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.mainNavItem}
                  onClick={() => handleClick('illustration')}
                  to='/illustration'
                >
                  <h2 className={`${activeLink === 'illustration' ? `${styles.active}` : ''}`}>
                    ILLUSTRATION
                  </h2>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.mainNavItem}
                  onClick={() => handleClick('locked')}
                  to='/locked'
                >
                  <h2 className={`${activeLink === 'locked' ? `${styles.active}` : ''}`}>locked</h2>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.mainNavItem}
                  onClick={() => handleClick('about')}
                  to='/about'
                >
                  <h2 className={`${activeLink === 'about' ? `${styles.active}` : ''}`}>about</h2>
                </Link>
              </li>
              <li className={styles.separator}>
                <h2>|</h2>
              </li>
              {currentAdmin ? (
                <li>
                  <Link
                    className={styles.mainNavItem}
                    to='/login'
                    onClick={() => {
                      dispatch({ type: 'LOGOUT' });
                      handleClick('logout');
                      // localStorage.clear();
                      // localStorage.removeItem('user');
                    }}
                  >
                    <h2 className={`${activeLink === 'logout' ? `${styles.active}` : ''}`}>
                      logout
                    </h2>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    className={styles.mainNavItem}
                    onClick={() => handleClick('login')}
                    to='/login'
                  >
                    <h2 className={`${activeLink === 'login' ? `${styles.active}` : ''}`}>login</h2>
                  </Link>
                </li>
              )}
            </div>
          </ul>
        </nav>
      )}

      {width <= 1059 && (
        <nav className={`${styles.nav} ${navbarSize ? `${styles.mobNavSize}` : ''}`}>
          <div className={styles.container}>
            <img src={Logo} className={styles.logo} alt='Marie Ponceau' />
            <ul className={`${styles.menu} ${isActive ? styles.isOpen : ''}`}>
              <li>
                <Link onClick={() => handleClick('portfolio')} to='/portfolio'>
                  <h2 className={`${activeLink === 'portfolio' ? `${styles.active}` : ''}`}>
                    PORTFOLIO
                  </h2>
                </Link>
              </li>
              <li>
                <Link onClick={() => handleClick('pleinAir')} to='/pleinAir'>
                  <h2 className={`${activeLink === 'pleinAir' ? `${styles.active}` : ''}`}>
                    PLEIN AIR
                  </h2>
                </Link>
              </li>
              <li>
                <Link onClick={() => handleClick('illustration')} to='/illustration'>
                  <h2 className={`${activeLink === 'illustration' ? `${styles.active}` : ''}`}>
                    ILLUSTRATION
                  </h2>
                </Link>
              </li>
              <li>
                <Link onClick={() => handleClick('locked')} to='/locked'>
                  <h2 className={`${activeLink === 'locked' ? `${styles.active}` : ''}`}>locked</h2>
                </Link>
              </li>
              <li>
                <Link onClick={() => handleClick('about')} to='/about'>
                  <h2 className={`${activeLink === 'about' ? `${styles.active}` : ''}`}>about</h2>
                </Link>
              </li>
              {currentAdmin ? (
                <li>
                  <Link
                    to='/login'
                    onClick={() => {
                      dispatch({ type: 'LOGOUT' });
                      handleClick('logout');
                      // localStorage.clear();
                      // localStorage.removeItem('user');
                    }}
                  >
                    <h2 className={`${activeLink === 'logout' ? `${styles.active}` : ''}`}>
                      logout
                    </h2>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link onClick={() => handleClick('/login')} to='/login'>
                    <h2 className={`${activeLink === 'login' ? `${styles.active}` : ''}`}>login</h2>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <button
            className={`${styles.btnBurger} ${isActive ? styles.isActive : ''}`}
            onClick={handleClickBurger}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      )}
    </>
  );
};

export default Navbar;
