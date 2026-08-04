// src/components/team/TeamGrid.jsx
import TeamCard from "./TeamCard";
import "./TeamGrid.css";

/**
 * TeamGrid — responsive grid of employee cards.
 * Single responsibility: layout only. No section headings, no filtering logic.
 *
 * @param {Object} props
 * @param {Array<Object>} props.members - Array of employee objects (data/team.js shape)
 */
function TeamGrid({ members }) {
  if (!members || members.length === 0) return null;

  return (
    <ul className="team-grid" role="list">
      {members.map((employee) => (
        <li key={employee.employeeId} className="team-grid__item">
          <TeamCard employee={employee} variant="grid" />
        </li>
      ))}
    </ul>
  );
}

export default TeamGrid;