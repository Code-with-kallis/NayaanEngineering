import React from "react";
import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import styles from "./TeamCard.module.css";

function TeamCard({ employee }) {
  if (!employee) return null;

  const { employeeId, name, designation, image, bio } = employee;

  // Extract first 10-12 words for concise card bio
  const shortBio = bio
    ? bio.split(" ").slice(0, 12).join(" ") + "..."
    : "";

  return (
    <Link
      to={`/team/${employeeId}`}
      className={styles.card}
      aria-label={`View profile of ${name}, ${designation}`}
    >
      {/* Circular Profile Avatar */}
      <div className={styles.imageContainer}>
        <img
          src={image || "/images/team/placeholder.jpg"}
          alt={name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.designation}>{designation}</p>
          {shortBio && <p className={styles.bio}>{shortBio}</p>}
        </div>

        <div className={styles.footer}>
          <div className={styles.profileBadge}>
            <span className={styles.badgeDot} />
            <span>Profile</span>
          </div>

          <div className={styles.arrowCircle}>
            <FaArrowUp className={styles.arrowIcon} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TeamCard;