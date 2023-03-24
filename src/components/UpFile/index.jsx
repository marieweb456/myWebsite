import { ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { v4 } from 'uuid';
import styles from './index.module.css';
import { storage } from '../../firebase.js';
import { FaAngellist, FaExclamationCircle } from 'react-icons/fa';

const UpFile = ({ props }) => {
  const [error, setError] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [projectToUpper, setProjectToUpper] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const resetState = () => {
    setImageUpload(null);
    setName('');
    setSize('');
    setProjectToUpper('');
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const uploadFile = async ({ imageUpload, name = '', size = '', projectToUpper = '' }) => {
    setUploadSuccess(false);
    setError(null);

    if (!imageUpload) {
      setError('Image file is missing');
      return;
    } else if (imageUpload.size > 730000) {
      setError('File size must be less than 700mo');
      return;
    } else {
      setError('');
    }

    let imageRef = null;

    switch (props) {
      case 'portfolio':
        imageRef = ref(storage, `images/category/portfolio/${imageUpload.name + v4()}`);
        break;

      case 'pleinAir':
        imageRef = ref(storage, `images/category/pleinAir/${imageUpload.name + v4()}`);
        break;

      case 'illustration':
        imageRef = ref(storage, `images/category/illustration/${imageUpload.name + v4()}`);
        break;

      case 'locked':
        imageRef = ref(storage, `images/category/privates/${imageUpload.name + v4()}`);
        break;

      default:
        return;
    }

    const metadata = {};

    if (name) metadata.customMetadata = { ...metadata.customMetadata, name };
    if (size) metadata.customMetadata = { ...metadata.customMetadata, size };
    if (projectToUpper) {
      const project = capitalizeFirstLetter(projectToUpper);
      metadata.customMetadata = { ...metadata.customMetadata, project };
    }
    // Ajout de la date et l'heure précises du téléchargement
    metadata.customMetadata = {
      ...metadata.customMetadata,
      uploadTime: new Date().toISOString(),
    };
    if (imageUpload.type) metadata.contentType = imageUpload.type;

    try {
      await uploadBytes(imageRef, imageUpload, metadata);
      setUploadSuccess(true);
      setError(null);
      resetState(); // Réinitialiser les variables d'état à null
    } catch (error) {
      console.error(error);
      setError(error);
      setUploadSuccess(false);
    }
  };

  return (
    <>
      <section className={styles.sectionUpload}>
        <div className={styles.contentUpload}>
          <h3>Importer un fichier</h3>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <input
            className={styles.btnChoiseFile}
            type='file'
            id='nameFile'
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
              setError(null);
            }}
            required
          />
          <br />
          <br />
          <input
            type='text'
            placeholder='project name (optional)'
            value={projectToUpper}
            onChange={(event) => {
              setProjectToUpper(event.target.value);
              setError(null);
            }}
          />
          <br />
          <br />
          <input
            type='text'
            placeholder='image nature (optional)'
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
          />
          <br />
          <br />
          <input
            type='text'
            placeholder='image size (optional)'
            value={size}
            onChange={(event) => {
              setSize(event.target.value);
              setError(null);
            }}
          />
          <br />
          <br />
          <div className={styles.boxBtnIcn}>
            <button
              onClick={async () => {
                uploadFile({ imageUpload, name, size, projectToUpper });
              }}
              className={styles.buttonSendImg}
            >
              Upload Image
            </button>

            {error ? (
              <div>
                <FaExclamationCircle className={styles.icnUploadFailure} />
              </div>
            ) : uploadSuccess === true ? (
              <div>
                <FaAngellist className={styles.icnUploadSuccess} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};

export default UpFile;
