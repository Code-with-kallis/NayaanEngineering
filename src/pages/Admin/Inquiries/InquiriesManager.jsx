// src/pages/Admin/Inquiries/InquiriesManager.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  FaInbox,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimes,
  FaSearch,
  FaSyncAlt,
  FaCalendarAlt,
  FaTag,
  FaSpinner,
  FaCopy,
  FaCheck,
  FaReply,
  FaClock,
  FaBuilding,
  FaDraftingCompass,
  FaHardHat,
  FaComments,
} from "react-icons/fa";
import styles from "./InquiriesManager.module.css";

const SERVICE_CATEGORIES = [
  "All Services",
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

function formatInquiryDate(dateStr) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cleanPhoneNumber(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned.replace("+", "");
  if (cleaned.length === 10) return `91${cleaned}`;
  return cleaned;
}

export default function InquiriesManager({ onUnreadCountChange, showAlert, showConfirm }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState("all"); // 'all' | 'unread' | 'replied'
  const [selectedService, setSelectedService] = useState("All Services");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [copiedText, setCopiedText] = useState(null);

  const fetchInquiries = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const list = data || [];
      setInquiries(list);

      // Report unread count back to Admin sidebar
      const unreadCount = list.filter((item) => item.status === "unread").length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);
    } catch (err) {
      console.error("Fetch inquiries error:", err);
      if (showAlert) showAlert("Database Error", "Failed to fetch inquiries from Supabase.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [onUnreadCountChange, showAlert]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Modal Escape key listener
  useEffect(() => {
    if (!selectedInquiry) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedInquiry(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedInquiry]);

  const copyToClipboard = (text, label) => {
    if (!text || text === "Not Provided") return;
    navigator.clipboard.writeText(text);
    setCopiedText(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2400);
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      const { error } = await supabase
        .from("inquiries")
        .update({ status: nextStatus })
        .eq("id", id);

      if (error) throw error;

      // Update unread count
      const updatedList = inquiries.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      );
      const unread = updatedList.filter((item) => item.status === "unread").length;
      if (onUnreadCountChange) onUnreadCountChange(unread);
    } catch (err) {
      console.error("Status update error:", err);
      fetchInquiries(true);
    }
  };

  const handleOpenDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    if (inquiry.status === "unread") {
      handleUpdateStatus(inquiry.id, "read");
    }
  };

  const handleDeleteInquiry = (id, clientName) => {
    if (showConfirm) {
      showConfirm({
        title: "Delete Inquiry",
        message: `Are you sure you want to permanently delete the inquiry from ${clientName}?`,
        confirmText: "Delete",
        isDanger: true,
        onConfirm: async () => {
          try {
            setInquiries((prev) => prev.filter((item) => item.id !== id));
            if (selectedInquiry && selectedInquiry.id === id) setSelectedInquiry(null);

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
        selectedService === "All Services" ||
        service === selectedService.toLowerCase();

      return matchesSearch && matchesTab && matchesService;
    });
  }, [inquiries, searchQuery, activeTabFilter, selectedService]);

  return (
    <div className={styles.inquiriesContainer}>
      {/* 1. INTERACTIVE KPI CARDS */}
      <div className={styles.statsGrid}>
        <div
          className={`${styles.statCard} ${activeTabFilter === "all" ? styles.statCardActive : ""}`}
          onClick={() => setActiveTabFilter("all")}
          title="Show All Inquiries"
        >
          <div className={styles.statIconBox}>
            <FaInbox />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Inquiries</span>
            <strong className={styles.statValue}>{stats.total}</strong>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${activeTabFilter === "unread" ? styles.statCardActive : ""}`}
          onClick={() => setActiveTabFilter("unread")}
          title="Show Unread Inquiries"
        >
          <div className={`${styles.statIconBox} ${styles.statIconUnread}`}>
            <FaEnvelope />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>New / Unread</span>
            <strong className={styles.statValue}>{stats.unread}</strong>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${activeTabFilter === "replied" ? styles.statCardActive : ""}`}
          onClick={() => setActiveTabFilter("replied")}
          title="Show Replied Inquiries"
        >
          <div className={`${styles.statIconBox} ${styles.statIconReplied}`}>
            <FaReply />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Replied</span>
            <strong className={styles.statValue}>{stats.replied}</strong>
          </div>
        </div>
      </div>

      {/* 2. SEGMENTED TOOLBAR */}
      <div className={styles.toolbarCard}>
        <div className={styles.toolbarTopRow}>
          <div className={styles.segmentedTabs}>
            <button
              type="button"
              className={`${styles.segmentBtn} ${activeTabFilter === "all" ? styles.segmentBtnActive : ""}`}
              onClick={() => setActiveTabFilter("all")}
            >
              <FaInbox />
              <span>All Inquiries</span>
              <span className={`${styles.segmentBadge} ${activeTabFilter === "all" ? styles.segmentBadgeActive : ""}`}>
                {stats.total}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.segmentBtn} ${activeTabFilter === "unread" ? styles.segmentBtnActive : ""}`}
              onClick={() => setActiveTabFilter("unread")}
            >
              <FaEnvelope />
              <span>Unread</span>
              {stats.unread > 0 && (
                <span className={`${styles.segmentBadge} ${styles.segmentBadgeActive}`}>
                  {stats.unread}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`${styles.segmentBtn} ${activeTabFilter === "replied" ? styles.segmentBtnActive : ""}`}
              onClick={() => setActiveTabFilter("replied")}
            >
              <FaReply />
              <span>Replied</span>
              <span className={`${styles.segmentBadge} ${activeTabFilter === "replied" ? styles.segmentBadgeActive : ""}`}>
                {stats.replied}
              </span>
            </button>
          </div>

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => fetchInquiries(true)}
            disabled={refreshing}
            title="Refresh Inquiries"
          >
            <FaSyncAlt className={refreshing ? styles.spinnerIcon : ""} />
            <span>Sync Live</span>
          </button>
        </div>

        <div className={styles.toolbarBottomRow}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by client name, email, phone number, or keywords..."
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
            className={styles.categorySelect}
          >
            {SERVICE_CATEGORIES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. INQUIRIES FEED */}
      {loading ? (
        <div className={styles.loadingState}>
          <FaSpinner className={styles.spinnerIcon} />
          <span>Syncing client inquiries from database...</span>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className={styles.emptyState}>
          <FaInbox className={styles.emptyIcon} />
          <h3>No Inquiries in this view</h3>
          <p>
            {inquiries.length === 0
              ? "When visitors submit the contact form or consultation popup on your website, inquiries will stream in here automatically."
              : "No submissions matched your active search or category filter."}
          </p>
        </div>
      ) : (
        <div className={styles.inquiriesList}>
          {filteredInquiries.map((inquiry) => {
            const isUnread = (inquiry.status || "unread") === "unread";
            const initialLetter = (inquiry.name || "C").charAt(0).toUpperCase();
            const phoneDigits = cleanPhoneNumber(inquiry.phone);

            return (
              <article
                key={inquiry.id}
                className={`${styles.inquiryCard} ${isUnread ? styles.inquiryUnread : ""}`}
              >
                {/* HEADER ROW */}
                <div className={styles.cardHeaderRow}>
                  <div className={styles.clientGroup}>
                    <div className={styles.clientAvatar}>{initialLetter}</div>
                    <div className={styles.clientInfoCol}>
                      <div className={styles.clientTitleRow}>
                        <h3 className={styles.clientName}>{inquiry.name}</h3>
                        {isUnread && <span className={styles.newPill}>NEW</span>}
                      </div>
                      <span className={styles.timestampRow}>
                        <FaClock />
                        {formatInquiryDate(inquiry.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.badgeStack}>
                    <span className={styles.serviceBadge}>
                      <FaBuilding />
                      {inquiry.service || "Engineering Inquiry"}
                    </span>
                    <span
                      className={`${styles.statusPill} ${
                        inquiry.status === "replied"
                          ? styles.statusPillReplied
                          : inquiry.status === "read"
                          ? styles.statusPillRead
                          : styles.statusPillUnread
                      }`}
                    >
                      {inquiry.status === "replied" ? "Replied" : inquiry.status === "read" ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>

                {/* CONTACT CHIPS */}
                <div className={styles.contactChipsRow}>
                  {inquiry.email && (
                    <button
                      type="button"
                      className={styles.chipItem}
                      onClick={() => copyToClipboard(inquiry.email, "Email")}
                      title="Click to copy Email"
                    >
                      <FaEnvelope className={styles.chipIcon} />
                      <span>{inquiry.email}</span>
                      <FaCopy className={styles.copyHintIcon} />
                    </button>
                  )}

                  {inquiry.phone && inquiry.phone !== "Not Provided" && (
                    <button
                      type="button"
                      className={styles.chipItem}
                      onClick={() => copyToClipboard(inquiry.phone, "Phone")}
                      title="Click to copy Phone"
                    >
                      <FaPhoneAlt className={styles.chipIcon} />
                      <span>{inquiry.phone}</span>
                      <FaCopy className={styles.copyHintIcon} />
                    </button>
                  )}
                </div>

                {/* MESSAGE PREVIEW BUBBLE */}
                <div className={styles.messageBubble}>
                  <p className={styles.messageQuote}>"{inquiry.message}"</p>
                </div>

                {/* ACTION FOOTER */}
                <div className={styles.actionFooter}>
                  <div className={styles.outreachGroup}>
                    {phoneDigits && phoneDigits.length >= 10 && (
                      <a
                        href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(
                          `Hello ${inquiry.name}, this is Nayaab Engineering Innovations regarding your project inquiry for ${inquiry.service || "our engineering services"}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappPillBtn}
                        onClick={() => handleUpdateStatus(inquiry.id, "replied")}
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp />
                        <span>WhatsApp Client</span>
                      </a>
                    )}

                    {inquiry.email && (
                      <a
                        href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                          `Regarding your project inquiry: ${inquiry.service || "Nayaab Engineering"}`
                        )}&body=${encodeURIComponent(
                          `Hello ${inquiry.name},\n\nThank you for reaching out to Nayaab Engineering Innovations regarding ${inquiry.service || "your inquiry"}.\n\n`
                        )}`}
                        className={styles.emailPillBtn}
                        onClick={() => handleUpdateStatus(inquiry.id, "replied")}
                        title="Reply via Email"
                      >
                        <FaEnvelope />
                        <span>Email Client</span>
                      </a>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      type="button"
                      className={styles.statusBtn}
                      onClick={() =>
                        handleUpdateStatus(
                          inquiry.id,
                          inquiry.status === "unread" ? "read" : "unread"
                        )
                      }
                      title={inquiry.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                    >
                      <FaCheckCircle />
                      <span>{inquiry.status === "unread" ? "Mark Read" : "Mark Unread"}</span>
                    </button>

                    <button
                      type="button"
                      className={styles.viewBtn}
                      onClick={() => handleOpenDetails(inquiry)}
                    >
                      <FaEye />
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      className={styles.deleteActionBtn}
                      onClick={() => handleDeleteInquiry(inquiry.id, inquiry.name)}
                      title="Delete Inquiry"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. DETAIL MODAL DIALOG */}
      {selectedInquiry && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedInquiry(null)}
          role="presentation"
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <div className={styles.clientAvatar}>
                  {(selectedInquiry.name || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 id="inquiry-detail-title" style={{ margin: 0, color: "#F5F5F5", fontSize: "1.15rem", fontWeight: 800 }}>
                    {selectedInquiry.name}
                  </h3>
                  <span style={{ fontSize: "0.78rem", color: "#737373", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <FaClock /> Submitted {formatInquiryDate(selectedInquiry.created_at)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedInquiry(null)}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalDetailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Service Requested</span>
                <span className={styles.detailValue}>
                  {selectedInquiry.service || "General Consultation"}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Inquiry Status</span>
                <span className={styles.detailValue} style={{ textTransform: "capitalize", color: selectedInquiry.status === "unread" ? "#F59E0B" : selectedInquiry.status === "replied" ? "#38BDF8" : "#22C55E" }}>
                  {selectedInquiry.status || "unread"}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email Address</span>
                <span className={styles.detailValue}>{selectedInquiry.email || "Not Provided"}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone / WhatsApp</span>
                <span className={styles.detailValue}>{selectedInquiry.phone || "Not Provided"}</span>
              </div>
            </div>

            <div className={styles.modalMessageBox}>
              <span className={styles.detailLabel}>Full Client Message</span>
              <div className={styles.modalMessageContent}>{selectedInquiry.message}</div>
            </div>

            <div className={styles.modalActionFooter}>
              <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
                {cleanPhoneNumber(selectedInquiry.phone).length >= 10 && (
                  <a
                    href={`https://wa.me/${cleanPhoneNumber(selectedInquiry.phone)}?text=${encodeURIComponent(
                      `Hello ${selectedInquiry.name}, this is Nayaab Engineering Innovations regarding your project inquiry for ${selectedInquiry.service || "our services"}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappPillBtn}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "replied")}
                  >
                    <FaWhatsapp />
                    <span>WhatsApp</span>
                  </a>
                )}

                {selectedInquiry.email && (
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                      `Regarding your project inquiry: ${selectedInquiry.service || "Nayaab Engineering"}`
                    )}`}
                    className={styles.emailPillBtn}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "replied")}
                  >
                    <FaEnvelope />
                    <span>Email Client</span>
                  </a>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className={styles.statusBtn}
                  onClick={() =>
                    handleUpdateStatus(
                      selectedInquiry.id,
                      selectedInquiry.status === "replied"
                        ? "read"
                        : selectedInquiry.status === "read"
                        ? "unread"
                        : "replied"
                    )
                  }
                >
                  Status: {selectedInquiry.status || "unread"}
                </button>

                <button
                  type="button"
                  className={styles.deleteActionBtn}
                  onClick={() => handleDeleteInquiry(selectedInquiry.id, selectedInquiry.name)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TOAST NOTIFICATION */}
      {copiedText && (
        <div className={styles.toastPill}>
          <FaCheck />
          <span>{copiedText}</span>
        </div>
      )}
    </div>
  );
}
