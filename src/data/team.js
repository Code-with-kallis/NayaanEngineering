// src/data/team.js
// ============================================================================
// NAYAAB ENGINEERING INNOVATIONS — TEAM DATA CONTRACT
// Single source of truth consumed by:
//   - pages/Team/Team.jsx        (grid, grouped by section)
//   - pages/Team/TeamProfile.jsx (dynamic /team/:employeeId route)
//
// Adding a new employee = add one object here. No other file changes.
// ============================================================================

/**
 * @typedef {"leadership" | "architecture" | "engineering" | "construction"} TeamSection
 *
 * teamSection  -> which homepage section the card renders in (authority/role-based)
 * department   -> actual operational department (descriptive, shown on card + profile)
 * designation  -> job title, exactly as issued by HR
 */

export const TEAM_SECTIONS = [
  { id: "leadership", label: "Leadership Team" },
  { id: "architecture", label: "Architecture Team" },
  { id: "engineering", label: "Engineering Team" },
  { id: "construction", label: "Construction Team" },
];

export const teamMembers = [
  {
    employeeId: "neipl-0101",
    name: "Waseem Manzoor",
    designation: "Chairman",
    department: "Board of Directors",
    teamSection: "leadership",
    contact: { phone: "+91-9149905828", email: null },
    image: "/assets/team/neipl-0101.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0102",
    name: "Saajid Rashid",
    designation: "Director",
    department: "Construction & Site Operations",
    teamSection: "leadership",
    contact: { phone: "+91-7889696178", email: null },
    image: "/assets/team/neipl-0102.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0103",
    name: "Aaqib Nazir",
    designation: "Director",
    department: "Engineering & Technical Operations",
    teamSection: "leadership",
    contact: { phone: "+91-7889384997", email: null },
    image: "/assets/team/neipl-0103.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0104",
    name: "Junaid Bilal",
    designation: "Managing Director",
    department: "Executive Leadership",
    teamSection: "leadership",
    contact: { phone: "+91-9858765435", email: null },
    image: "/assets/team/neipl-0104.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0105",
    name: "Huma Gayas",
    designation: "Architect / Interior Designer",
    department: "Architecture & Design",
    teamSection: "architecture",
    contact: { phone: "+91-7006101131", email: null },
    image: "/assets/team/neipl-0105.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0106",
    name: "Sameera Hassan",
    designation: "Architectural Designer",
    department: "Architecture & Design",
    teamSection: "architecture",
    contact: { phone: "+91-9149475420", email: null },
    image: "/assets/team/neipl-0106.jpeg",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0107",
    name: "Birgees Anjum",
    designation: "CAD Designer",
    department: "Engineering & Technical Operations",
    teamSection: "engineering",
    contact: { phone: "+91-7006621023", email: null },
    image: "/assets/team/neipl-0107.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0120",
    name: "Tariq Ahmad Ganaie",
    designation: "Skilled Carpenter",
    department: "Construction & Site Operations",
    teamSection: "construction",
    contact: { phone: "+91-9906866045", email: null },
    image: "/assets/team/neipl-0120.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0121",
    name: "Showkat Ahmad Khan",
    designation: "Skilled Mason",
    department: "Construction & Site Operations",
    teamSection: "construction",
    contact: { phone: "+91-9596569094", email: null },
    image: "/assets/team/neipl-0121.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0122",
    name: "Abdul Qayoom War",
    designation: "Skilled Mason",
    department: "Construction & Site Operations",
    teamSection: "construction",
    contact: { phone: "+91-9149568830", email: null },
    image: "/assets/team/neipl-0122.png",
    bio: "",
    skills: [],
    projects: [],
  },
  {
    employeeId: "neipl-0123",
    name: "Sajid Hussain",
    designation: "Electrician",
    department: "Engineering & Technical Operations",
    teamSection: "engineering",
    contact: { phone: "+91-8899978172", email: null },
    image: "/assets/team/neipl-0123.png",
    bio: "",
    skills: [],
    projects: [],
  },
];

// ----------------------------------------------------------------------------
// DERIVED LOOKUPS — computed once at module load, O(1) access everywhere else
// ----------------------------------------------------------------------------

const employeeIndexById = new Map(
  teamMembers.map((member, index) => [member.employeeId, index])
);

/**
 * Returns a single employee by ID, or undefined if not found.
 * Used by TeamProfile.jsx to resolve the :employeeId route param.
 */
export function getEmployeeById(employeeId) {
  const index = employeeIndexById.get(employeeId?.toLowerCase());
  return index === undefined ? undefined : teamMembers[index];
}

/**
 * Returns all employees belonging to a given section, in data-declaration order.
 * Used by Team.jsx to render each TeamSection + TeamGrid.
 */
export function getMembersBySection(sectionId) {
  return teamMembers.filter((member) => member.teamSection === sectionId);
}

/**
 * Returns { previous, next } employees relative to the given ID, wrapping
 * around the full roster. Powers the Previous/Next navigation on TeamProfile.jsx.
 */
export function getAdjacentEmployees(employeeId) {
  const index = employeeIndexById.get(employeeId?.toLowerCase());
  if (index === undefined) return { previous: null, next: null };

  const total = teamMembers.length;
  const previous = teamMembers[(index - 1 + total) % total];
  const next = teamMembers[(index + 1) % total];

  return { previous, next };
}