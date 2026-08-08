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
      "The leaders setting direction, strategy, and engineering standards for Nayaab Engineering Innovations.",
  },
  {
    id: "architecture",
    eyebrow: "Concept & planning",
    title: "Architecture Team",
    description:
      "Designers translating client vision into buildable architectural and structural plans.",
  },
  {
    id: "engineering",
    eyebrow: "Technical specialists",
    title: "Electrical & Engineering Operations",
    description:
      "Specialists responsible for electrical installations, maintenance, technical consultancy, and site troubleshooting.",
  },
  {
    id: "construction",
    eyebrow: "On-site execution",
    title: "Field Operations Team",
    description:
      "Skilled engineers, technicians, and field supervisors executing projects safely on the ground.",
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
        title="Engineering Excellence Delivered by One Team"
        description="From executive leadership and concept design to structural engineering and site execution, every Nayaab project is driven by our dedicated specialists."
        image="https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/Projects/Hero/1.jpg"
        stats={[
          { value: `${teamMembers.length}`, label: "Team members" },
          { value: `${TEAM_SECTIONS.length}`, label: "Departments" },
        ]}
        primaryAction={{ href: "#leadership", label: "Meet the Team" }}
        secondaryAction={{ href: "/contact", label: "Start a Project" }}
      />

      <div className="team-page__sections">
        {sections.map((section) => (
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