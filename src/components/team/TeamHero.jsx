import "./TeamHero.css";

function TeamHero({ eyebrow, title, description, stats = [], image }) {
  return (
    <section
      className="team-hero"
      aria-labelledby="team-hero-heading"
      style={image ? { "--team-hero-image": `url(${image})` } : undefined}
    >
      <div className="team-hero__backdrop" />
      <div className="container team-hero__inner">
        <div className="team-hero__content">
          {eyebrow && <p className="team-hero__eyebrow">{eyebrow}</p>}

          <h1 id="team-hero-heading" className="team-hero__title">
            {title}
          </h1>

          {description && (
            <p className="team-hero__description">{description}</p>
          )}
        </div>

        {stats.length > 0 && (
          <dl className="team-hero__stats">
            {stats.map((stat) => (
              <div className="team-hero__stat" key={stat.label}>
                <dt className="team-hero__stat-label">{stat.label}</dt>
                <dd className="team-hero__stat-value">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export default TeamHero;