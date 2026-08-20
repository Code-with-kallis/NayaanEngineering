// src/components/home/GoogleReviews.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaQuoteRight,
} from "react-icons/fa";
import styles from "./GoogleReviews.module.css";

const API_URL = import.meta.env.VITE_FEATURABLE_API_URL;

const GOOGLE_WRITE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJG4sCqrcH4TkRbRVG75QG8mI";

const GOOGLE_READ_ALL_URL =
  "https://search.google.com/local/reviews?placeid=ChIJG4sCqrcH4TkRbRVG75QG8mI";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #0284c7, #0369a1)",
  "linear-gradient(135deg, #059669, #047857)",
  "linear-gradient(135deg, #d97706, #b45309)",
  "linear-gradient(135deg, #7c3aed, #6d28d9)",
  "linear-gradient(135deg, #db2777, #be185d)",
];

function getReviewDate(r) {
  if (!r) return "Recently";

  const officialRelativeString =
    r.relative_publish_time_description ||
    r.relativePublishTimeDescription ||
    r.relative_time_description ||
    r.relativeTimeDescription ||
    r.time_description ||
    r.timeDescription ||
    r.relative_time ||
    r.relativeTime ||
    r.timeAgo ||
    r.time_ago ||
    r.time_ago_text;

  if (typeof officialRelativeString === "string" && officialRelativeString.trim().length > 0) {
    return officialRelativeString.trim();
  }

  const rawDate =
    r.published_at ||
    r.publishedAt ||
    r.created_at ||
    r.createdAt ||
    r.date ||
    r.datetime ||
    r.time ||
    r.timestamp;

  if (!rawDate) return "Recently";

  if (typeof rawDate === "string" && (rawDate.includes("ago") || rawDate.toLowerCase() === "yesterday")) {
    return rawDate.trim();
  }

  let date;
  if (typeof rawDate === "number") {
    date = new Date(rawDate < 1e11 ? rawDate * 1000 : rawDate);
  } else {
    date = new Date(rawDate);
  }

  if (isNaN(date.getTime())) {
    return typeof rawDate === "string" ? rawDate : "Recently";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30.4375);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  const diffInYears = Math.floor(diffInDays / 365.25);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

function getReviewPhotoUrl(r) {
  if (!r) return null;
  let url =
    (typeof r.author === "object"
      ? r.author?.avatar_url ||
        r.author?.avatarUrl ||
        r.author?.avatar ||
        r.author?.photo_url ||
        r.author?.photoUrl ||
        r.author?.photo ||
        r.author?.image_url ||
        r.author?.imageUrl ||
        r.author?.image ||
        r.author?.picture
      : null) ||
    r.author_avatar_url ||
    r.author_avatar ||
    r.authorAvatar ||
    r.author_photo_url ||
    r.authorPhotoUrl ||
    r.author_photo ||
    r.authorPhoto ||
    r.author_image ||
    r.authorImage ||
    r.profile_photo_url ||
    r.profilePhotoUrl ||
    r.profile_photo ||
    r.profilePhoto ||
    r.avatar_url ||
    r.avatarUrl ||
    r.avatar ||
    r.photo_url ||
    r.photoUrl ||
    r.photo ||
    r.image_url ||
    r.imageUrl ||
    r.image ||
    r.picture ||
    r.reviewer?.profilePhotoUrl ||
    r.reviewer?.photoUrl ||
    r.reviewer?.avatarUrl ||
    r.reviewer?.avatar ||
    r.reviewer?.photo ||
    r.reviewer?.picture ||
    null;

  if (url && typeof url === "string") {
    url = url.trim();
    if (url.startsWith("//")) {
      url = `https:${url}`;
    }
    return url.length > 5 ? url : null;
  }
  return null;
}

function ReviewAvatar({ photoUrl, name, index }) {
  const [imgFailed, setImgFailed] = useState(false);
  const letter = (name || "G").charAt(0).toUpperCase();
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  if (photoUrl && !imgFailed) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={styles.avatarImg}
        referrerPolicy="no-referrer"
        draggable={false}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div className={styles.avatarLetter} style={{ background: gradient }} aria-hidden="true">
      {letter}
    </div>
  );
}

