// src/pages/Admin/Inquiries/InquiriesManager.jsx — Dedicated Admin Client Inquiries Workspace
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import {
  FaInbox,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaTrash,
  FaTimes,
  FaSearch,
  FaSyncAlt,
  FaSpinner,
  FaCopy,
  FaCheck,
  FaReply,
  FaClock,
  FaBuilding,
  FaArrowLeft,
  FaCircle,
  FaUser,
  FaEnvelopeOpen,
  FaInfoCircle,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaCommentDots,
  FaBars,
} from "react-icons/fa";
import styles from "./InquiriesManager.module.css";

const SERVICE_CATEGORIES = [
  "All Categories",
  "Architectural Design",
  "Structural Engineering",
  "Construction Management",
  "Turnkey Solutions",
  "Turnkey Construction",
  "Engineering Consultancy",
  "Interior & Modular Design",
  "Project Planning",
  "Regulatory Approvals",
];

function formatTimeOrDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) {
    return date.toLocaleDateString("en-IN", { weekday: "short" });
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function formatFullDateTime(dateStr) {
  if (!dateStr) return "Unknown date";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function cleanPhoneNumber(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned.replace("+", "");
  if (cleaned.length === 10) return `91${cleaned}`;
  return cleaned;
}

const AVATAR_COLORS = [
  "#0284C7",
  "#7C3AED",
  "#059669",
  "#D97706",
  "#E11D48",
  "#4F46E5",
  "#0D9488",
  "#EA580C",
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function InquiriesManager({
  onUnreadCountChange,
  showAlert,
  showConfirm,
  onToggleSidebar,
  onLogout,
}) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState("all"); // 'all' | 'unread' | 'replied'
  const [selectedService, setSelectedService] = useState("All Categories");
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [copiedText, setCopiedText] = useState(null);

  const viewerScrollRef = useRef(null);
  const listScrollRef = useRef(null);

  // 1. Disable Lenis scroll engine inside inquiries workspace so mousewheel & middle click scroll naturally
  useEffect(() => {
    if (window.lenis) {
      window.lenis.stop();
    }
    return () => {
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, []);

  const fetchInquiries = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter out newsletter entries — ONLY keep real client contact inquiries
      const clientInquiriesOnly = (data || []).filter((item) => {
        const s = (item.service || "").toLowerCase();
        return !s.includes("newsletter") && !s.includes("subscription") && !s.includes("unsubscribe");
      });

      setInquiries(clientInquiriesOnly);

      // Auto select first inquiry on desktop (>850px) if none selected
      if (!selectedInquiryId && clientInquiriesOnly.length > 0 && typeof window !== "undefined" && window.innerWidth > 850) {
        setSelectedInquiryId(clientInquiriesOnly[0].id);
      }

      const unreadCount = clientInquiriesOnly.filter((item) => (item.status || "unread") === "unread").length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);
    } catch (err) {
      console.error("Fetch inquiries error:", err);
      if (showAlert) showAlert("Database Error", "Failed to fetch inquiries from Supabase.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [onUnreadCountChange, showAlert, selectedInquiryId]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const copyToClipboard = (text, label) => {
    if (!text || text === "Not Provided") return;
    navigator.clipboard.writeText(text);
    setCopiedText(`${label} copied!`);
    setTimeout(() => setCopiedText(null), 2200);
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );

      const { error } = await supabase
        .from("inquiries")
        .update({ status: nextStatus })
        .eq("id", id);

      if (error) throw error;

      const updatedList = inquiries.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      );
      const unread = updatedList.filter((item) => (item.status || "unread") === "unread").length;
      if (onUnreadCountChange) onUnreadCountChange(unread);
    } catch (err) {
      console.error("Status update error:", err);
      fetchInquiries(true);
    }
  };

  const handleSelectInquiry = (inquiry) => {
    setSelectedInquiryId(inquiry.id);
    if ((inquiry.status || "unread") === "unread") {
      handleUpdateStatus(inquiry.id, "read");
    }
    // Scroll viewer to top
    if (viewerScrollRef.current) {
      viewerScrollRef.current.scrollTop = 0;
    }
  };

  const handleDeleteInquiry = (id, clientName) => {
    if (showConfirm) {
      showConfirm({
        title: "Delete Inquiry",
        message: `Are you sure you want to delete the inquiry from ${clientName || "the sender"}?`,
        confirmText: "Delete",
        isDanger: true,
        onConfirm: async () => {
          try {
            setInquiries((prev) => prev.filter((item) => item.id !== id));
            if (selectedInquiryId === id) {
              const remaining = inquiries.filter((item) => item.id !== id);
              setSelectedInquiryId(remaining.length > 0 ? remaining[0].id : null);
            }

            const { error } = await supabase.from("inquiries").delete().eq("id", id);
            if (error) throw error;

            fetchInquiries(true);
          } catch (err) {
            console.error("Delete inquiry error:", err);
            if (showAlert) showAlert("Delete Error", "Failed to delete inquiry.");
          }
        },
      });
    }
  };

  const stats = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter((i) => (i.status || "unread") === "unread").length;
    const replied = inquiries.filter((i) => i.status === "replied").length;
    return { total, unread, replied };
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const name = (inquiry.name || "").toLowerCase();
      const email = (inquiry.email || "").toLowerCase();
      const phone = (inquiry.phone || "").toLowerCase();
      const service = (inquiry.service || "").toLowerCase();
      const message = (inquiry.message || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        service.includes(query) ||
        message.includes(query);

      const status = (inquiry.status || "unread").toLowerCase();
      let matchesTab = true;
      if (activeTabFilter === "unread") matchesTab = status === "unread";
      else if (activeTabFilter === "replied") matchesTab = status === "replied";

      const matchesService =
        selectedService === "All Categories" ||
        service === selectedService.toLowerCase();

      return matchesSearch && matchesTab && matchesService;
    });
  }, [inquiries, searchQuery, activeTabFilter, selectedService]);

  const activeInquiry = useMemo(() => {
    return inquiries.find((item) => item.id === selectedInquiryId) || null;
  }, [inquiries, selectedInquiryId]);

  return (
    <div className={styles.standaloneWorkspace} data-lenis-prevent="true">
      {/* ================= 1. TOP APP BAR ================= */}
      <header className={styles.topAppHeader}>
        <div className={styles.headerBrandCol}>
          {onToggleSidebar && (
            <button
              type="button"
              className={styles.menuToggleBtn}
              onClick={onToggleSidebar}
              title="Open Navigation Menu"
            >
              <FaBars className={styles.menuIcon} />
              <span className={styles.menuBtnText}>Menu</span>
            </button>
          )}

          <div className={styles.brandTitleWrap}>
            <span className={styles.brandTitle}>Client Inquiries</span>
          </div>
        </div>

        {/* CENTER: FILTER TABS (DESKTOP) */}
        <div className={styles.headerTabsWrap}>
          <button
            type="button"
            className={`${styles.statTab} ${activeTabFilter === "all" ? styles.statTabActive : ""}`}
            onClick={() => setActiveTabFilter("all")}
          >
            <FaInbox className={styles.tabIcon} />
            <span>All Inquiries</span>
            <span className={styles.tabBadge}>{stats.total}</span>
          </button>

          <button
            type="button"
            className={`${styles.statTab} ${activeTabFilter === "unread" ? styles.statTabActive : ""}`}
            onClick={() => setActiveTabFilter("unread")}
          >
            <FaEnvelope className={styles.tabIcon} />
            <span>Unread</span>
            {stats.unread > 0 && (
              <span className={`${styles.tabBadge} ${styles.tabBadgeUnread}`}>{stats.unread}</span>
            )}
          </button>

          <button
            type="button"
            className={`${styles.statTab} ${activeTabFilter === "replied" ? styles.statTabActive : ""}`}
            onClick={() => setActiveTabFilter("replied")}
          >
            <FaReply className={styles.tabIcon} />
            <span>Replied</span>
            <span className={styles.tabBadge}>{stats.replied}</span>
          </button>
        </div>

        {/* RIGHT: CONTROLS */}
        <div className={styles.headerRightControls}>
          <button
            type="button"
            className={styles.syncBtn}
            onClick={() => fetchInquiries(true)}
            disabled={refreshing}
            title="Refresh Inquiries Live"
          >
            <FaSyncAlt className={refreshing ? styles.spinnerIcon : ""} />
            <span className={styles.syncBtnLabel}>{refreshing ? "Syncing..." : "Sync"}</span>
          </button>

          <Link
            to="/"
            className={styles.viewSiteIconBtn}
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Website"
          >
            <FaExternalLinkAlt />
          </Link>

          {onLogout && (
            <button
              type="button"
              className={styles.logoutIconBtn}
              onClick={onLogout}
              title="Logout from Admin"
            >
              <FaSignOutAlt />
            </button>
          )}
        </div>
      </header>

      {/* ================= 2. FULLSCREEN 2-PANE WORKSPACE ================= */}
      <div className={styles.workspaceBody}>
        {/* LEFT PANE: CLIENT INQUIRIES LIST */}
        <aside
          className={`${styles.inquiriesListPane} ${
            activeInquiry ? styles.inquiriesListPaneHasActiveMobile : ""
          }`}
        >
          {/* SEARCH & CATEGORY DROPDOWN */}
          <div className={styles.listSearchHeader}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by client, email, inquiry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={styles.filterDropdown}
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* SCROLLABLE INQUIRY ROWS */}
          <div
            className={styles.inquiriesRowsScrollArea}
            ref={listScrollRef}
            data-lenis-prevent="true"
          >
            {loading ? (
              <div className={styles.paneLoadingState}>
                <FaSpinner className={styles.spinnerIcon} />
                <span>Loading inquiries...</span>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className={styles.paneEmptyState}>
                <FaInbox className={styles.emptyInboxIcon} />
                <h4>No client inquiries</h4>
                <p>
                  {inquiries.length === 0
                    ? "Inquiries submitted via the website contact form will stream in here in real-time."
                    : "No inquiries matched your search or category filter."}
                </p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => {
                const isSelected = inquiry.id === selectedInquiryId;
                const isUnread = (inquiry.status || "unread") === "unread";
                const avatarBg = getAvatarColor(inquiry.name);
                const initial = (inquiry.name || "C").charAt(0).toUpperCase();
                const snippet = (inquiry.message || "").replace(/\s+/g, " ");

                return (
                  <article
                    key={inquiry.id}
                    className={`${styles.inquiryRow} ${isSelected ? styles.inquiryRowSelected : ""} ${
                      isUnread ? styles.inquiryRowUnread : ""
                    }`}
                    onClick={() => handleSelectInquiry(inquiry)}
                  >
                    {/* UNREAD BLUE DOT */}
                    <div className={styles.unreadIndicatorBox}>
                      {isUnread ? (
                        <FaCircle className={styles.unreadDot} title="Unread" />
                      ) : (
                        <span className={styles.readPlaceholder} />
                      )}
                    </div>

                    {/* SENDER AVATAR */}
                    <div
                      className={styles.rowAvatar}
                      style={{ backgroundColor: avatarBg }}
                    >
                      {initial}
                    </div>

                    {/* ROW DETAILS */}
                    <div className={styles.rowContent}>
                      <div className={styles.rowTopLine}>
                        <span className={styles.rowSenderName}>
                          {inquiry.name || "Anonymous Client"}
                        </span>
                        <time className={styles.rowTimestamp}>
                          {formatTimeOrDate(inquiry.created_at)}
                        </time>
                      </div>

                      <div className={styles.rowSubjectLine}>
                        <span className={styles.rowServiceTag}>
                          {inquiry.service || "General Inquiry"}
                        </span>
                        {inquiry.status === "replied" && (
                          <span className={styles.rowRepliedBadge}>Replied</span>
                        )}
                      </div>

                      <p className={styles.rowSnippet}>{snippet || "No written message provided"}</p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT PANE: LIVE READING PANE */}
        <section
          className={`${styles.readingPane} ${
            activeInquiry ? styles.readingPaneActiveMobile : ""
          }`}
        >
          {activeInquiry ? (
            <div className={styles.messageViewerContainer}>
              {/* TOP ACTION TOOLBAR (MOBILE ICON-ONLY / DESKTOP TEXT) */}
              <div className={styles.viewerToolbar}>
                <div className={styles.toolbarLeft}>
                  {/* MOBILE BACK BUTTON */}
                  <button
                    type="button"
                    className={styles.mobileBackBtn}
                    onClick={() => setSelectedInquiryId(null)}
                    title="Back to inquiries list"
                  >
                    <FaArrowLeft />
                    <span>Back</span>
                  </button>

                  {/* 1-CLICK GMAIL COMPOSE LINK */}
                  {activeInquiry.email && (
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        activeInquiry.email
                      )}&su=${encodeURIComponent(
                        `Re: Inquiry for ${activeInquiry.service || "Nayaab Engineering Innovations"} - ${activeInquiry.name}`
                      )}&body=${encodeURIComponent(
                        `Dear ${activeInquiry.name},\n\nThank you for reaching out to Nayaab Engineering Innovations regarding ${activeInquiry.service || "your inquiry"}.\n\nWarm regards,\nNayaab Engineering Team`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionBtnGmail}
                      onClick={() => handleUpdateStatus(activeInquiry.id, "replied")}
                      title="Compose email reply in Gmail"
                    >
                      <FaReply />
                      <span className={styles.desktopOnlyText}>Reply via Gmail</span>
                    </a>
                  )}

                  {/* 1-CLICK WHATSAPP CHAT */}
                  {cleanPhoneNumber(activeInquiry.phone).length >= 10 && (
                    <a
                      href={`https://wa.me/${cleanPhoneNumber(activeInquiry.phone)}?text=${encodeURIComponent(
                        `Hello ${activeInquiry.name}, this is Nayaab Engineering Innovations regarding your project inquiry for ${activeInquiry.service || "our engineering services"}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionBtnWhatsapp}
                      onClick={() => handleUpdateStatus(activeInquiry.id, "replied")}
                      title="Open WhatsApp chat"
                    >
                      <FaWhatsapp />
                      <span className={styles.desktopOnlyText}>WhatsApp</span>
                    </a>
                  )}
                </div>

                <div className={styles.toolbarRight}>
                  {/* MARK READ / UNREAD */}
                  <button
                    type="button"
                    className={styles.actionBtnIcon}
                    onClick={() =>
                      handleUpdateStatus(
                        activeInquiry.id,
                        activeInquiry.status === "unread" ? "read" : "unread"
                      )
                    }
                    title={
                      activeInquiry.status === "unread" ? "Mark as Read" : "Mark as Unread"
                    }
                  >
                    {activeInquiry.status === "unread" ? <FaEnvelopeOpen /> : <FaEnvelope />}
                    <span className={styles.desktopOnlyText}>
                      {activeInquiry.status === "unread" ? "Mark Read" : "Mark Unread"}
                    </span>
                  </button>

                  {/* DELETE INQUIRY */}
                  <button
                    type="button"
                    className={`${styles.actionBtnIcon} ${styles.actionBtnDelete}`}
                    onClick={() => handleDeleteInquiry(activeInquiry.id, activeInquiry.name)}
                    title="Delete Inquiry"
                  >
                    <FaTrash />
                    <span className={styles.desktopOnlyText}>Delete</span>
                  </button>
                </div>
              </div>

              {/* LIVE SCROLLABLE INQUIRY DETAILS BODY */}
              <div
                className={styles.viewerScrollArea}
                ref={viewerScrollRef}
                data-lenis-prevent="true"
              >
                <div className={styles.viewerInnerContent}>
                  {/* 1. SUBJECT & STATUS BADGE */}
                  <div className={styles.messageSubjectHeader}>
                    <h2 className={styles.inquirySubjectTitle}>
                      {activeInquiry.service
                        ? `${activeInquiry.service} — Inquiry from ${activeInquiry.name}`
                        : `Inquiry from ${activeInquiry.name}`}
                    </h2>
                    <div className={styles.inquiryMetaRow}>
                      <span className={styles.disciplineBadge}>
                        <FaBuilding />
                        {activeInquiry.service || "General Inquiry"}
                      </span>
                      <span
                        className={`${styles.statusPill} ${
                          activeInquiry.status === "replied"
                            ? styles.statusPillReplied
                            : activeInquiry.status === "read"
                            ? styles.statusPillRead
                            : styles.statusPillUnread
                        }`}
                      >
                        {activeInquiry.status === "replied"
                          ? "Replied"
                          : activeInquiry.status === "read"
                          ? "Read"
                          : "Unread"}
                      </span>
                    </div>
                  </div>

                  {/* 2. SENDER HEADER (CLEAN CLIENT INFO WITHOUT RECIPIENT LINE) */}
                  <div className={styles.senderHeaderCard}>
                    <div
                      className={styles.senderLargeAvatar}
                      style={{ backgroundColor: getAvatarColor(activeInquiry.name) }}
                    >
                      {(activeInquiry.name || "C").charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.senderMetaCol}>
                      <div className={styles.senderPrimaryRow}>
                        <span className={styles.senderFullName}>{activeInquiry.name}</span>
                        {activeInquiry.email && (
                          <span className={styles.senderEmailAddress}>
                            &lt;{activeInquiry.email}&gt;
                          </span>
                        )}
                      </div>

                      <div className={styles.timestampFullRow}>
                        <FaClock className={styles.timeIcon} />
                        <span>Submitted on {formatFullDateTime(activeInquiry.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. STRUCTURED CLIENT CONTACT DETAILS GRID */}
                  <div className={styles.clientDetailsBox}>
                    <div className={styles.clientDetailsHeader}>
                      <FaInfoCircle className={styles.detailsHeaderIcon} />
                      <span>Contact &amp; Submission Details</span>
                    </div>

                    <div className={styles.detailGrid}>
                      <div className={styles.detailGridItem}>
                        <span className={styles.detailGridLabel}>Client Name</span>
                        <div className={styles.detailGridValueRow}>
                          <FaUser className={styles.detailGridIcon} />
                          <strong className={styles.detailGridValueText}>{activeInquiry.name || "Not Provided"}</strong>
                        </div>
                      </div>

                      <div className={styles.detailGridItem}>
                        <span className={styles.detailGridLabel}>Discipline</span>
                        <div className={styles.detailGridValueRow}>
                          <FaBuilding className={styles.detailGridIcon} />
                          <span className={styles.detailGridValueText}>{activeInquiry.service || "General Inquiry"}</span>
                        </div>
                      </div>

                      <div className={styles.detailGridItem}>
                        <span className={styles.detailGridLabel}>Email Address</span>
                        <div className={styles.detailGridValueRow}>
                          <FaEnvelope className={styles.detailGridIcon} />
                          <span className={styles.detailGridValueText}>{activeInquiry.email || "Not Provided"}</span>
                          {activeInquiry.email && (
                            <button
                              type="button"
                              className={styles.copySmallBtn}
                              onClick={() => copyToClipboard(activeInquiry.email, "Email")}
                              title="Copy Email"
                            >
                              <FaCopy />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={styles.detailGridItem}>
                        <span className={styles.detailGridLabel}>Phone Number</span>
                        <div className={styles.detailGridValueRow}>
                          <FaPhoneAlt className={styles.detailGridIcon} />
                          <span className={styles.detailGridValueText}>{activeInquiry.phone || "Not Provided"}</span>
                          {activeInquiry.phone && activeInquiry.phone !== "Not Provided" && (
                            <button
                              type="button"
                              className={styles.copySmallBtn}
                              onClick={() => copyToClipboard(activeInquiry.phone, "Phone")}
                              title="Copy Phone"
                            >
                              <FaCopy />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. FULL CLIENT MESSAGE BODY (100% CRYSTAL CLEAR SNOW WHITE) */}
                  <div className={styles.emailBodyCard}>
                    <div className={styles.emailBodyHeader}>
                      <FaCommentDots className={styles.messageHeaderIcon} />
                      <span>Message</span>
                    </div>
                    <div className={styles.emailBodyText} style={{ color: "#FFFFFF", fontWeight: 600 }}>
                      {activeInquiry.message ? (
                        activeInquiry.message.split("\n").map((paragraph, index) => (
                          <p
                            key={index}
                            style={{
                              color: "#FFFFFF",
                              fontSize: "1.08rem",
                              lineHeight: "1.85",
                              fontWeight: 600,
                              margin: "0 0 1rem 0",
                              opacity: 1,
                            }}
                          >
                            {paragraph || <br />}
                          </p>
                        ))
                      ) : (
                        <p style={{ color: "#94A3B8", fontStyle: "italic" }}>
                          No written message provided with this submission.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noMessageSelectedPane}>
              <div className={styles.emptyMailboxIllustration}>
                <FaEnvelope className={styles.largeMailIcon} />
              </div>
              <h3>Select an inquiry to view</h3>
              <p>Click on any client inquiry from the list on the left to inspect their project requirements and respond.</p>
            </div>
          )}
        </section>
      </div>

      {/* TOAST COPIED NOTIFICATION */}
      {copiedText && (
        <div className={styles.toastPill}>
          <FaCheck />
          <span>{copiedText}</span>
        </div>
      )}
    </div>
  );
}
