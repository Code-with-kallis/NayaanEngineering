// src/pages/Team/Team.jsx
import { useEffect } from "react";
import TeamHero from "../../components/team/TeamHero";
import TeamSection from "../../components/team/TeamSection";
import { getMembersBySection } from "../../data/team";
import "./Team.css";

const SECTION_CONTENT = [
  {
    id: "leadership",
    title: "Leadership Team",
    description:
      "The people setting direction, strategy, and standards for Nayaab Engineering Innovations.",
  },
  {
    id: "architecture",
    title: "Architecture Team",
    description:
      "Designers translating client vision into buildable architectural and interior plans.",
  },
  {
    id: "engineering",
    title: "Engineering Team",
    description:
      "Technical specialists handling structural, electrical, and CAD engineering work.",
  },
  {
    id: "construction",
    title: "Construction Team",
    description:
      "Skilled tradespeople and site staff who execute every project on the ground.",
  },
];

function Team() {
  useEffect(() => {
    document.title = "Our Team | Nayaab Engineering Innovations";
  }, []);

  return (
    <main id="main">
      <TeamHero
        eyebrow="Our People"
        title="The team building Nayaab's reputation, project by project"
        description="From boardroom strategy to on-site execution, meet the people across leadership, architecture, engineering, and construction who deliver every Nayaab project."
        image="/assets/team/team-hero.webp"
        stats={[
          { value: "11", label: "Team members" },
          { value: "4", label: "Departments" },
        ]}
      />

      {SECTION_CONTENT.map((section) => (
        <TeamSection
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
          members={getMembersBySection(section.id)}
        />
      ))}
    </main>
  );
}

export default Team;