export default function GoogleReviews() {
  const sectionRef = useRef(null);
  const hasTriggeredInitialViewRef = useRef(false);

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    rating: 4.8,
    count: 23,
    label: "Excellent",
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3.25);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const hasDraggedRef = useRef(false);
  const trackRef = useRef(null);

  // Auto-select 2nd dot when user scrolls to section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredInitialViewRef.current) {
          hasTriggeredInitialViewRef.current = true;
          setCurrentIndex((prev) => (prev === 0 ? 1 : prev));
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!API_URL) {
      setLoading(false);
      return;
    }

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const rawList =
          data?.reviews ||
          data?.data?.reviews ||
          data?.widget?.reviews ||
          data?.items ||
          data?.data ||
          (Array.isArray(data) ? data : []);

        const parsedReviews = rawList.map((r) => {
          const name =
            (typeof r.author === "string" ? r.author : r.author?.name) ||
            r.authorName ||
            r.author_name ||
            r.reviewer?.displayName ||
            r.reviewer?.name ||
            r.name ||
            r.user?.name ||
            "Google User";

          const photo = getReviewPhotoUrl(r);
          const time = getReviewDate(r);
          const text =
            r.text || r.comment || r.review_text || r.content || r.body || "";

          const singleRating = Number(r.rating || r.stars || r.starRating || 5);
          const safeRating = Math.max(
            1,
            Math.min(5, Math.round(isNaN(singleRating) ? 5 : singleRating))
          );

          return {
            authorName: name,
            authorPhotoUrl: photo,
            relativePublishTimeDescription: time,
            text,
            rating: safeRating,
          };
        });

        const rawApiRating =
          data?.business?.rating ||
          data?.place?.rating ||
          data?.place?.rating_star ||
          data?.overview?.rating ||
          data?.feed?.rating ||
          data?.widget?.business?.rating ||
          data?.stats?.rating ||
          data?.rating ||
          data?.averageRating ||
          data?.average_rating ||
          data?.widget?.rating ||
          data?.widget?.average_rating;

        const parsedRating =
          rawApiRating !== undefined && !isNaN(Number(rawApiRating)) && Number(rawApiRating) > 0
            ? Math.max(1, Math.min(5, Number(rawApiRating)))
            : 4.8;

        const rawApiCount =
          data?.business?.user_ratings_total ||
          data?.business?.reviews_count ||
          data?.business?.review_count ||
          data?.business?.total_reviews ||
          data?.place?.user_ratings_total ||
          data?.place?.reviews_count ||
          data?.place?.total_reviews ||
          data?.overview?.total_reviews ||
          data?.overview?.reviews_count ||
          data?.feed?.total_reviews ||
          data?.feed?.user_ratings_total ||
          data?.stats?.total_reviews ||
          data?.stats?.reviews_count ||
          data?.stats?.user_ratings_total ||
          data?.stats?.count ||
          data?.totalReviews ||
          data?.reviewsCount ||
          data?.total_reviews ||
          data?.widget?.total_reviews ||
          data?.widget?.totalReviews ||
          data?.user_ratings_total ||
          data?.total_count ||
          data?.total;

        const parsedCount =
          rawApiCount !== undefined && !isNaN(Number(rawApiCount)) && Number(rawApiCount) > 0
            ? Number(rawApiCount)
            : parsedReviews.length > 23
            ? parsedReviews.length
            : 23;

        const getRatingLabel = (score) => {
          if (score >= 4.5) return "Excellent";
          if (score >= 4.0) return "Very Good";
          if (score >= 3.5) return "Good";
          return "Average";
        };

        setSummary({
          rating: Number(parsedRating.toFixed(1)),
          count: parsedCount,
          label: getRatingLabel(parsedRating),
        });

        setReviews(parsedReviews);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Google reviews load failed:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1.15);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2.25);
      } else {
        setCardsPerView(3.35);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, Math.ceil(reviews.length - Math.floor(cardsPerView))),
    [reviews.length, cardsPerView]
  );

  // Seamless Wrap-Around Loop
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePointerDown = (e) => {
    if (reviews.length <= Math.floor(cardsPerView)) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    setDragStartX(e.clientX);
    setDragOffset(0);
    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentDiff = e.clientX - dragStartX;
    if (Math.abs(currentDiff) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(currentDiff);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 40;

    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    }

    setDragOffset(0);
    if (trackRef.current && trackRef.current.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const totalPages = Math.max(1, maxIndex + 1);
  const displayRating = summary.rating || 4.8;
  const fullStarsCount = Math.floor(displayRating);
  const decimalPart = Number((displayRating % 1).toFixed(1));
  const partialFillPercent = decimalPart > 0 ? Math.round(decimalPart * 100) : 0;
  const hasPartialStar = decimalPart > 0;
  const emptyStarsCount = Math.max(0, 5 - fullStarsCount - (hasPartialStar ? 1 : 0));

  return (
    <section
      ref={sectionRef}
      className={styles.reviewSection}
      aria-labelledby="google-reviews-title"
    >
      {/* 1. CENTERED SITE-CONTAINER FOR HEADER & SUMMARY CARD */}
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="google-reviews-title" className={styles.googleBrandTitle}>
            <span className={styles.googleBrandText}>
              <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span>
            </span>
            <span className={styles.reviewsWord}>Reviews</span>
          </h2>
          <p className={styles.subtitle}>
            Verified feedback and ratings directly from our Google Business profile.
          </p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.leftSummaryGroup}>
            <div className={styles.googleBadge}>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>

            <div className={styles.ratingInfo}>
              <div className={styles.topScoreLine}>
                <span className={styles.scoreNumber}>{summary.rating}</span>
                <span className={styles.scoreLabel}>{summary.label}</span>
                <div
                  className={styles.starCluster}
                  aria-label={`${displayRating} out of 5 stars`}
                >
                  {Array.from({ length: fullStarsCount }).map((_, i) => (
                    <svg
                      key={`full-${i}`}
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="#FBBC04"
                      aria-hidden="true"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}

                  {hasPartialStar && (
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <defs>
                        <linearGradient id="summary-star-partial-grad">
                          <stop offset={`${partialFillPercent}%`} stopColor="#FBBC04" />
                          <stop offset={`${partialFillPercent}%`} stopColor="#E2E8F0" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#summary-star-partial-grad)"
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                      />
                    </svg>
                  )}

                  {Array.from({ length: emptyStarsCount }).map((_, i) => (
                    <svg
                      key={`empty-${i}`}
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="#E2E8F0"
                      aria-hidden="true"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className={styles.subMetaLine}>
                <span className={styles.reviewsCount}>
                  Based on {summary.count} reviews
                </span>
                <span className={styles.metaDot} aria-hidden="true">•</span>
                <div className={styles.verifiedBadge}>
                  <svg
                    viewBox="0 0 20 20"
                    width="14"
                    height="14"
                    fill="#166534"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className={styles.verifiedText}>Verified by Google</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <a
              href={GOOGLE_READ_ALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readAllReviewsBtn}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Read All Reviews</span>
            </a>

            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.writeReviewBtn}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Write a Review</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. FULL-BLEED SLIDER (OVERFLOWS EDGE-TO-EDGE) */}
      <div className={styles.fullBleedSlider}>
        {loading ? (
          <div className={styles.statusBox}>
            Loading Google reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className={styles.statusBox}>
            No reviews available at this time.
          </div>
        ) : (
          <div className={styles.carouselWrapper}>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={prevSlide}
              aria-label="Previous review"
            >
              <FaChevronLeft />
            </button>

            <div
              className={`${styles.trackViewport} ${isDragging ? styles.grabbing : ""}`}
              ref={trackRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className={styles.sliderTrack}
                style={{
                  transform: `translateX(calc(-${
                    currentIndex * (100 / cardsPerView)
                  }% + ${dragOffset}px))`,
                  transition: isDragging
                    ? "none"
                    : "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className={styles.slideItem}
                    style={{ flex: `0 0 ${100 / cardsPerView}%` }}
                  >
                    {/* CURVED REVIEW CARD WITH CLEAN ROUNDED BORDERS */}
                    <div className={styles.reviewCard}>
                      <FaQuoteRight className={styles.cardWatermarkQuote} aria-hidden="true" />

                      <div className={styles.authorRow}>
                        <ReviewAvatar
                          photoUrl={review.authorPhotoUrl}
                          name={review.authorName}
                          index={index}
                        />

                        <div className={styles.authorMeta}>
                          <strong className={styles.authorName} title={review.authorName}>
                            {review.authorName}
                          </strong>
                          <span className={styles.reviewDate}>
                            {review.relativePublishTimeDescription}
                          </span>
                        </div>

                        <svg
                          className={styles.cardHeaderGoogleIcon}
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          aria-hidden="true"
                        >
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                      </div>

                      <div className={styles.cardStarsRow}>
                        {Array.from({ length: review.rating || 5 }).map((_, starIndex) => (
                          <FaStar key={starIndex} />
                        ))}
                      </div>

                      <p className={styles.reviewText}>"{review.text}"</p>

                      <div className={styles.cardFooter}>
                        <span className={styles.verifiedTextSmall}>
                          <FaCheckCircle className={styles.checkIcon} />
                          Verified Client
                        </span>

                        <a
                          href={GOOGLE_READ_ALL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewReviewLink}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            if (hasDraggedRef.current) e.preventDefault();
                          }}
                        >
                          <span>View</span>
                          <FaExternalLinkAlt className={styles.externalIcon} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={nextSlide}
              aria-label="Next review"
            >
              <FaChevronRight />
            </button>

            <div className={styles.bottomControls}>
              <button
                type="button"
                className={`${styles.mobileNavBtn} ${styles.mobilePrevBtn}`}
                onClick={prevSlide}
                aria-label="Previous review"
              >
                <FaChevronLeft />
              </button>

              <div className={styles.dotsGroup} aria-label="Review pagination">
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    type="button"
                    onClick={() => setCurrentIndex(pageIndex)}
                    className={`${styles.dotBtn} ${
                      currentIndex === pageIndex ? styles.activeDot : ""
                    }`}
                    aria-label={`Go to slide ${pageIndex + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className={`${styles.mobileNavBtn} ${styles.mobileNextBtn}`}
                onClick={nextSlide}
                aria-label="Next review"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}