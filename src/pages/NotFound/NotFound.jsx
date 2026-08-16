import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <section className={styles.container} aria-labelledby="not-found-title">
      <div className={styles.content}>
        <span className={styles.errorCode} aria-hidden="true">
          404
        </span>

        <h1 id="not-found-title" className={styles.title}>
          Page not found
        </h1>

        <p className={styles.description}>
          The page you are looking for doesn’t exist, has been removed, or the
          URL was typed incorrectly.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.secondaryBtn}
          >
            Go Back
          </button>
          <Link to="/" className={styles.primaryBtn}>
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}