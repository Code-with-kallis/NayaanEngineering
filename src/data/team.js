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
  { id: "construction", label: "Field Operations Team" },
];

export const teamMembers = [
  {
    employeeId: "neipl-0101",
    name: "Er. Waseem Manzoor",
    designation: "Chairman",
    gender: "Male",
    department: "Board of Directors",
    teamSection: "leadership",
    contact: { email: "info@nayaabengineering.com" },
    image: "/assets/team/waseemmanzoor.jpg",
    quote: "Our foundation is built on integrity, engineering rigor, and a sustainable vision. We build not just structures, but legacies.",
    bio: "Waseem Manzoor serves as Chairman of Nayaab Engineering Innovations, guiding corporate vision, governance, and long-term strategic expansion across major engineering and infrastructure sectors.",
    stats: [
      { label: "Experience", value: "20+ Yrs" },
      { label: "Board Leadership", value: "15+ Yrs" },
      { label: "Strategic Vision", value: "Global" },
    ],
    skills: [
      "Corporate Governance",
      "Strategic Planning",
      "Capital Allocation",
      "Engineering Leadership",
      "Public Relations",
    ],
    projects: [
      "Commercial Complex Masterplan",
      "Infrastructure Governance Strategy",
      "Urban Redevelopment Review",
    ],
  },
  
  {
    employeeId: "neipl-0102",
    name: "Er. Saajid Rashid",
    designation: "Director",
    gender: "Male",
    department: "Construction & Site Operations",
    teamSection: "leadership",
    contact: { email: "info@nayaabengineering.com" },
    image: "/assets/team/neipl-0102.png",
    quote: "Precision in execution isn't just our goal—it's our standard. Every project we build reflects our uncompromised commitment to structural excellence.",
    bio: "Saajid Rashid leads Construction & Site Operations, bringing over a decade of hands-on leadership in structural execution, field safety compliance, and site team synchronization.",
    stats: [
      { label: "Experience", value: "12+ Yrs" },
      { label: "Projects Delivered", value: "150+" },
      { label: "Safety Record", value: "100%" },
    ],
    skills: [
      "Site Logistics",
      "Structural Execution",
      "Safety Auditing",
      "Resource Management",
      "Quality Assurance",
    ],
    projects: [
      "High-Rise Commercial Operations",
      "Industrial Park Substructure",
      "Residential Structural Retrofits",
    ],
  },
  {
    employeeId: "neipl-0103",
    name: "Er. Aaqib Nazir",
    designation: "Director",
    gender: "Male",
    department: "Engineering & Technical Operations",
    teamSection: "leadership",
    contact: { email: "info@nayaabengineering.com" },
    image: "/assets/team/neipl-0103.png",
    quote: "Engineering innovation is the bridge between ambitious design concepts and resilient, real-world infrastructure.",
    bio: "Aaqib Nazir heads Engineering & Technical Operations, driving structural dynamics analysis, MEP coordination, and BIM integration across complex engineering workflows.",
    stats: [
      { label: "Experience", value: "11+ Yrs" },
      { label: "Technical Audits", value: "200+" },
      { label: "BIM Integration", value: "100%" },
    ],
    skills: [
      "Structural Dynamics",
      "BIM Modeling",
      "MEP Oversight",
      "Finite Element Analysis",
      "Technical Compliance",
    ],
    projects: [
      "Seismic Retrofitting Phase II",
      "Smart Office Complex Infrastructure",
      "Bridge & Highway Feasibility Analysis",
    ],
  },
  {
    employeeId: "neipl-0104",
    name:  "Er. Junaid Bilal",
    designation: "Managing Director",
    gender: "Male",
    department: "Executive Leadership",
    teamSection: "leadership",
    contact: { email: "info@nayaabengineering.com" },
    image: "/assets/team/neipl-0104.png",
    quote: "Fostering operational agility and technological adoption empowers our team to deliver exceptional value on every assignment.",
    bio: "Junaid Bilal oversees executive business operations, major client partnerships, and company-wide digital transformation across all department verticals.",
    stats: [
      { label: "Experience", value: "14+ Yrs" },
      { label: "Client Retention", value: "98%" },
      { label: "Team Oversight", value: "50+ Pros" },
    ],
    skills: [
      "Executive Leadership",
      "Client Relations",
      "Operations Management",
      "Contract Negotiation",
      "Financial Strategy",
    ],
    projects: [
      "Corporate Headquarters Development",
      "Multi-Phase Commercial Estate",
      "Institutional Facility Expansion",
    ],
  },
  
  {
    employeeId: "neipl-0105",
    name: "Huma Gayas",
    designation: "Architect / Interior Designer",
    gender: "Female",
    department: "Architecture & Design",
    teamSection: "architecture",
    contact: { email: "info@nayaabengineering.com" },
    image: "/assets/team/neipl-0105.png",
    quote: "Architecture should resonate with its natural surroundings while elevating the daily human experience within every space.",
    bio: "Huma Gayas combines spatial aesthetics with modern functional design, specializing in luxury interior architecture and sustainable building spaces.",
    stats: [
      { label: "Experience", value: "7+ Yrs" },
      { label: "Design Concepts", value: "80+" },
      { label: "Client Rating", value: "4.9/5" },
    ],
    skills: [
      "Interior Architecture",
      "3D Visualization",
      "Spatial Optimization",
      "Sustainable Interiors",
      "Material Selection",
    ],
    projects: [
      "Luxury Villa Interior Renovation",
      "Tech Hub Workspace Concept",
      "Boutique Hospitality Suites",
    ],
  },
  {
    employeeId: "neipl-0106",
    name: "Sameera Hassan",
    designation: "Architectural Designer",
    gender: "Female",
    department: "Architecture & Design",
    teamSection: "architecture",
    contact: { email: "info@nayaabengineering.com" },
    image: "/assets/team/neipl-0106.jpeg",
    quote: "Every line in architectural modeling must strike an exact balance between structural efficiency and aesthetic elegance.",
    bio: "Sameera Hassan focuses on contemporary facade design, spatial planning, and high-fidelity rendering for urban residential and commercial developments.",
    stats: [
      { label: "Experience", value: "5+ Yrs" },
      { label: "Drafted Plans", value: "120+" },
      { label: "Facade Models", value: "35+" },
    ],
    skills: [
      "Architectural Drafting",
      "Facade Engineering",
      "Revit Architecture",
      "3D Exterior Rendering",
      "Urban Concepting",
    ],
    projects: [
      "Modern Villa Elevation",
      "Corporate Glass Facade System",
      "Community Center Masterplan",
    ],
  },
  {
    employeeId: "neipl-0107",
    name: "Birgees Anjum",
    designation: "CAD Designer",
    gender: "Female",
    department: "Engineering & Technical Operations",
    teamSection: "architecture",
    contact: { email: "info@nayaabengineering.com" },
    image: "/assets/team/neipl-0107.png",
    quote: "Millimeter precision in CAD modeling is the invisible backbone of flawless, error-free site construction.",
    bio: "Birgees Anjum produces comprehensive technical CAD schematics, structural drawings, and blueprint documentation across civil and engineering projects.",
    stats: [
      { label: "Experience", value: "6+ Yrs" },
      { label: "CAD Schematics", value: "300+" },
      { label: "Precision Rate", value: "99.9%" },
    ],
    skills: [
      "AutoCAD Drafting",
      "Structural Detailing",
      "Schematic Layouts",
      "BIM Drafting",
      "Technical Mapping",
    ],
    projects: [
      "Substation Structural Blueprint",
      "Multi-Story Framing Schematics",
      "MEP Layout Drawings",
    ],
  },
  {
    employeeId: "neipl-0120",
    name: "Tariq Ahmad Ganaie",
    designation: "Skilled Carpenter",
    gender: "Male",
    department: "Construction & Site Operations",
    teamSection: "construction",
    contact: { email: null },
    image: "/assets/team/neipl-0120.png",
    quote: "Craftsmanship lies in turning raw timber into enduring architectural components through disciplined skill.",
    bio: "Tariq Ahmad Ganaie manages structural timber framing, custom millwork, and wood formwork across major residential and commercial field projects.",
    stats: [
      { label: "Experience", value: "15+ Yrs" },
      { label: "Sites Completed", value: "90+" },
      { label: "Craft Level", value: "Master" },
    ],
    skills: [
      "Structural Timbering",
      "Custom Millwork",
      "Formwork Assembly",
      "Finishing Carpentry",
      "Site Framing",
    ],
    projects: [
      "Luxury Roof Truss Assembly",
      "Custom Interior Wood Features",
      "Commercial Concrete Formwork",
    ],
  },
  {
    employeeId: "neipl-0121",
    name: "Showkat Ahmad Khan",
    designation: "Skilled Mason",
    gender: "Male",
    department: "Construction & Site Operations",
    teamSection: "construction",
    contact: { email: null },
    image: "/assets/team/neipl-0121.png",
    quote: "Masonry is civil durability incarnate. Building right means engineering structures that last generations.",
    bio: "Showkat Ahmad Khan is a veteran mason overseeing heavy brickwork, stone cladding, and reinforced concrete masonry across complex ground sites.",
    stats: [
      { label: "Experience", value: "18+ Yrs" },
      { label: "Masonry Works", value: "110+" },
      { label: "Durability Rating", value: "100%" },
    ],
    skills: [
      "Reinforced Masonry",
      "Stone Cladding",
      "Foundation Laying",
      "Structural Concrete",
      "Quality Inspection",
    ],
    projects: [
      "Commercial Retaining Walls",
      "Stone Facade Cladding",
      "Structural Core Masonry",
    ],
  },
  {
    employeeId: "neipl-0122",
    name: "Abdul Qayoom War",
    designation: "Skilled Mason",
    gender: "Male",
    department: "Construction & Site Operations",
    teamSection: "construction",
    contact: { email: null },
    image: "/assets/team/neipl-0122.png",
    quote: "Level, plumb, and square—sticking to strict site geometry prevents future structural fatigue.",
    bio: "Abdul Qayoom War provides expert masonry and civil execution, ensuring high-tolerance concrete pours, blockwork, and foundational leveling.",
    stats: [
      { label: "Experience", value: "14+ Yrs" },
      { label: "Civil Sites", value: "85+" },
      { label: "Precision Grade", value: "Expert" },
    ],
    skills: [
      "Concrete Pouring",
      "Blockwork Assembly",
      "Site Layout Alignment",
      "Mortar Formulations",
      "Surface Finishing",
    ],
    projects: [
      "High-Capacity Reservoir Base",
      "Retaining Wall Infrastructure",
      "Industrial Slab Installation",
    ],
  },
  {
    employeeId: "neipl-0123",
    name: "Sajid Hussain",
    designation: "Electrician",
    gender: "Male",
    department: "Engineering & Technical Operations",
    teamSection: "construction",
    contact: { email: null },
    image: "/assets/team/neipl-0123.png",
    quote: "Flawless electrical wiring guarantees safety, reliability, and energy efficiency for every square foot.",
    bio: "Sajid Hussain handles site electrical infrastructure, panel installations, circuit diagnostics, and smart lighting setups for commercial facilities.",
    stats: [
      { label: "Experience", value: "8+ Yrs" },
      { label: "Electrical Audits", value: "140+" },
      { label: "Zero-Defect Rate", value: "100%" },
    ],
    skills: [
      "High-Voltage Wiring",
      "Distribution Panel Setup",
      "Smart Lighting Systems",
      "Circuit Diagnostics",
      "Electrical Safety",
    ],
    projects: [
      "Commercial HQ Electrical Setup",
      "Substation Panel Integration",
      "Smart Automation Wiring",
    ],
  },
];

// ----------------------------------------------------------------------------
// DERIVED LOOKUPS — computed once at module load, O(1) access everywhere else
// ----------------------------------------------------------------------------

const employeeIndexById = new Map(
  teamMembers.map((member, index) => [member.employeeId.toLowerCase(), index])
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