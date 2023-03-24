import styles from './index.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.contentMessageError404}>
      <h1 className={styles.messageError404}> erreur 404 </h1>
      <p className={styles.paragError404}>La ressource demandée n'existe pas</p>
      <p className={styles.paragError404}>
        Veuillez vous rendre sur la page "portfolio" ou tout autre pour reprendre votre navigation
      </p>
    </div>
  );
};

export default ErrorPage;
