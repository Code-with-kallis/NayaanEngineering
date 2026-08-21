// src/pages/Admin/Admin.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { uploadToCloudflareR2, deleteFromCloudflareR2 } from "../../lib/cloudflareR2";
import {
  FaCloudUploadAlt,
  FaLock,
  FaTrash,
  FaEdit,
  FaPlus,
  FaImages,
  FaTimes,
  FaHome,
  FaSignOutAlt,
  FaSpinner,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaStar,
  FaRegStar,
  FaSearch,
  FaKey,
  FaBars,
  FaThLarge,
  FaCog,
  FaLayerGroup,
  FaSave,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import InquiriesManager from "./Inquiries/InquiriesManager";
import styles from "./Admin.module.css";

const CATEGORIES = [
  "Residential",
  "Commercial",
  "Institutional",
  "Religious",
  "Industrial",
  "Infrastructure",
  "Interior & Fit-Out",
  "Renovation & Restoration"
];

const MAX_FEATURED_LIMIT = 6;
const COMPRESSION_THRESHOLD_BYTES = 350 * 1024; // 350 KB
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 Minutes Auto-Logout
const DRAFT_STORAGE_KEY = "neipl_admin_project_draft";

const compressImageIfNeeded = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    if (file.size <= COMPRESSION_THRESHOLD_BYTES) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const fileNameWEBP = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], fileNameWEBP, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Login form
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sidebar and Hash-based Tabs
  const getTabFromHash = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === "#client-inquiries" || hash === "#inquiries") return "inquiries";
    if (hash === "#form" || hash === "#new-project") return "form";
    if (hash === "#settings") return "settings";
    return "projects";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);

  // Sync hash with activeTab
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "inquiries") {
      window.location.hash = "client-inquiries";
    } else if (tab === "projects") {
      window.location.hash = "projects";
    } else if (tab === "form") {
      window.location.hash = "new-project";
    } else if (tab === "settings") {
      window.location.hash = "settings";
    }
  };

  // Projects list and filtering
  const [projectsList, setProjectsList] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);

  // Project Form States
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Residential");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [summary, setSummary] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Draft indicator state
  const [hasDraft, setHasDraft] = useState(false);
  const [draftLastSaved, setDraftLastSaved] = useState(null);

  // Cover Image state
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState("");

  // Gallery Images state
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([]);

  // Change Password with Email OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Reusable Popup Modal
  const [modal, setModal] = useState({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    isDanger: false,
    onConfirm: null,
  });

  const showAlert = (title, message) => {
    setModal({
      isOpen: true,
      type: "alert",
      title,
      message,
      confirmText: "OK",
      cancelText: "",
      isDanger: false,
      onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = ({ title, message, confirmText = "Confirm", isDanger = false, onConfirm }) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title,
      message,
      confirmText,
      cancelText: "Cancel",
      isDanger,
      onConfirm: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        if (onConfirm) onConfirm();
      },
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Close modal on Escape key press
  useEffect(() => {
    if (!modal.isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal.isOpen]);

  // Check auth session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 10-Minute Inactivity Auto Logout
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;
    let hiddenTime = null;

    const handleInactivityLogout = async () => {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setPasscode("");
      showAlert(
        "Session Expired",
        "Your session expired after 10 minutes of inactivity for security. Unsaved project drafts have been preserved."
      );
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
      } else if (hiddenTime) {
        const elapsed = Date.now() - hiddenTime;
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          handleInactivityLogout();
        } else {
          resetTimer();
        }
        hiddenTime = null;
      }
    };

    const trackedEvents = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    trackedEvents.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    document.addEventListener("visibilitychange", handleVisibility);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      trackedEvents.forEach((ev) => window.removeEventListener(ev, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isAuthenticated]);

  // Project Form Draft Auto-Save
  useEffect(() => {
    if (!isAuthenticated || editingId) return;

    const hasContent =
      title.trim() ||
      location.trim() ||
      duration.trim() ||
      summary.trim() ||
      deliverables.trim() ||
      description.trim() ||
      isFeatured;

    if (hasContent) {
      const draftPayload = {
        title,
        category,
        location,
        duration,
        summary,
        deliverables,
        description,
        isFeatured,
        savedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
      setHasDraft(true);
      setDraftLastSaved(draftPayload.savedAt);
    }
  }, [
    title,
    category,
    location,
    duration,
    summary,
    deliverables,
    description,
    isFeatured,
    isAuthenticated,
    editingId,
  ]);

  // Restore draft on mount
  useEffect(() => {
    if (editingId) return;

    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title || "");
        setCategory(parsed.category || "Residential");
        setLocation(parsed.location || "");
        setDuration(parsed.duration || "");
        setSummary(parsed.summary || "");
        setDeliverables(parsed.deliverables || "");
        setDescription(parsed.description || "");
        setIsFeatured(Boolean(parsed.isFeatured));
        setHasDraft(true);
        setDraftLastSaved(parsed.savedAt || "Recently");
      } catch (err) {
        console.error("Draft parse error:", err);
      }
    }
  }, [editingId]);

  // Resend OTP Cooldown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    setDraftLastSaved(null);
    resetForm();
    setMessage("Draft has been cleared.");
    setMessageType("success");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: passcode,
    });

    if (error) {
      showAlert("Invalid Passcode", "The security passcode you entered is incorrect. Please try again.");
      return;
    }
    setPasscode("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPasscode("");
    setShowPassword(false);
  };

  const loadAllProjects = async () => {
    setFetchingProjects(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjectsList(data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      showAlert("Database Error", "Failed to fetch project list.");
    } finally {
      setFetchingProjects(false);
    }
  };

  const fetchUnreadInquiriesCount = async () => {
    try {
      const { count, error } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      if (!error && typeof count === "number") {
        setUnreadInquiriesCount(count);
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllProjects();
      fetchUnreadInquiriesCount();
    }
  }, [isAuthenticated]);

  const handleToggleFeatured = async (id, currentStatus, projectTitle) => {
    const nextStatus = !currentStatus;

    if (nextStatus) {
      const currentlyFeatured = projectsList.filter((p) => p.is_featured).length;
      if (currentlyFeatured >= MAX_FEATURED_LIMIT) {
        showAlert(
          "Maximum Limit Reached",
          `You can select up to ${MAX_FEATURED_LIMIT} Featured Projects. Please unfeature another project first.`
        );
        return;
      }
    }

    try {
      setProjectsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_featured: nextStatus } : item))
      );

      const { error } = await supabase
        .from("projects")
        .update({ is_featured: nextStatus })
        .eq("id", id);

      if (error) throw error;

      setMessage(
        nextStatus
          ? `"${projectTitle}" marked as Featured (${projectsList.filter((p) => p.is_featured).length + 1}/${MAX_FEATURED_LIMIT})`
          : `"${projectTitle}" removed from Featured.`
      );
      setMessageType("success");
    } catch (err) {
      console.error("Featured update error:", err);
      setProjectsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_featured: currentStatus } : item))
      );
      showAlert("Update Error", "Failed to update featured status.");
    }
  };

  const handleFeaturedCheckboxChange = (e) => {
    const willBeFeatured = e.target.checked;
    if (willBeFeatured) {
      const currentlyFeatured = projectsList.filter(
        (p) => p.is_featured && p.id !== editingId
      ).length;

      if (currentlyFeatured >= MAX_FEATURED_LIMIT) {
        showAlert(
          "Maximum Limit Reached",
          `You can select up to ${MAX_FEATURED_LIMIT} Featured Projects. Please unfeature an existing project first.`
        );
        return;
      }
    }
    setIsFeatured(willBeFeatured);
  };

  // STEP 1: SEND EMAIL OTP CODE
  const handleSendEmailOtp = async () => {
    setOtpSending(true);
    try {
      const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
      const { error } = await supabase.auth.signInWithOtp({
        email: adminEmail,
      });

      if (error) throw error;

      setOtpSent(true);
      setResendCooldown(60);
      showAlert(
        "Verification Code Sent",
        `A security code has been sent to ${adminEmail}. Please check your inbox or spam folder.`
      );
    } catch (err) {
      console.error("Send OTP Error:", err);
      showAlert("OTP Error", err.message || "Failed to dispatch verification code.");
    } finally {
      setOtpSending(false);
    }
  };

  // STEP 2: VERIFY OTP AND UPDATE PASSWORD (Supports both 6 and 8 digit tokens)
  const handleVerifyOtpAndChangePassword = async (e) => {
    e.preventDefault();

    const cleanToken = otpCode.trim();
    if (!cleanToken || cleanToken.length < 6) {
      showAlert("Missing Code", "Please enter the complete verification code from your email.");
      return;
    }

    if (newPassword.length < 6) {
      showAlert("Security Warning", "New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("Password Mismatch", "New password and confirmation password do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

      // Attempt verification with "email" type first, then "magiclink"
      let { error: verifyError } = await supabase.auth.verifyOtp({
        email: adminEmail,
        token: cleanToken,
        type: "email",
      });

      if (verifyError) {
        const retry = await supabase.auth.verifyOtp({
          email: adminEmail,
          token: cleanToken,
          type: "magiclink",
        });
        verifyError = retry.error;
      }

      if (verifyError) {
        showAlert(
          "Invalid Verification Code",
          "The code is invalid or expired. Please make sure you are using the code from the most recent email."
        );
        return;
      }

      // Update password once OTP is verified
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      showAlert(
        "Password Updated",
        "Your master admin security passcode was updated successfully."
      );

      // Reset form
      setOtpSent(false);
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password Update Error:", err);
      showAlert("Update Error", err.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const processedFile = await compressImageIfNeeded(file);
      setCoverFile(processedFile);
      setCoverPreview(URL.createObjectURL(processedFile));
    } catch (err) {
      console.error("Cover image processing error:", err);
      showAlert("Image Error", "Failed to process cover image.");
    }
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const processedFiles = [];
    const newPreviews = [];

    for (const file of files) {
      try {
        const processedFile = await compressImageIfNeeded(file);
        processedFiles.push(processedFile);
        newPreviews.push(URL.createObjectURL(processedFile));
      } catch (err) {
        console.error("Gallery image error:", err);
      }
    }

    if (processedFiles.length > 0) {
      setGalleryFiles((prev) => [...prev, ...processedFiles]);
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }

    e.target.value = "";
  };

  const removeGalleryFile = (index) => {
    const previewUrl = galleryPreviews[index];
    if (previewUrl && previewUrl.startsWith("blob:")) {
      try { URL.revokeObjectURL(previewUrl); } catch (_) { }
    }
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryUrl = (urlToRemove) => {
    setExistingGalleryUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const resetForm = () => {
    if (coverPreview && coverPreview.startsWith("blob:")) {
      try { URL.revokeObjectURL(coverPreview); } catch (_) { }
    }
    galleryPreviews.forEach((url) => {
      if (url && url.startsWith("blob:")) {
        try { URL.revokeObjectURL(url); } catch (_) { }
      }
    });
    setEditingId(null);
    setTitle("");
    setCategory("Residential");
    setLocation("");
    setDuration("");
    setSummary("");
    setDeliverables("");
    setDescription("");
    setIsFeatured(false);
    setCoverFile(null);
    setCoverPreview(null);
    setExistingCoverUrl("");
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGalleryUrls([]);
  };

  const openCreateForm = () => {
    resetForm();
    switchTab("form");
    setSidebarOpen(false);
  };

  const startEditing = (project) => {
    setEditingId(project.id);
    setTitle(project.title || "");
    setCategory(project.category || "Residential");
    setLocation(project.location || "");
    setDuration(project.duration || "");
    setSummary(project.summary || "");
    setDeliverables(
      Array.isArray(project.deliverables)
        ? project.deliverables.join("\n")
        : project.deliverables || ""
    );
    setDescription(project.description || "");
    setIsFeatured(Boolean(project.is_featured));
    setCoverFile(null);
    const coverUrl = project.cover_image || project.image_url || project.image || "";
    setExistingCoverUrl(coverUrl);
    setCoverPreview(coverUrl || null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGalleryUrls(project.gallery_images || []);
    switchTab("form");
    setSidebarOpen(false);
  };

  const handleDelete = (id, projectTitle) => {
    showConfirm({
      title: "Delete Project",
      message: `Are you sure you want to delete "${projectTitle}"? All associated images will be permanently removed.`,
      confirmText: "Delete Project",
      isDanger: true,
      onConfirm: async () => {
        try {
          const targetProject = projectsList.find((p) => p.id === id);

          const { error: dbError } = await supabase.from("projects").delete().eq("id", id);
          if (dbError) throw dbError;

          if (targetProject) {
            const urlsToDelete = [
              ...(targetProject.cover_image ? [targetProject.cover_image] : []),
              ...(Array.isArray(targetProject.gallery_images) ? targetProject.gallery_images : []),
            ];
            await Promise.all(urlsToDelete.map((url) => deleteFromCloudflareR2(url)));
          }

          setProjectsList((prev) => prev.filter((item) => item.id !== id));
          setMessage(`Project "${projectTitle}" deleted successfully.`);
          setMessageType("danger");
        } catch (err) {
          console.error("Delete Error:", err);
          showAlert("Delete Error", err.message);
        }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile && !existingCoverUrl) {
      showAlert("Missing Cover Photo", "Please select a main cover photo for the project.");
      return;
    }

    if (isFeatured) {
      const currentlyFeatured = projectsList.filter(
        (p) => p.is_featured && p.id !== editingId
      ).length;
      if (currentlyFeatured >= MAX_FEATURED_LIMIT) {
        showAlert(
          "Maximum Limit Reached",
          `Cannot save as featured. You already have ${MAX_FEATURED_LIMIT} featured projects selected.`
        );
        return;
      }
    }

    setLoading(true);
    setMessage("");

    try {
      const titleSlug =
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") || "project";

      const uniqueSuffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

      let finalCoverUrl = existingCoverUrl;
      const oldCoverUrlToDelete = coverFile && existingCoverUrl ? existingCoverUrl : null;

      if (coverFile) {
        const coverFileName = `${titleSlug}-cover-${uniqueSuffix}`;
        finalCoverUrl = await uploadToCloudflareR2(coverFile, coverFileName);
      }

      const newUploadedGalleryUrls = await Promise.all(
        galleryFiles.map((file, i) =>
          uploadToCloudflareR2(file, `${titleSlug}-gallery-${i + 1}-${uniqueSuffix}`)
        )
      );

      const finalGalleryUrls = [...existingGalleryUrls, ...newUploadedGalleryUrls.filter(Boolean)];

      const deliverablesArray = deliverables
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const slug = `${titleSlug}-${uniqueSuffix}`;

      let removedGalleryUrls = [];
      const originalProject = editingId ? projectsList.find((p) => p.id === editingId) : null;
      if (originalProject && Array.isArray(originalProject.gallery_images)) {
        removedGalleryUrls = originalProject.gallery_images.filter(
          (url) => !existingGalleryUrls.includes(url)
        );
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            title,
            category,
            location,
            duration,
            summary,
            deliverables: deliverablesArray,
            description,
            is_featured: isFeatured,
            cover_image: finalCoverUrl,
            gallery_images: finalGalleryUrls,
          })
          .eq("id", editingId);

        if (updateError) throw updateError;

        setMessage("Project updated successfully!");
        setMessageType("success");
      } else {
        const { error: insertError } = await supabase.from("projects").insert([
          {
            title,
            slug,
            category,
            location,
            duration,
            summary,
            deliverables: deliverablesArray,
            description,
            is_featured: isFeatured,
            cover_image: finalCoverUrl,
            gallery_images: finalGalleryUrls,
          },
        ]);

        if (insertError) throw insertError;

        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setHasDraft(false);

        setMessage("New project added successfully!");
        setMessageType("success");
      }

      const cleanupUrls = [...(oldCoverUrlToDelete ? [oldCoverUrlToDelete] : []), ...removedGalleryUrls];
      await Promise.all(cleanupUrls.map((url) => deleteFromCloudflareR2(url)));

      resetForm();
      await loadAllProjects();
      setActiveTab("projects");
    } catch (err) {
      console.error("Submit Error:", err);
      showAlert("Submission Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "All" || p.category === selectedCategoryFilter;

    const matchesFeatured = !filterFeaturedOnly || Boolean(p.is_featured);

    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const featuredCount = projectsList.filter((p) => p.is_featured).length;

  if (!authChecked) {
    return null;
  }

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <main className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.lockIconBox}>
            <FaLock className={styles.lockIcon} />
          </div>
          <h2>NEIPL Portal</h2>
          <p>Enter security passcode to unlock dashboard</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide passcode" : "Show passcode"}
                aria-label={showPassword ? "Hide passcode" : "Show passcode"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" className={styles.loginBtn}>
              Unlock Dashboard
            </button>
          </form>
          <Link to="/" className={styles.backToSiteLink}>
            <FaHome />
            Back to Site
          </Link>
        </div>

        {modal.isOpen && (
          <div
            className={styles.modalOverlay}
            onClick={closeModal}
            role="presentation"
          >
            <div
              className={styles.modalCard}
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={modal.isDanger ? styles.dangerIconBox : styles.alertIconBox}>
                {modal.isDanger ? <FaExclamationTriangle /> : <FaInfoCircle />}
              </div>
              <h3 id="login-modal-title" className={styles.modalTitle}>{modal.title}</h3>
              <p className={styles.modalMessage}>{modal.message}</p>
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalConfirmBtn} onClick={modal.onConfirm}>
                  {modal.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  // ================= MAIN DASHBOARD =================
  return (
    <div className={styles.dashboardContainer}>
      {/* SIDEBAR (Drawer Mode in Inquiries / Standard in other tabs) */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarActive : ""} ${
          activeTab === "inquiries" ? styles.sidebarDrawerMode : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.brandLink} aria-label="Go to homepage">
            <img src="/logo2.png" alt="NEIPL Logo" className={styles.sidebarLogo} />
            <span className={styles.sidebarBrandText}>NEIPL DASHBOARD</span>
          </Link>
          <button
            type="button"
            className={styles.sidebarCloseBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSectionLabel}>CORE MANAGEMENT</div>

          <button
            type="button"
            className={`${styles.sidebarLink} ${activeTab === "projects" ? styles.sidebarLinkActive : ""}`}
            onClick={() => {
              switchTab("projects");
              setSidebarOpen(false);
            }}
          >
            <FaThLarge className={styles.navIcon} />
            <span>Projects Overview</span>
            <span className={styles.badgeCount}>{projectsList.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.sidebarLink} ${activeTab === "inquiries" ? styles.sidebarLinkActive : ""}`}
            onClick={() => {
              switchTab("inquiries");
              setSidebarOpen(false);
            }}
          >
            <FaEnvelope className={styles.navIcon} />
            <span>Client Inquiries</span>
            {unreadInquiriesCount > 0 ? (
              <span className={styles.badgeCountUnread}>{unreadInquiriesCount}</span>
            ) : null}
          </button>

          <button
            type="button"
            className={`${styles.sidebarLink} ${activeTab === "form" ? styles.sidebarLinkActive : ""}`}
            onClick={() => {
              openCreateForm();
            }}
          >
            <FaPlus className={styles.navIcon} />
            <span>Add New Project</span>
          </button>

          <div className={styles.navSectionLabel}>SYSTEM &amp; SECURITY</div>

          <button
            type="button"
            className={`${styles.sidebarLink} ${activeTab === "settings" ? styles.sidebarLinkActive : ""}`}
            onClick={() => {
              switchTab("settings");
              setSidebarOpen(false);
            }}
          >
            <FaCog className={styles.navIcon} />
            <span>Admin Settings</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.footerSiteLink}>
            <FaHome />
            <span>View Live Site</span>
          </Link>
          <button type="button" onClick={handleLogout} className={styles.footerLogoutBtn}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE / OVERLAY BACKDROP */}
      {sidebarOpen && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setSidebarOpen(false)}
          role="presentation"
          aria-hidden="true"
          style={{ zIndex: 10000 }}
        />
      )}

      {/* MAIN CONTENT AREA */}
      {activeTab === "inquiries" ? (
        <div style={{ flex: 1, width: "100%", height: "100vh", overflow: "hidden", position: "relative" }}>
          <InquiriesManager
            showAlert={showAlert}
            showConfirm={showConfirm}
            onUnreadCountChange={setUnreadInquiriesCount}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            onLogout={handleLogout}
          />
        </div>
      ) : (
        <main className={styles.mainContent}>
          {/* MOBILE OPTIMIZED TOP UTILITY BAR */}
          <header className={styles.topUtilityBar}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars />
            </button>
            <h1 className={styles.pageHeading}>
              {activeTab === "projects" && "Projects"}
              {activeTab === "inquiries" && "Client Inquiries"}
              {activeTab === "form" && (editingId ? "Edit Project" : "New Project")}
              {activeTab === "settings" && "Settings"}
            </h1>
          </div>

          <div className={styles.topBarRight}>
            <Link to="/" className={styles.viewSiteButton} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt />
              <span className={styles.viewSiteText}>Live Site</span>
            </Link>
          </div>
        </header>

        {/* DYNAMIC ALERT BANNER */}
        {message && (
          <div
            className={
              messageType === "danger"
                ? `${styles.alertBanner} ${styles.alertBannerDanger}`
                : `${styles.alertBanner} ${styles.alertBannerSuccess}`
            }
          >
            <div className={styles.alertContent}>
              {messageType === "danger" ? (
                <FaExclamationTriangle className={styles.alertIcon} />
              ) : (
                <FaCheckCircle className={styles.alertIcon} />
              )}
              <span>{message}</span>
            </div>
            <button type="button" onClick={() => setMessage("")} className={styles.closeAlertBtn}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* ================= TAB 1: PROJECTS LIST ================= */}
        {activeTab === "projects" && (
          <div className={styles.tabContent}>
            {/* STATS METRIC CARDS */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIconBox}>
                  <FaLayerGroup />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Total Projects</span>
                  <strong className={styles.statValue}>{projectsList.length}</strong>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconBox} ${styles.statIconFeatured}`}>
                  <FaStar />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Featured Work</span>
                  <strong className={styles.statValue}>
                    {featuredCount} / {MAX_FEATURED_LIMIT}
                  </strong>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIconBox}>
                  <FaThLarge />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Categories</span>
                  <strong className={styles.statValue}>{CATEGORIES.length}</strong>
                </div>
              </div>
            </div>

            {/* FILTER & SEARCH TOOLBAR */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by title, category, or location..."
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

              <div className={styles.filterActions}>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className={styles.categorySelect}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className={`${styles.featuredFilterBtn} ${filterFeaturedOnly ? styles.featuredFilterActive : ""}`}
                  onClick={() => setFilterFeaturedOnly((prev) => !prev)}
                >
                  <FaStar />
                  <span>Featured ({featuredCount})</span>
                </button>

                <button type="button" className={styles.addProjectBtn} onClick={openCreateForm}>
                  <FaPlus />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            {/* PROJECTS TABLE */}
            <section className={styles.listSection}>
              {fetchingProjects ? (
                <div className={styles.loadingState}>
                  <FaSpinner className={styles.spinnerIcon} />
                  <span>Fetching live projects...</span>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className={styles.emptyState}>
                  <FaImages className={styles.emptyIcon} />
                  <h3>No Projects Found</h3>
                  <p>Try adjusting your search query or filter criteria.</p>
                  {projectsList.length === 0 && (
                    <button type="button" className={styles.submitBtn} onClick={openCreateForm}>
                      <FaPlus />
                      Upload First Project
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.projectsTable}>
                  {filteredProjects.map((project) => {
                    const isItemFeatured = Boolean(project.is_featured);

                    return (
                      <div key={project.id} className={styles.projectRow}>
                        <button
                          type="button"
                          className={`${styles.featuredStarBtn} ${isItemFeatured ? styles.starActive : ""}`}
                          onClick={() => handleToggleFeatured(project.id, isItemFeatured, project.title)}
                          title={isItemFeatured ? "Remove from Featured" : "Mark as Featured (Max 6)"}
                        >
                          {isItemFeatured ? <FaStar /> : <FaRegStar />}
                        </button>

                        <div className={styles.rowThumb}>
                          <img src={project.cover_image} alt={project.title} loading="lazy" />
                          {isItemFeatured && <span className={styles.featuredBadgePill}>Featured</span>}
                        </div>

                        <div className={styles.rowInfo}>
                          <div className={styles.rowTitleWrap}>
                            <h3>{project.title}</h3>
                          </div>
                          <div className={styles.rowBadges}>
                            <span className={styles.badgeCategory}>{project.category}</span>
                            <span className={styles.badgeLoc}>{project.location}</span>
                            {project.gallery_images?.length > 0 && (
                              <span className={styles.badgeGallery}>
                                <FaImages />
                                {project.gallery_images.length} Photos
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.rowActions}>
                          <a
                            href={`/projects#${project.slug || project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewLiveBtn}
                            title="View on site"
                          >
                            <FaExternalLinkAlt />
                            <span className={styles.btnText}>View</span>
                          </a>
                          <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => startEditing(project)}
                            title="Edit project"
                          >
                            <FaEdit />
                            <span className={styles.btnText}>Edit</span>
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(project.id, project.title)}
                            title="Delete project"
                          >
                            <FaTrash />
                            <span className={styles.btnText}>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ================= TAB 2: FORM WITH AUTO-SAVED DRAFTS ================= */}
        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className={styles.uploadForm}>
            <div className={styles.formHeader}>
              <div>
                <h2>{editingId ? "Edit Project" : "Upload New Project"}</h2>
                <p className={styles.formSubhead}>
                  {editingId
                    ? "Modify project details or media files."
                    : "Fill out details to publish to the live portfolio."}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {hasDraft && !editingId && (
                  <button
                    type="button"
                    className={styles.clearDraftBtn}
                    onClick={clearDraft}
                    title="Discard saved draft"
                  >
                    <FaTrash />
                    <span>Discard Draft</span>
                  </button>
                )}

                {editingId && (
                  <button type="button" className={styles.cancelEditBtn} onClick={resetForm}>
                    <FaTimes />
                    Cancel Editing
                  </button>
                )}
              </div>
            </div>

            {hasDraft && !editingId && (
              <div className={styles.draftAlertBox}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaSave className={styles.draftIcon} />
                  <span>
                    <strong>Draft Restored:</strong> Unsaved project data preserved (Saved at {draftLastSaved}).
                  </span>
                </div>
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.photosCol}>
                <div className={styles.fieldBlock}>
                  <label className={styles.fieldLabel}>Main Cover Photo *</label>
                  <label className={styles.coverDropArea}>
                    {coverPreview || existingCoverUrl ? (
                      <div className={styles.previewImageContainer}>
                        <img
                          src={coverPreview || existingCoverUrl}
                          alt="Cover Preview"
                          className={styles.imagePreview}
                        />
                        <div className={styles.changeOverlay}>
                          <FaCloudUploadAlt />
                          Change Cover Photo
                        </div>
                      </div>
                    ) : (
                      <div className={styles.dropPlaceholder}>
                        <FaCloudUploadAlt className={styles.uploadIcon} />
                        <span>Click to Select Main Cover Photo</span>
                        <small className={styles.compressionNotice}>
                          ⚡ Auto-compressed to WEBP if &gt; 350KB
                        </small>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className={styles.fileInput}
                    />
                  </label>
                </div>

                <div className={styles.fieldBlock}>
                  <label className={styles.fieldLabel}>Multiple Gallery Photos</label>
                  <label className={styles.galleryDropArea}>
                    <FaImages className={styles.uploadIconSmall} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span>Click to select multiple gallery photos</span>
                      <small className={styles.compressionNotice}>
                        ⚡ Multi-upload auto-compression
                      </small>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      className={styles.fileInput}
                    />
                  </label>

                  {(existingGalleryUrls.length > 0 || galleryPreviews.length > 0) && (
                    <div className={styles.galleryPreviewGrid}>
                      {existingGalleryUrls.map((url, index) => (
                        <div key={`existing-${index}`} className={styles.galleryThumbCard}>
                          <img src={url} alt="Gallery item" />
                          <button
                            type="button"
                            className={styles.removeThumbBtn}
                            onClick={() => removeExistingGalleryUrl(url)}
                            title="Remove photo"
                          >
                            <FaTimes />
                          </button>
                          <span className={styles.savedTag}>Saved</span>
                        </div>
                      ))}
                      {galleryPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className={styles.galleryThumbCard}>
                          <img src={preview} alt="New preview" />
                          <button
                            type="button"
                            className={styles.removeThumbBtn}
                            onClick={() => removeGalleryFile(index)}
                            title="Remove photo"
                          >
                            <FaTimes />
                          </button>
                          <span className={styles.newTag}>New</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailsCol}>
                <div className={styles.featuredToggleRow}>
                  <label className={styles.switchLabel}>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={handleFeaturedCheckboxChange}
                    />
                    <span className={styles.switchSlider} />
                  </label>
                  <div className={styles.switchTextWrap}>
                    <strong>Highlight as Featured Project (Max 6)</strong>
                    <p>Priority display on homepage showcase section.</p>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Project Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Residential Villa"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.rowTwo}>
                  <div className={styles.inputGroup}>
                    <label>Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Baramulla, JK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Duration / Scope</label>
                  <input
                    type="text"
                    placeholder="e.g. Design &amp; Full Execution"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Short Overview / Summary *</label>
                  <input
                    type="text"
                    placeholder="Brief summary shown on project cards and modal header"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Key Deliverables (Enter each deliverable on a new line)</label>
                  <textarea
                    rows={3}
                    placeholder={"Full architectural & structural compliance\nOn-time execution with site supervision\nHigh-durability material selection"}
                    value={deliverables}
                    onChange={(e) => setDeliverables(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Architectural &amp; Engineering Scope</label>
                  <textarea
                    rows={5}
                    placeholder={"Structural Engineering: Reinforced concrete frame with high load capacity\nRoof System: Custom gabled truss alignment for snow shedding"}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner className={styles.spinnerIcon} />
                      <span>Saving Project...</span>
                    </>
                  ) : editingId ? (
                    "Update Project"
                  ) : (
                    "Publish Project"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= TAB 3: SETTINGS WITH EMAIL OTP ================= */}
        {activeTab === "settings" && (
          <div className={styles.settingsSection}>
            <div className={styles.settingsCard}>
              <div className={styles.settingsHeader}>
                <div className={styles.settingsIconBox}>
                  <FaKey />
                </div>
                <div>
                  <h2>Change Admin Passcode</h2>
                  <p>Secured with Email OTP verification dispatched to the master administrator inbox.</p>
                </div>
              </div>

              {!otpSent ? (
                /* STEP 1: DISPATCH OTP BUTTON */
                <div className={styles.otpRequestBox}>
                  <div className={styles.otpRequestInfo}>
                    <FaEnvelope className={styles.otpRequestIcon} />
                    <div>
                      <strong>Owner Identity Verification</strong>
                      <p>
                        A one-time verification code will be dispatched to <strong>{import.meta.env.VITE_ADMIN_EMAIL}</strong> to authorize password changes.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.sendOtpBtn}
                    onClick={handleSendEmailOtp}
                    disabled={otpSending}
                  >
                    {otpSending ? (
                      <>
                        <FaSpinner className={styles.spinnerIcon} />
                        <span>Sending Security Code...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Security Code to Email</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* STEP 2: ENTER OTP & NEW PASSCODE FORM */
                <form onSubmit={handleVerifyOtpAndChangePassword} className={styles.settingsForm}>
                  <div className={styles.otpNoticeBanner}>
                    <span>
                      Verification code sent to <strong>{import.meta.env.VITE_ADMIN_EMAIL}</strong>
                    </span>
                    <button
                      type="button"
                      className={styles.resendOtpBtn}
                      onClick={handleSendEmailOtp}
                      disabled={resendCooldown > 0 || otpSending}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                    </button>
                  </div>

                  {/* OTP INPUT (Accommodates 6 to 10 characters) */}
                  <div className={styles.inputGroup}>
                    <label>Email Verification Code *</label>
                    <input
                      type="text"
                      maxLength={8}
                      placeholder="Enter verification code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\s/g, ""))}
                      className={styles.otpInput}
                      required
                      autoFocus
                    />
                  </div>

                  {/* NEW PASSCODE INPUT */}
                  <div className={styles.inputGroup}>
                    <label>New Security Passcode *</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new passcode (min. 6 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className={styles.togglePasswordBtn}
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        title={showNewPassword ? "Hide passcode" : "Show passcode"}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM NEW PASSCODE INPUT */}
                  <div className={styles.inputGroup}>
                    <label>Confirm New Passcode *</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Repeat new passcode"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      className={styles.cancelOtpBtn}
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.saveSettingsBtn}
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <>
                          <FaSpinner className={styles.spinnerIcon} />
                          <span>Verifying &amp; Updating...</span>
                        </>
                      ) : (
                        "Verify & Update Passcode"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
      )}

      {/* REUSABLE POPUP MODAL */}
      {modal.isOpen && (
        <div
          className={styles.modalOverlay}
          onClick={closeModal}
          role="presentation"
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={modal.isDanger ? styles.dangerIconBox : styles.alertIconBox}>
              {modal.isDanger ? <FaExclamationTriangle /> : <FaInfoCircle />}
            </div>
            <h3 id="dashboard-modal-title" className={styles.modalTitle}>{modal.title}</h3>
            <p className={styles.modalMessage}>{modal.message}</p>
            <div className={styles.modalActions}>
              {modal.type === "confirm" && (
                <button type="button" className={styles.modalCancelBtn} onClick={closeModal}>
                  {modal.cancelText}
                </button>
              )}
              <button
                type="button"
                className={modal.isDanger ? `${styles.modalConfirmBtn} ${styles.modalDangerBtn}` : styles.modalConfirmBtn}
                onClick={modal.onConfirm}
                autoFocus
              >
                {modal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}