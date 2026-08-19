import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./GoogleReviews.module.css";

// 100% environment-driven API endpoint
const API_URL = import.meta.env.VITE_FEATURABLE_API_URL;

// Official Google Place ID Deep-Links
// These trigger the actual review modal / reviews tab on all mobile and desktop browsers
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

// Helper to extract review photo URLs across API variants
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

// Avatar sub-component with letter fallback
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
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    rating: 4.8,
    count: 17,
    label: "Excellent",
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Drag & Swipe State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef(null);

  // Fetch and Parse Reviews & Place Stats
  useEffect(() => {
    if (!API_URL) {
      console.error("VITE_FEATURABLE_API_URL is missing in your .env file");
      setLoading(false);
      return;
    }

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // 1. Rating extraction
        const rawApiRating =
          data?.business?.rating ||
          data?.place?.rating ||
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

        // 2. Review count extraction
        const rawApiCount =
          data?.business?.reviews_count ||
          data?.business?.review_count ||
          data?.business?.total_reviews ||
          data?.place?.user_ratings_total ||
          data?.place?.reviews_count ||
          data?.stats?.total_reviews ||
          data?.stats?.reviews_count ||
          data?.stats?.count ||
          data?.totalReviews ||
          data?.reviewsCount ||
          data?.total_reviews ||
          data?.widget?.total_reviews ||
          data?.widget?.totalReviews ||
          data?.total_count;

        const parsedCount =
          rawApiCount !== undefined && !isNaN(Number(rawApiCount)) && Number(rawApiCount) > 0
            ? Number(rawApiCount)
            : 17;

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

        // 3. Review list extraction
        const rawList =
          data?.reviews ||
          data?.data?.reviews ||
          data?.widget?.reviews ||
          data?.items ||
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

          const time =
            r.relativePublishTimeDescription ||
            r.relative_time_description ||
            r.relative_publish_time_description ||
            r.timeAgo ||
            r.date ||
            r.published_at ||
            "Google Review";

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

        setReviews(parsedReviews);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Featurable reviews load failed:", err);
        setLoading(false);
      });
  }, []);

  // Fluid responsive cards per view calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1080) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, reviews.length - cardsPerView),
    [reviews.length, cardsPerView]
  );

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Pointer Handlers for Unified Mouse Drag & Touch Swipe
  const handlePointerDown = (e) => {
    if (reviews.length <= cardsPerView) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX);
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

  // Star Rating Breakdown
  const displayRating = summary.rating || 4.8;
  const fullStarsCount = Math.floor(displayRating);
  const decimalPart = Number((displayRating % 1).toFixed(1));
  const partialFillPercent = decimalPart > 0 ? Math.round(decimalPart * 100) : 0;
  const hasPartialStar = decimalPart > 0;
  const emptyStarsCount = Math.max(0, 5 - fullStarsCount - (hasPartialStar ? 1 : 0));

  return (
    <section className={styles.reviewSection} aria-labelledby="google-reviews-title">
      <div className={styles.container}>
        {/* Section Header */}
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

        {/* Rating Summary Card */}
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
                  {/* Full Stars */}
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

                  {/* Partial Star */}
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

                  {/* Empty Stars */}
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

        {/* Carousel Viewport */}
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
            {/* Desktop Left Button */}
            <button
              type="button"
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={prevSlide}
              aria-label="Previous review"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            {/* Slider Track */}
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
                    : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className={styles.slideItem}
                    style={{ flex: `0 0 ${100 / cardsPerView}%` }}
                  >
                    <div className={styles.reviewCard}>
                      {/* Author Header */}
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

                      {/* Rating Stars */}
                      <div className={styles.cardStarsRow}>
                        {Array.from({ length: review.rating || 5 }).map((_, starIndex) => (
                          <svg
                            key={starIndex}
                            viewBox="0 0 24 24"
                            width="17"
                            height="17"
                            fill="#FBBC04"
                            aria-hidden="true"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className={styles.reviewText}>"{review.text}"</p>

                      {/* Footer */}
                      <div className={styles.cardFooter}>
                        <span className={styles.verifiedTextSmall}>
                          <svg
                            viewBox="0 0 20 20"
                            width="12"
                            height="12"
                            fill="#166534"
                            style={{ marginRight: 4 }}
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified Google Review
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Right Button */}
            <button
              type="button"
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={nextSlide}
              aria-label="Next review"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>

            {/* Mobile / Tablet Controls */}
            <div className={styles.bottomControls}>
              <button
                type="button"
                className={`${styles.mobileNavBtn} ${styles.mobilePrevBtn}`}
                onClick={prevSlide}
                aria-label="Previous review"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}