import styles from './index.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.contentMessageError404}>
      <h1 className={styles.messageError404}> 404 error </h1>
      <p className={styles.paragError404}>The requested resource does not exist</p>
      <p className={styles.paragError404}>
        Please go to the "portfolio" page or any other to resume browsing
      </p>
    </div>
  );
};

export default ErrorPage;
