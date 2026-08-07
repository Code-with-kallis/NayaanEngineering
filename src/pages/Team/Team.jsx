// src/pages/Team/Team.jsx
import { useEffect } from "react";
import TeamHero from "../../components/team/TeamHero";
import TeamSection from "../../components/team/TeamSection";
import { TEAM_SECTIONS, getMembersBySection, teamMembers } from "../../data/team";
import "./Team.css";

const SECTION_CONTENT = [
  {
    id: "leadership",
    eyebrow: "Direction & governance",
    title: "Leadership Team",
    description:
      "The people setting direction, strategy, and standards for Nayaab Engineering Innovations.",
  },
  {
    id: "architecture",
    eyebrow: "Concept & planning",
    title: "Architecture Team",
    description:
      "Designers translating client vision into buildable architectural and interior plans.",
  },
  {
    id: "engineering",
    eyebrow: "Technical coordination",
    title: "Engineering Team",
    description:
      "Technical specialists handling structural, electrical, and CAD engineering work.",
  },
  {
    id: "construction",
    eyebrow: "On-site execution",
    title: "Field Operations Team",
    description:
      "Skilled tradespeople and site staff who execute every project on the ground.",
  },
];

function Team() {
  useEffect(() => {
    document.title = "Our Team | Nayaab Engineering Innovations";
  }, []);

  const sections = SECTION_CONTENT.map((section) => ({
    ...section,
    members: getMembersBySection(section.id),
  }));

  return (
    <main id="main" className="team-page">
      <TeamHero
        eyebrow="Our People"
        title="The people behind NEIPL"
        description="From leadership and concept planning to engineering coordination and site execution, every Nayaab project is delivered by one connected team."
        image="/assets/team/team-hero.webp"
        stats={[
          { value: `${teamMembers.length}`, label: "Team members" },
          { value: `${TEAM_SECTIONS.length}`, label: "Departments" },
        ]}
        primaryAction={{ href: "#leadership", label: "Meet the team" }}
        secondaryAction={{ href: "/contact", label: "Start a project" }}
      />

      <div className="team-page__sections">
        {sections.map((section, index) => (
          <TeamSection
            key={section.id}
            id={section.id}
            title={section.title}
            description={section.description}
            members={section.members}
          />
        ))}
      </div>
    </main>
  );
}

export default Team;
