// src/pages/Admin/Inquiries/InquiriesManager.jsx — Hostinger Webmail Style Inbox
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  FaInbox,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaTrash,
  FaCheckCircle,
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
  FaPrint,
  FaPaperPlane,
  FaExternalLinkAlt,
  FaCircle,
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
  "Newsletter Subscription",
  "Newsletter Unsubscribe",
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
  "#00A6FB",
  "#7C3AED",
  "#059669",
  "#D97706",
  "#DC2626",
  "#DB2777",
  "#2563EB",
  "#0D9488",
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

export default function InquiriesManager({ onUnreadCountChange, showAlert, showConfirm }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState("all"); // 'all' | 'unread' | 'replied' | 'newsletter'
  const [selectedService, setSelectedService] = useState("All Categories");
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [copiedText, setCopiedText] = useState(null);
  const [quickReplyText, setQuickReplyText] = useState("");

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

      // Auto select first inquiry on desktop if none selected
      if (!selectedInquiryId && list.length > 0 && window.innerWidth > 900) {
        setSelectedInquiryId(list[0].id);
      }

      const unreadCount = list.filter((item) => (item.status || "unread") === "unread").length;
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
    setCopiedText(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2400);
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
  };

  const handleDeleteInquiry = (id, clientName) => {
    if (showConfirm) {
      showConfirm({
        title: "Delete Email",
        message: `Are you sure you want to permanently delete this email from ${clientName || "the sender"}?`,
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
    const newsletter = inquiries.filter(
      (i) =>
        (i.service || "").toLowerCase().includes("newsletter") ||
        (i.service || "").toLowerCase().includes("subscription")
    ).length;
    return { total, unread, replied, newsletter };
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
      else if (activeTabFilter === "newsletter") {
        matchesTab = service.includes("newsletter") || service.includes("subscription");
      }

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
    <div className={styles.webmailWrapper}>
      {/* ================= 1. TOP STATS BAR ================= */}
      <div className={styles.topStatsBar}>
        <div className={styles.statsLeft}>
          <div
            className={`${styles.statTab} ${activeTabFilter === "all" ? styles.statTabActive : ""}`}
            onClick={() => setActiveTabFilter("all")}
          >
            <FaInbox />
            <span>Inbox</span>
            <strong className={styles.tabBadge}>{stats.total}</strong>
          </div>

          <div
            className={`${styles.statTab} ${activeTabFilter === "unread" ? styles.statTabActive : ""}`}
            onClick={() => setActiveTabFilter("unread")}
          >
            <FaEnvelope />
            <span>Unread</span>
            {stats.unread > 0 && (
              <strong className={`${styles.tabBadge} ${styles.tabBadgeUnread}`}>{stats.unread}</strong>
            )}
          </div>

          <div
            className={`${styles.statTab} ${activeTabFilter === "replied" ? styles.statTabActive : ""}`}
            onClick={() => setActiveTabFilter("replied")}
          >
            <FaReply />
            <span>Replied</span>
            <strong className={styles.tabBadge}>{stats.replied}</strong>
          </div>

          <div
            className={`${styles.statTab} ${activeTabFilter === "newsletter" ? styles.statTabActive : ""}`}
            onClick={() => setActiveTabFilter("newsletter")}
          >
            <FaPaperPlane />
            <span>Newsletter</span>
            <strong className={styles.tabBadge}>{stats.newsletter}</strong>
          </div>
        </div>

        <button
          type="button"
          className={styles.syncBtn}
          onClick={() => fetchInquiries(true)}
          disabled={refreshing}
          title="Sync Inquiries Live"
        >
          <FaSyncAlt className={refreshing ? styles.spinnerIcon : ""} />
          <span>{refreshing ? "Syncing..." : "Refresh"}</span>
        </button>
      </div>

      {/* ================= 2. HOSTINGER WEBMAIL SPLIT-PANE CONTAINER ================= */}
      <div className={styles.webmailContainer}>
        {/* LEFT PANE: EMAIL LIST */}
        <aside
          className={`${styles.mailListPane} ${
            activeInquiry ? styles.mailListPaneHasActiveMobile : ""
          }`}
        >
          {/* SEARCH & FILTER BAR */}
          <div className={styles.mailListSearchHeader}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search messages, names, emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
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

          {/* EMAIL ROWS FEED */}
          <div className={styles.mailRowsScrollArea}>
            {loading ? (
              <div className={styles.paneLoadingState}>
                <FaSpinner className={styles.spinnerIcon} />
                <span>Loading mailbox...</span>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className={styles.paneEmptyState}>
                <FaInbox className={styles.emptyInboxIcon} />
                <h4>No emails in folder</h4>
                <p>
                  {inquiries.length === 0
                    ? "Inquiries submitted via website forms will appear here in real-time."
                    : "No messages matched your active search query."}
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
                  <div
                    key={inquiry.id}
                    className={`${styles.mailRow} ${isSelected ? styles.mailRowSelected : ""} ${
                      isUnread ? styles.mailRowUnread : ""
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

                    {/* SENDER & PREVIEW CONTENT */}
                    <div className={styles.rowContent}>
                      <div className={styles.rowTopLine}>
                        <span className={styles.rowSenderName}>
                          {inquiry.name || "Anonymous Client"}
                        </span>
                        <span className={styles.rowTimestamp}>
                          {formatTimeOrDate(inquiry.created_at)}
                        </span>
                      </div>

                      <div className={styles.rowSubjectLine}>
                        <span className={styles.rowServiceTag}>
                          {inquiry.service || "Engineering Inquiry"}
                        </span>
                        {inquiry.status === "replied" && (
                          <span className={styles.rowRepliedBadge}>Replied</span>
                        )}
                      </div>

                      <p className={styles.rowSnippet}>{snippet || "No message preview available"}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT PANE: LIVE READING PANE (NO POPUP!) */}
        <section
          className={`${styles.readingPane} ${
            activeInquiry ? styles.readingPaneActiveMobile : ""
          }`}
        >
          {activeInquiry ? (
            <div className={styles.messageViewerContainer}>
              {/* TOP ACTION TOOLBAR */}
              <div className={styles.viewerToolbar}>
                <div className={styles.toolbarLeft}>
                  {/* MOBILE BACK BUTTON */}
                  <button
                    type="button"
                    className={styles.mobileBackBtn}
                    onClick={() => setSelectedInquiryId(null)}
                    title="Back to inbox list"
                  >
                    <FaArrowLeft />
                    <span>Inbox</span>
                  </button>

                  {/* REPLY VIA EMAIL */}
                  {activeInquiry.email && (
                    <a
                      href={`mailto:${activeInquiry.email}?subject=${encodeURIComponent(
                        `Re: Your Inquiry for ${activeInquiry.service || "Nayaab Engineering Innovations"}`
                      )}&body=${encodeURIComponent(
                        `Dear ${activeInquiry.name},\n\nThank you for contacting Nayaab Engineering Innovations regarding ${activeInquiry.service || "your project"}.\n\n`
                      )}`}
                      className={styles.actionBtnPrimary}
                      onClick={() => handleUpdateStatus(activeInquiry.id, "replied")}
                      title="Reply via Email Client"
                    >
                      <FaReply />
                      <span>Reply</span>
                    </a>
                  )}

                  {/* WHATSAPP ACTION */}
                  {cleanPhoneNumber(activeInquiry.phone).length >= 10 && (
                    <a
                      href={`https://wa.me/${cleanPhoneNumber(activeInquiry.phone)}?text=${encodeURIComponent(
                        `Hello ${activeInquiry.name}, this is Nayaab Engineering Innovations regarding your project inquiry for ${activeInquiry.service || "our services"}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionBtnWhatsapp}
                      onClick={() => handleUpdateStatus(activeInquiry.id, "replied")}
                      title="Open WhatsApp Chat"
                    >
                      <FaWhatsapp />
                      <span>WhatsApp</span>
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
                    <FaEnvelope />
                    <span>
                      {activeInquiry.status === "unread" ? "Mark Read" : "Mark Unread"}
                    </span>
                  </button>

                  {/* DELETE EMAIL */}
                  <button
                    type="button"
                    className={`${styles.actionBtnIcon} ${styles.actionBtnDelete}`}
                    onClick={() => handleDeleteInquiry(activeInquiry.id, activeInquiry.name)}
                    title="Delete Message"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* MESSAGE CONTENT AREA */}
              <div className={styles.viewerScrollArea}>
                {/* SUBJECT TITLE */}
                <div className={styles.messageSubjectHeader}>
                  <h2>
                    {activeInquiry.service
                      ? `${activeInquiry.service} — Inquiry from ${activeInquiry.name}`
                      : `Inquiry from ${activeInquiry.name}`}
                  </h2>
                  <span className={styles.disciplineBadge}>
                    <FaBuilding />
                    {activeInquiry.service || "General Inquiry"}
                  </span>
                </div>

                {/* SENDER DETAILS BOX (HOSTINGER WEBMAIL STYLE) */}
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
                      <span className={styles.senderEmailAddress}>
                        &lt;{activeInquiry.email || "No email"}&gt;
                      </span>
                    </div>

                    <div className={styles.recipientRow}>
                      <span className={styles.toLabel}>To:</span>
                      <span className={styles.toValue}>info@nayaabengineering.com, neiplkashmir@gmail.com</span>
                    </div>

                    <div className={styles.timestampFullRow}>
                      <FaClock className={styles.timeIcon} />
                      <span>{formatFullDateTime(activeInquiry.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* QUICK CONTACT CHIPS */}
                <div className={styles.contactChipsRow}>
                  {activeInquiry.email && (
                    <button
                      type="button"
                      className={styles.contactChip}
                      onClick={() => copyToClipboard(activeInquiry.email, "Email")}
                      title="Click to copy Email"
                    >
                      <FaEnvelope className={styles.chipIcon} />
                      <span>{activeInquiry.email}</span>
                      <FaCopy className={styles.copyIcon} />
                    </button>
                  )}

                  {activeInquiry.phone && activeInquiry.phone !== "Not Provided" && (
                    <button
                      type="button"
                      className={styles.contactChip}
                      onClick={() => copyToClipboard(activeInquiry.phone, "Phone")}
                      title="Click to copy Phone"
                    >
                      <FaPhoneAlt className={styles.chipIcon} />
                      <span>{activeInquiry.phone}</span>
                      <FaCopy className={styles.copyIcon} />
                    </button>
                  )}
                </div>

                {/* EMAIL BODY CONTAINER */}
                <div className={styles.emailBodyCard}>
                  <div className={styles.emailBodyText}>
                    {activeInquiry.message ? (
                      activeInquiry.message.split("\n").map((paragraph, index) => (
                        <p key={index}>{paragraph || <br />}</p>
                      ))
                    ) : (
                      <p style={{ color: "#71717A", fontStyle: "italic" }}>
                        No written message provided with this submission.
                      </p>
                    )}
                  </div>
                </div>

                {/* QUICK RESPONSE COMPOSER BAR */}
                <div className={styles.quickReplyCard}>
                  <div className={styles.quickReplyHeader}>
                    <FaReply className={styles.replyIcon} />
                    <span>Quick Response to {activeInquiry.name}</span>
                  </div>

                  <textarea
                    rows={3}
                    placeholder={`Type your reply to ${activeInquiry.name}...`}
                    value={quickReplyText}
                    onChange={(e) => setQuickReplyText(e.target.value)}
                    className={styles.quickReplyTextarea}
                  />

                  <div className={styles.quickReplyActionRow}>
                    {activeInquiry.email && (
                      <a
                        href={`mailto:${activeInquiry.email}?subject=${encodeURIComponent(
                          `Re: Your Inquiry for ${activeInquiry.service || "Nayaab Engineering"}`
                        )}&body=${encodeURIComponent(
                          quickReplyText ||
                            `Dear ${activeInquiry.name},\n\nThank you for reaching out to Nayaab Engineering Innovations.\n\nWarm regards,\nNayaab Engineering Team`
                        )}`}
                        className={styles.quickSendEmailBtn}
                        onClick={() => {
                          handleUpdateStatus(activeInquiry.id, "replied");
                          setQuickReplyText("");
                        }}
                      >
                        <FaPaperPlane />
                        <span>Send via Email</span>
                      </a>
                    )}

                    {cleanPhoneNumber(activeInquiry.phone).length >= 10 && (
                      <a
                        href={`https://wa.me/${cleanPhoneNumber(activeInquiry.phone)}?text=${encodeURIComponent(
                          quickReplyText ||
                            `Hello ${activeInquiry.name}, this is Nayaab Engineering Innovations regarding your project inquiry for ${activeInquiry.service || "our services"}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.quickSendWhatsappBtn}
                        onClick={() => {
                          handleUpdateStatus(activeInquiry.id, "replied");
                          setQuickReplyText("");
                        }}
                      >
                        <FaWhatsapp />
                        <span>Send via WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noMessageSelectedPane}>
              <div className={styles.emptyMailboxIllustration}>
                <FaEnvelope className={styles.largeMailIcon} />
              </div>
              <h3>Select a message to view</h3>
              <p>Choose an inquiry from the list on the left to read its full message and contact details.</p>
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
