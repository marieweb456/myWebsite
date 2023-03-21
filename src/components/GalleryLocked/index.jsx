import { useEffect, useState, useContext } from 'react';
import { storage } from '../../firebase.js';
import {
  ref,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
  getStorage,
} from 'firebase/storage';
import styles from './index.module.css';
import ModalImg from '../ModalImg/index.jsx';
import { FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../../store/auth/AuthContext.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoadingSpinner from '../LoadingSpinner/index.jsx';

const GalleryPleinAir = () => {
  const [imagesLocked, setImagesLocked] = useState([]);
  const { currentAdmin } = useContext(AuthContext);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const imagesListRefLocked = ref(storage, 'images/category/privates/');

  // chargement des images
  useEffect(() => {
    listAll(imagesListRefLocked).then((response) => {
      let index = 0;
      response.items.forEach((item) => {
        const id = index++;
        getDownloadURL(item).then((url) => {
          getMetadata(item).then((metadata) => {
            setImagesLocked((prev) => [
              ...prev,
              { id: id, url: url, metadata: metadata.customMetadata, name: item.name },
            ]);
          });
        });
      });
    });
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------

  // gestion du module de gauche affichant les légendes des images survolées
  const [visibleImages, setVisibleImages] = useState([]);
  const [selectedImageAlt, setSelectedImageAlt] = useState('');
  const [lastSelectedImageAlt, setLastSelectedImageAlt] = useState('');
  const [valueAlt, setValueAlt] = useState(false);

  const handleImageEvent = (event) => {
    const visible = [];

    imagesLocked.forEach((image) => {
      const imageElement = document.getElementById(image.url);
      if (imageElement) {
        if (imageElement.alt !== lastSelectedImageAlt) {
          setValueAlt(false);
          let alt = '';

          if (imageElement === event.target || imageElement.contains(event.target)) {
            alt = imageElement.alt;

            if (alt !== lastSelectedImageAlt) {
              setSelectedImageAlt(alt);
              setLastSelectedImageAlt(alt);
            }
          }

          visible.push({ alt, url: imageElement.url });
        } else {
          setValueAlt(true);
        }
      }
    });
    if (valueAlt) {
      setVisibleImages(visible);
    }
  };

  useEffect(() => {
    if (width >= 873) {
      const handleHoverEvent = (event) => {
        handleImageEvent(event);
      };

      const timer = setTimeout(() => {
        imagesLocked.forEach((image) => {
          const imageElement = document.getElementById(image.url);
          if (imageElement) {
            imageElement.addEventListener('mousemove', handleHoverEvent);

            return () => {
              imageElement.removeEventListener('mousemove', handleHoverEvent);
            };
          }
        });
      }, 80); // Attendre 80ms avant d'attacher les gestionnaires d'événements

      // Effet de nettoyage
      return () => {
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesLocked]);

  useEffect(() => {
    if (visibleImages.length > 0) {
      setSelectedImageAlt(visibleImages[0].alt);
      setLastSelectedImageAlt(visibleImages[0].alt);
    }
  }, [visibleImages]);

  // vider la valeur alt quand le cuseur quitte une image
  const handleMouseLeaveEvent = (event) => {
    const imageElement = event.target;
    if (imageElement) {
      setValueAlt(false);
      setSelectedImageAlt('');
      setLastSelectedImageAlt('');
    }
  };

  // Ajouter l'écouteur d'événement 'mouseleave' à chaque image
  imagesLocked.forEach((image) => {
    const imageElement = document.getElementById(image.url);
    if (imageElement) {
      imageElement.addEventListener('mouseleave', handleMouseLeaveEvent);
    }
  });

  // ---------------

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // fonction delete, qui agit dans la bdd et dans la session storage
  const handleDelete = async (imageName) => {
    const storage2 = getStorage();

    // création d'une référence au fichier à supprimer
    const desertRef = ref(storage2, `images/category/privates/${imageName.name}`);

    // suppression du fichier dans la bdd
    try {
      await deleteObject(desertRef);
    } catch (error) {
      alert('Error deleting file from Firebase Storage:', error);
      return;
    }

    setShowDeletePopup(false);
  };

  // ---------------

  const disableRightClick = (e) => {
    e.preventDefault();
  };

  // ---------------

  // gestion du module pour l'affichage des légendes selon la largeur de l'écran
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

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
  if (imagesLocked.length <= 0 || !imagesLocked) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {currentAdmin || imagesLocked.length >= 1 ? (
        <div className={styles.sectionGallery}>
          <div className={styles.containerLeftRight}>
            {width >= 873 && (
              <div className={styles.leftGallery}>
                <div className={styles.leftTextRef}>
                  {selectedImageAlt && <p>{selectedImageAlt}</p>}
                </div>
                <div className={styles.barRight}></div>
              </div>
            )}
            {imagesLocked ? (
              <div className={styles.galleryContent}>
                {imagesLocked.map((media) => (
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
                        media.metadata && media.metadata.size
                          ? `, format : ${media.metadata.size || ''}`
                          : ''
                      }`}
                      onContextMenu={disableRightClick}
                      onClick={() => openModal(media)}
                    />

                    {width <= 872 && media.metadata && (
                      <div className={styles.metadataElement}>
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

export default GalleryPleinAir;
