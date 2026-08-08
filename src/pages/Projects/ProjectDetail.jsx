// src/pages/Projects/ProjectDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS_DATA } from '../../data/projects';
import ProjectGallery from '../../components/projects/ProjectGallery';
import styles from './ProjectDetail.module.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = PROJECTS_DATA.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2>Project Not Found</h2>
        <Link to="/projects">&larr; Back to all projects</Link>
      </div>
    );
  }

  return (
    <article className={styles.container}>
      <Link to="/projects" className={styles.backLink}>&larr; Back to Projects</Link>
      
      <header className={styles.header}>
        <span className={styles.category}>{project.category}</span>
        <h1>{project.title}</h1>
        <p className={styles.subtext}>{project.location} • Completed in {project.year}</p>
      </header>

      <div className={styles.mainLayout}>
        {/* Left Column: Image Gallery */}
        <div className={styles.galleryColumn}>
          <ProjectGallery gallery={project.gallery} title={project.title} />
        </div>

        {/* Right Column: Project Specifications & Details */}
        <aside className={styles.sidebar}>
          <div className={styles.specCard}>
            <h3>Project Specifications</h3>
            <dl className={styles.specList}>
              <div className={styles.specItem}>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
              {project.specifications.map((spec, i) => (
                <div key={i} className={styles.specItem}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <section className={styles.descriptionSection}>
        <h2>Overview & Scope of Work</h2>
        <p className={styles.description}>{project.description}</p>
      </section>
    </article>
  );
}