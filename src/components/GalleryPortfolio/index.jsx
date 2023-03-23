import { useEffect, useState, useContext } from 'react';
import { storage } from '../../firebase.js';
import {
  ref as storageRef,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
  getStorage,
} from 'firebase/storage';
import styles from './index.module.css';
import { AuthContext } from '../../store/auth/AuthContext.js';
import { FiTrash2 } from 'react-icons/fi';
import ModalImg from '../ModalImg/index.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoadingSpinner from '../LoadingSpinner/index.jsx';

const GalleryPortfolio = () => {
  const { currentAdmin } = useContext(AuthContext);

  const [sortedImagesPortfolio, setSortedImagesPortfolio] = useState([]);
  const imgListRefPortfolio = storageRef(storage, 'images/category/portfolio/');
  const [firstLoad, setFirstLoad] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [visibleImages, setVisibleImages] = useState([]);
  const [selectedImageAlt, setSelectedImageAlt] = useState('');

  // ---------------

  // récupération et tri des images
  useEffect(() => {
    const storedImages = JSON.parse(sessionStorage.getItem('portfolioImages'));

    if (storedImages) {
      setSortedImagesPortfolio(storedImages);
      setFirstLoad(false);
      console.log('images from session storage');
    } else {
      console.log('images from bdd');
      listAll(imgListRefPortfolio).then((response) => {
        let index = 0;
        const images = response.items.map((item) => ({
          id: index++,
          url: '',
          metadata: null,
          name: item.name,
        }));

        const promises = response.items.map((item, index) =>
          Promise.all([getDownloadURL(item), getMetadata(item)]).then(([url, metadata]) => {
            images[index].url = url;
            images[index].metadata = metadata.customMetadata;
          })
        );

        Promise.all(promises).then(() => {
          setSortedImagesPortfolio(
            images.sort((a, b) => {
              if (a.metadata && b.metadata) {
                if (a.metadata.project && b.metadata.project) {
                  if (a.metadata.project.localeCompare(b.metadata.project) === 0) {
                    return new Date(a.metadata.uploadTime) - new Date(b.metadata.uploadTime);
                  } else {
                    if (!a.metadata.project) {
                      return -1;
                    } else if (!b.metadata.project) {
                      return 1;
                    } else {
                      return a.metadata.project.localeCompare(b.metadata.project);
                    }
                  }
                } else if (a.metadata.project) {
                  return -1;
                } else if (b.metadata.project) {
                  return 1;
                } else {
                  return new Date(a.metadata.uploadTime) - new Date(b.metadata.uploadTime);
                }
              } else {
                return 0;
              }
            })
          );

          sessionStorage.setItem(
            'portfolioImages',
            JSON.stringify(
              images.sort((a, b) => {
                if (a.metadata && b.metadata) {
                  if (a.metadata.project && b.metadata.project) {
                    if (a.metadata.project.localeCompare(b.metadata.project) === 0) {
                      return new Date(a.metadata.uploadTime) - new Date(b.metadata.uploadTime);
                    } else {
                      if (!a.metadata.project) {
                        return -1;
                      } else if (!b.metadata.project) {
                        return 1;
                      } else {
                        return a.metadata.project.localeCompare(b.metadata.project);
                      }
                    }
                  } else if (a.metadata.project) {
                    return -1;
                  } else if (b.metadata.project) {
                    return 1;
                  } else {
                    return new Date(a.metadata.uploadTime) - new Date(b.metadata.uploadTime);
                  }
                } else {
                  return 0;
                }
              })
            )
          );
          setFirstLoad(true);
        });
      });
    }
    // si la page est rechargée et qu'on était dans le défilement,
    // quand on navigue et revenons dessus ou qu'on la recharge, elle remonte en
    // haut et gardes les valeurs nécessaires pour éviter les requetes bdd
    // et pour éviter la mauvaise détection des légendes à gauche
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------

  // timer pour supprimer les images dans la session storage au bout de 2h
  useEffect(() => {
    if (firstLoad) {
      setTimeout(() => {
        sessionStorage.clear();
        setFirstLoad(false);
      }, 1000 * 60 * 60 * 24); // 2 heures en millisecondes // 1000 * 60 * 60 * 2
    }
  }, [firstLoad]);

  // ---------------

  // fonction delete, qui agit dans la bdd et dans la session storage
  const handleDelete = async (imageName) => {
    if (!imageName) return; // Vérifie si imageName est null ou undefined
    const storage2 = getStorage();

    // création d'une référence au fichier à supprimer
    const desertRef = storageRef(storage2, `images/category/portfolio/${imageName.name}`);

    // suppression du fichier dans la bdd
    try {
      await deleteObject(desertRef);
    } catch (error) {
      alert('Error deleting file from Firebase Storage:', error);
      return;
    }

    // suppression du fichier dans imagesPortfolio
    setSortedImagesPortfolio((prevImages) =>
      prevImages.filter((image) => image.name !== imageName.name)
    );

    // suppression du fichier dans sessionStorage
    const storedImages = JSON.parse(sessionStorage.getItem('portfolioImages'));
    if (storedImages) {
      const updatedImages = storedImages.filter((image) => image.name !== imageName.name);
      sessionStorage.setItem('portfolioImages', JSON.stringify(updatedImages));
    }
    setShowDeletePopup(false);
  };

  // ---------------

  // gestion du module selon la largeur de l'écran
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // gestion du module de gauche affichant les légendes
  const [project, setProject] = useState('');

  useEffect(() => {
    if (width >= 700) {
      let firstLoading = null;

      const handleScroll = () => {
        const visible = [];
        let firstVisibleProject = null; // variable temporaire pour stocker la première image avec un projet

        sortedImagesPortfolio.forEach((image) => {
          const imageElement = document.getElementById(image.url);
          let imageRect = null;

          if (imageElement) {
            imageRect = imageElement.getBoundingClientRect();

            if (firstLoading == null) {
              let alt = imageElement.alt;

              if (alt.includes(', Project :')) {
                const projectString = alt.split(', Project :')[1];
                alt = alt.replace(', Project :' + projectString, '');

                if (!firstVisibleProject) {
                  firstVisibleProject = projectString;
                }
              }

              visible.push({ alt, url: imageElement.url });
            }

            const windowHeight = window.innerHeight;
            // La hauteur de la zone de détection
            const detectionHeight = windowHeight * 0.55;
            // La position de départ de la zone de détection
            const detectionStart = windowHeight * 0.45;
            // La position de fin de la zone de détection
            const detectionEnd = detectionStart + detectionHeight;

            // Si l'image est visible dans la zone de détection
            if (imageRect.top < detectionEnd && imageRect.bottom > detectionStart) {
              let alt = imageElement.alt;

              if (alt.includes(', Project :')) {
                const projectString = alt.split(', Project :')[1];
                alt = alt.replace(', Project :' + projectString, '');

                // Stocker la première image avec un projet dans la variable temporaire
                if (!firstVisibleProject) {
                  firstVisibleProject = projectString;
                }
              }

              visible.push({ alt, url: imageElement.url });
            }
          }
        });

        // Mettre à jour la valeur de "project" une fois avec la première image qui a un projet
        if (firstVisibleProject) {
          setProject(firstVisibleProject);
        }

        setVisibleImages(visible);
      };
      if (firstLoading === null) {
        handleScroll();
        firstLoading = true;
      } else {
        firstLoading = null;
      }

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('pageshow', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('pageshow', handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedImagesPortfolio, width]);

  useEffect(() => {
    if (visibleImages.length > 0) {
      setSelectedImageAlt(visibleImages[0].alt);
    }
  }, [visibleImages, setSelectedImageAlt]);

  // ---------------

  // click droit désactivé
  const disableRightClick = (e) => {
    e.preventDefault();
  };

  // ---------------

  // gestion modale
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // ---------------

  // pour patienter le chargement des data au chargement du module et éviter un bug
  if (sortedImagesPortfolio.length <= 0 || !sortedImagesPortfolio) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {currentAdmin || sortedImagesPortfolio.length >= 1 ? (
        <div className={styles.sectionGallery}>
          <div className={styles.containerLeftRight}>
            {width >= 700 && (
              <div className={styles.leftGallery}>
                <div className={styles.leftTextRef}>
                  {project && project.length > 1 && project !== ' ' ? (
                    <h3 className={styles.textEffect}>
                      <span>project : {project}</span>
                    </h3>
                  ) : null}
                  {selectedImageAlt && (
                    <p className={styles.textEffect}>
                      <span>{selectedImageAlt}&nbsp;</span>
                    </p>
                  )}
                </div>

                <div className={styles.barRight}></div>
              </div>
            )}
            {sortedImagesPortfolio ? (
              <div
                className={`${styles.galleryContent} ${
                  currentAdmin ? styles.addMargiTopAdmin : ''
                }`}
                id='image-gallery'
              >
                {sortedImagesPortfolio.map((media) => (
                  <div key={media.id}>
                    <LazyLoadImage
                      effect='blur'
                      threshold='3'
                      width='100%'
                      src={media.url}
                      id={media.url}
                      alt={`${
                        media.metadata && media.metadata.name
                          ? `nature : ${media.metadata.name || ''}`
                          : ''
                      }${
                        media.metadata && media.metadata.size && media.metadata.name
                          ? `, ${media.metadata.size}`
                          : ''
                      }
                      ${
                        media.metadata && media.metadata.size && !media.metadata.name
                          ? `${media.metadata.size}`
                          : ''
                      }${media.metadata ? `, Project : ${media.metadata.project || ''}` : ''}`}
                      onContextMenu={disableRightClick}
                      onClick={() => openModal(media)}
                      className={styles.img}
                    />
                    {width <= 699 && media.metadata && (
                      <div className={styles.metadataElement}>
                        {media.metadata.project && <h3>project : {media.metadata.project} </h3>}
                        {media.metadata.name && !media.metadata.size && (
                          <p>nature : {media.metadata.name}</p>
                        )}
                        {media.metadata.name && media.metadata.size && (
                          <p>
                            nature : {media.metadata.name}, {media.metadata.size}
                          </p>
                        )}
                        {!media.metadata.name && media.metadata.size && (
                          <p>{media.metadata.size}</p>
                        )}
                      </div>
                    )}

                    {currentAdmin && (
                      <button
                        onClick={() => {
                          setShowDeletePopup(true);
                          setDeleteImageId(media);
                        }}
                        className={styles.trashIcon}
                      >
                        <FiTrash2 />
                      </button>
                    )}

                    {showDeletePopup && (
                      <div className={styles.deletePopup}>
                        <div className={styles.overlay} onClick={() => setShowDeletePopup(false)} />
                        <div className={styles.popup}>
                          <p>Es-tu sûre de vouloir supprimer cette image ?</p>
                          <button onClick={() => handleDelete(deleteImageId)}>Oui</button>
                          <button onClick={() => setShowDeletePopup(false)}>Non</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {width >= 900 ? (
                  <ModalImg isOpen={!!selectedImage} onClose={closeModal}>
                    {selectedImage && (
                      <img
                        src={selectedImage.url}
                        onContextMenu={disableRightClick}
                        alt={`nature : ${selectedImage.metadata.name}, format : ${selectedImage.metadata.size}`}
                      />
                    )}
                  </ModalImg>
                ) : null}
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.sectionYetAvailable}>
          <div className={styles.containerYetAvailable}>
            <h2 className={styles.yetAvailable}>
              This section is not yet available, please come back later
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPortfolio;
