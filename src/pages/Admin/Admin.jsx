import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { uploadToCloudflareR2, deleteFromCloudflareR2 } from "../../lib/cloudflareR2";
import { 
  FaCloudUploadAlt, 
  FaLock, 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaList, 
  FaImages, 
  FaTimes,
  FaHome,
  FaSignOutAlt,
  FaSpinner,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import styles from "./Admin.module.css";

const CATEGORIES = ["Building", "Commercial", "Residential", "Aviation", "Electrical", "Energy", "Stadium"];

// Strict 350 KB Threshold for Auto-Compression to WEBP
const COMPRESSION_THRESHOLD_BYTES = 350 * 1024; // 350 KB

const compressImageIfNeeded = (file, maxWidth = 1920, quality = 0.80) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
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
              reject(new Error("Compression failed"));
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

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState("list");
  
  const [projectsList, setProjectsList] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Residential");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [summary, setSummary] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [description, setDescription] = useState("");
  
  // Single Cover Image state
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState("");

  // Multiple Gallery Images state
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Custom Modal State
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "nayaab2026") {
      setIsAuthenticated(true);
    } else {
      showAlert("Invalid Passcode", "The security passcode you entered is incorrect. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
    } finally {
      setFetchingProjects(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllProjects();
    }
  }, [isAuthenticated]);

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
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
    const files = Array.from(e.target.files);
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
    showConfirm({
      title: "Remove Image",
      message: "Are you sure you want to remove this newly selected photo?",
      confirmText: "Remove Image",
      isDanger: true,
      onConfirm: () => {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  const removeExistingGalleryUrl = (urlToRemove) => {
    showConfirm({
      title: "Remove Saved Image",
      message: "Are you sure you want to remove this saved photo from the project?",
      confirmText: "Remove Image",
      isDanger: true,
      onConfirm: () => {
        setExistingGalleryUrls((prev) => prev.filter((url) => url !== urlToRemove));
      },
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Residential");
    setLocation("");
    setDuration("");
    setSummary("");
    setDeliverables("");
    setDescription("");
    setCoverFile(null);
    setCoverPreview(null);
    setExistingCoverUrl("");
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGalleryUrls([]);
  };

  const openCreateForm = () => {
    resetForm();
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditing = (project) => {
    setEditingId(project.id);
    setTitle(project.title || "");
    setCategory(project.category || "Residential");
    setLocation(project.location || "");
    setDuration(project.duration || "");
    setSummary(project.summary || "");
    setDeliverables(Array.isArray(project.deliverables) ? project.deliverables.join("\n") : "");
    setDescription(project.description || "");
    setExistingCoverUrl(project.cover_image || "");
    setCoverPreview(project.cover_image || null);
    setExistingGalleryUrls(project.gallery_images || []);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

          if (targetProject) {
            if (targetProject.cover_image) {
              await deleteFromCloudflareR2(targetProject.cover_image);
            }

            if (Array.isArray(targetProject.gallery_images)) {
              for (const url of targetProject.gallery_images) {
                await deleteFromCloudflareR2(url);
              }
            }
          }

          const { error: dbError } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

          if (dbError) throw dbError;

          setProjectsList((prev) => prev.filter((item) => item.id !== id));
          setMessage(`Project "${projectTitle}" and images deleted successfully!`);
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

    setLoading(true);
    setMessage("");

    try {
      const titleSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "project";

      const uniqueSuffix = Date.now().toString().slice(-4);

      let finalCoverUrl = existingCoverUrl;
      
      // 1. Delete old cover image from Cloudflare R2 if a new cover photo is uploaded
      if (coverFile) {
        if (existingCoverUrl) {
          await deleteFromCloudflareR2(existingCoverUrl);
        }
        const coverFileName = `${titleSlug}-cover-${uniqueSuffix}`;
        finalCoverUrl = await uploadToCloudflareR2(coverFile, coverFileName);
      }

      // 2. Upload new gallery files
      const newUploadedGalleryUrls = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const galleryFileName = `${titleSlug}-gallery-${i + 1}-${uniqueSuffix}`;
        const uploadedUrl = await uploadToCloudflareR2(galleryFiles[i], galleryFileName);
        if (uploadedUrl) {
          newUploadedGalleryUrls.push(uploadedUrl);
        }
      }

      const finalGalleryUrls = [...existingGalleryUrls, ...newUploadedGalleryUrls];

      const deliverablesArray = deliverables
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const slug = `${titleSlug}-${uniqueSuffix}`;

      if (editingId) {
        // 3. Delete removed gallery images from Cloudflare R2
        const originalProject = projectsList.find((p) => p.id === editingId);
        if (originalProject && Array.isArray(originalProject.gallery_images)) {
          const removedGalleryUrls = originalProject.gallery_images.filter(
            (url) => !existingGalleryUrls.includes(url)
          );
          for (const url of removedGalleryUrls) {
            await deleteFromCloudflareR2(url);
          }
        }

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
            cover_image: finalCoverUrl,
            gallery_images: finalGalleryUrls,
          })
          .eq("id", editingId);

        if (updateError) throw updateError;
        setMessage("Project updated successfully and old images deleted from R2!");
      } else {
        const { error: insertError } = await supabase
          .from("projects")
          .insert([
            {
              title,
              slug,
              category,
              location,
              duration,
              summary,
              deliverables: deliverablesArray,
              description,
              cover_image: finalCoverUrl,
              gallery_images: finalGalleryUrls,
            },
          ]);

        if (insertError) throw insertError;
        setMessage("New project published successfully!");
      }

      resetForm();
      await loadAllProjects();
      setActiveTab("list");
    } catch (err) {
      console.error("Submit Error:", err);
      showAlert("Submission Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.lockIconBox}>
            <FaLock className={styles.lockIcon} />
          </div>
          <h2>Super Admin Portal</h2>
          <p>Enter security passcode to manage NEIPL website</p>

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
            <FaHome /> Back to Main Website
          </Link>
        </div>

        {modal.isOpen && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={`${styles.modalIconBox} ${modal.isDanger ? styles.dangerIconBox : styles.alertIconBox}`}>
                {modal.isDanger ? <FaExclamationTriangle /> : <FaInfoCircle />}
              </div>
              <h3 className={styles.modalTitle}>{modal.title}</h3>
              <p className={styles.modalMessage}>{modal.message}</p>
              <div className={styles.modalActions}>
                <button className={styles.modalConfirmBtn} onClick={modal.onConfirm}>
                  {modal.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className={styles.adminWrapper}>
      <div className={styles.utilityBar}>
        <Link to="/" className={styles.siteLink}>
          <FaHome /> <span>View Live Site</span>
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>

      <header className={styles.adminTopBar}>
        <div className={styles.headerText}>
          <h1>Super Admin Dashboard</h1>
          <p>Manage, upload, and organize projects in real-time.</p>
        </div>

        <div className={styles.tabGroup}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "list" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("list")}
          >
            <FaList /> <span>Manage Projects ({projectsList.length})</span>
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "form" ? styles.activeTab : ""}`}
            onClick={openCreateForm}
          >
            <FaPlus /> <span>New Project</span>
          </button>
        </div>
      </header>

      {message && (
        <div className={styles.alertBanner}>
          <span>{message}</span>
          <button onClick={() => setMessage("")} className={styles.closeAlertBtn}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* TAB 1: PROJECTS LIST */}
      {activeTab === "list" && (
        <section className={styles.listSection}>
          {fetchingProjects ? (
            <div className={styles.loadingState}>
              <FaSpinner className={styles.spinnerIcon} />
              <span>Fetching live projects from database...</span>
            </div>
          ) : projectsList.length === 0 ? (
            <div className={styles.emptyState}>
              <FaImages className={styles.emptyIcon} />
              <h3>No Projects Published Yet</h3>
              <p>Your portfolio database is currently empty.</p>
              <button className={styles.submitBtn} onClick={openCreateForm}>
                <FaPlus /> Upload First Project
              </button>
            </div>
          ) : (
            <div className={styles.projectsTable}>
              {projectsList.map((project) => (
                <div key={project.id} className={styles.projectRow}>
                  <div className={styles.rowThumb}>
                    <img src={project.cover_image} alt={project.title} loading="lazy" />
                  </div>

                  <div className={styles.rowInfo}>
                    <h3>{project.title}</h3>
                    <div className={styles.rowBadges}>
                      <span className={styles.badgeCategory}>{project.category}</span>
                      <span className={styles.badgeLoc}>{project.location}</span>
                      {project.gallery_images?.length > 0 && (
                        <span className={styles.badgeGallery}>
                          <FaImages /> {project.gallery_images.length} Photos
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.rowActions}>
                    <a 
                      href={`/projects#${project.slug}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className={styles.viewLiveBtn}
                      title="View live card"
                    >
                      <FaExternalLinkAlt /> <span className={styles.btnText}>View</span>
                    </a>
                    <button 
                      className={styles.editBtn} 
                      onClick={() => startEditing(project)}
                      title="Edit project"
                    >
                      <FaEdit /> <span className={styles.btnText}>Edit</span>
                    </button>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => handleDelete(project.id, project.title)}
                      title="Delete project"
                    >
                      <FaTrash /> <span className={styles.btnText}>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: UPLOAD / EDIT FORM */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          <div className={styles.formHeader}>
            <div>
              <h2>{editingId ? "Edit Existing Project" : "Upload New Project"}</h2>
              <p className={styles.formSubhead}>
                {editingId ? "Modify details or add photos to this entry." : "Fill out details to publish directly to the live portfolio."}
              </p>
            </div>
            {editingId && (
              <button type="button" className={styles.cancelEditBtn} onClick={resetForm}>
                <FaTimes /> Cancel Editing
              </button>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.photosCol}>
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>Main Cover Photo *</label>
                <label className={styles.coverDropArea}>
                  {coverPreview ? (
                    <div className={styles.previewImageContainer}>
                      <img src={coverPreview} alt="Cover Preview" className={styles.imagePreview} />
                      <div className={styles.changeOverlay}>
                        <FaCloudUploadAlt /> Change Cover Photo
                      </div>
                    </div>
                  ) : (
                    <div className={styles.dropPlaceholder}>
                      <FaCloudUploadAlt className={styles.uploadIcon} />
                      <span>Click to Select Main Cover Photo</span>
                      <small style={{ color: "#B7410E", fontWeight: 600, marginTop: "6px" }}>
                        ⚡ Images &gt; 350KB auto-compressed to WEBP
                      </small>
                      <small style={{ color: "#94A3B8" }}>Images ≤ 350KB uploaded as original</small>
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
                    <small style={{ color: "#B7410E", fontWeight: 600, marginTop: "2px" }}>
                      ⚡ Images &gt; 350KB auto-compressed to WEBP
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
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Baramulla, J&K"
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
                  placeholder="e.g. Design & Full Execution"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Short Overview / Summary * (Appears ABOVE Gallery)</label>
                <input
                  type="text"
                  placeholder="Brief summary shown on project cards and above the gallery in drawer modal"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Key Deliverables (Enter each point on a new line)</label>
                <textarea
                  rows="3"
                  placeholder="Full architectural & structural engineering compliance&#10;On-time execution with site supervision&#10;High-durability material selection"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Architectural & Engineering Scope (Appears BELOW Gallery)</label>
                <small style={{ color: "#B7410E", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  💡 Formatting Tip: Text before a colon (:) will automatically appear BOLD! (e.g. Roof System: Details)
                </small>
                <textarea
                  rows="6"
                  placeholder="Located in Dangiwacha, J&K, this project represents...&#10;&#10;Structural Engineering: Reinforced concrete frame with high load capacity&#10;Roof System: Custom gabled truss alignment for snow shedding&#10;Thermal Insulation: Integrated weather barrier protection"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className={styles.spinnerIcon} />
                    <span>Publishing Project...</span>
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

      {/* REUSABLE CUSTOM POPUP MODAL */}
      {modal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={`${styles.modalIconBox} ${modal.isDanger ? styles.dangerIconBox : styles.alertIconBox}`}>
              {modal.isDanger ? <FaExclamationTriangle /> : <FaInfoCircle />}
            </div>
            <h3 className={styles.modalTitle}>{modal.title}</h3>
            <p className={styles.modalMessage}>{modal.message}</p>
            <div className={styles.modalActions}>
              {modal.type === "confirm" && (
                <button className={styles.modalCancelBtn} onClick={closeModal}>
                  {modal.cancelText}
                </button>
              )}
              <button 
                className={`${styles.modalConfirmBtn} ${modal.isDanger ? styles.modalDangerBtn : ""}`} 
                onClick={modal.onConfirm}
              >
                {modal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}