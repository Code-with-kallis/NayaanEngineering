// src/data/services.js

export const SERVICES_DATA = [
  {
    id: "architectural-design",
    slug: "architectural-design",
    title: "Architectural Design",
    shortDesc: "Custom 3D modeling, modern and traditional building layouts, and specialized Islamic architectural planning in Kashmir.",
    fullDesc: "Our architectural practice bridges classical Kashmiri heritage with modern technical design. We deliver complete 2D floor planning, 3D exterior visualization, elevation modeling, and custom layout drafting tailored to high-altitude terrain, sunlight orientation, and valley climate demands.",
    icon: "FaDraftingCompass",
    coverImage: "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/services/architectural-design.webp",
    imageAlt: "3D architectural floor plans, residential blueprints, and elevation modeling in Kashmir",
    seoTitle: "Architectural Design & 3D House Modeling Services in Kashmir | NEIPL",
    metaDescription: "Professional 2D floor planning, photorealistic 3D exterior elevation rendering, and traditional Kashmiri & Islamic architectural drafting by Nayaab Engineering.",
    keywords: ["architectural design Kashmir", "3D house elevation Baramulla", "floor plans Srinagar", "Islamic architecture Kashmir"],
    features: [
      "2D Floor Plans & Space Layouts",
      "3D Exterior & Interior Renders",
      "Vernacular & Islamic Architecture",
      "Site Topography & Elevations"
    ],
    specs: [
      { label: "Design Software", value: "AutoCAD, Revit, SketchUp, V-Ray" },
      { label: "Style Expertise", value: "Modern, Vernacular, Islamic" },
      { label: "Deliverables", value: "Complete 2D/3D Architectural Blueprints" }
    ],
    complianceInfo: {
      title: "Alpine Climate & Topographic Adaptation",
      subtitle: "Custom architectural planning optimized for heavy snowfall, thermal retention, and natural lighting.",
      list: [
        "Optimal roof pitch calculations for snow shed and weather protection.",
        "Passive solar orientation to maximize thermal comfort during winters.",
        "Harmonious integration of traditional woodwork aesthetics with modern structural frames."
      ]
    },
    workflow: [
      { step: "01", title: "Concept & Spatial Brief", desc: "Understanding space requirements, site orientation, and architectural style choices." },
      { step: "02", title: "2D Layout & Planning", desc: "Drafting optimized floor plans, room dimensions, and traffic flow layouts." },
      { step: "03", title: "3D Visualization", desc: "Generating photorealistic 3D exterior renders and material preview options." },
      { step: "04", title: "Working Drawings", desc: "Finalizing detailed architectural blueprints for construction site execution." }
    ]
  },
  {
    id: "structural-engineering",
    slug: "structural-engineering",
    title: "Structural Engineering",
    shortDesc: "Safe load calculations, seismic analysis, and BIS-compliant technical integrity verification across J&K.",
    fullDesc: "Engineering safety is the core foundation of every build. We perform comprehensive structural load analysis, design reinforced concrete (RCC) frames, steel trusses, and foundation systems specifically engineered to withstand seismic risk, heavy snow loads, and varied soil bearing capacities.",
    icon: "FaBuilding",
    coverImage: "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/services/structural-engineering.webp",
    imageAlt: "Seismic structural analysis, RCC frame design, and STAAD Pro modeling in Jammu and Kashmir",
    seoTitle: "Structural Engineering & Seismic Load Analysis in Kashmir | NEIPL",
    metaDescription: "Certified structural engineering, IS Code-compliant RCC rebar detailing, steel truss load calculations, and seismic Zone IV/V defense verification.",
    keywords: ["structural engineer Kashmir", "seismic design Zone V J&K", "RCC frame analysis Baramulla", "ETABS STAAD structural consultant"],
    features: [
      "Seismic Zone IV/V Calculations",
      "RCC & Foundation Structural Design",
      "Steel Roof Truss & Column Analysis",
      "BOQ & Material Cost Estimation"
    ],
    specs: [
      { label: "Codes Followed", value: "IS 456, IS 1893, IS 800" },
      { label: "Analysis Tools", value: "ETABS, STAAD.Pro" },
      { label: "Seismic Design", value: "Zone IV & Zone V High Risk" }
    ],
    complianceInfo: {
      title: "Seismic Resistance & IS Code Compliance",
      subtitle: "Engineered in strict accordance with Bureau of Indian Standards (BIS) for high seismic zone protection.",
      list: [
        "Ductile detailing of reinforced concrete structures as per IS 13920.",
        "Soil bearing capacity (SBC) evaluation for foundation depth optimization.",
        "Rigorous stress and deflection checks on multi-story frames and roof trusses."
      ]
    },
    workflow: [
      { step: "01", title: "Structural Audit & Load Assessment", desc: "Evaluating dead, live, snow, and seismic forces acting on the structure." },
      { step: "02", title: "Computerized Modeling", desc: "Simulating structural behavior using 3D finite element software." },
      { step: "03", title: "Rebar & Member Detailing", desc: "Preparing detailed beam, column, slab, and footing structural drawings." },
      { step: "04", title: "Site Verification", desc: "Conducting steel rebar placement inspections prior to concrete pouring." }
    ]
  },
  {
    id: "turnkey-construction",
    slug: "turnkey-construction",
    title: "Turnkey Construction",
    shortDesc: "End-to-end site execution, civil procurement, and project management for commercial spaces, villas, and guesthouses.",
    fullDesc: "From ground excavation to final key handover, our turnkey construction service manages site procurement, labor supervision, timeline scheduling, and quality assurance. We eliminate client coordination stress by handling all construction phases with disciplined site engineering.",
    icon: "FaHardHat",
    coverImage: "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/services/turnkey-construction.webp",
    imageAlt: "Turnkey building construction, civil engineering contractors, and site execution in Kashmir",
    seoTitle: "Turnkey Construction Contractors & Civil Execution in Kashmir | NEIPL",
    metaDescription: "Full-service EPC turnkey construction contractors in Baramulla & Srinagar. Professional site supervision, RCC masonry, MEP rough-ins, and milestone schedules.",
    keywords: ["turnkey construction Kashmir", "building contractor Baramulla", "civil construction Srinagar", "EPC contractor J&K"],
    features: [
      "End-to-End Site Management",
      "RCC Structure & Brick Masonry",
      "Complete MEP & Utility Rough-Ins",
      "Quality Audit & Key Handover"
    ],
    specs: [
      { label: "Execution Model", value: "Full EPC / Turnkey Handover" },
      { label: "Quality Audits", value: "Third-Party Concrete & Steel Testing" },
      { label: "Project SLAs", value: "Milestone-Based Execution Schedule" }
    ],
    complianceInfo: {
      title: "On-Site Quality Audits & Material Assurance",
      subtitle: "Rigorous quality control protocols enforced from foundation trenching to final coat painting.",
      list: [
        "Cube testing for concrete compressive strength at 7 and 28 days.",
        "Strict verification of cement grades, structural steel TMT bars, and masonry bricks.",
        "On-site safety protocols and zero-tolerance structural defect management."
      ]
    },
    workflow: [
      { step: "01", title: "Site Prep & Excavation", desc: "Clearing terrain, setting layout benchmarks, and trenching foundations." },
      { step: "02", title: "Superstructure Build", desc: "Constructing columns, beams, slabs, and exterior brick masonry walls." },
      { step: "03", title: "MEP & Finishing", desc: "Installing electrical conduits, plumbing, plastering, and weather coats." },
      { step: "04", title: "Snag List & Handover", desc: "Final quality walk-through, rectifying minor details, and official key handover." }
    ]
  },
  {
    id: "interior-modular-design",
    slug: "interior-modular-design",
    title: "Interior & Modular Design",
    shortDesc: "Custom luxury interior layouts, bespoke woodwork, and moisture-resistant modular kitchen and wardrobe solutions.",
    fullDesc: "Transforming indoor environments through functional elegance and fine craftsmanship. We design bespoke residential and commercial interiors, including space-saving modular kitchens, custom wardrobes, wall paneling, false ceilings, and ambient lighting concepts.",
    icon: "FaPalette",
    coverImage: "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/services/interior-modular-design.webp",
    imageAlt: "Modern interior design, modular kitchen cabinets, and luxury woodwork in Kashmir",
    seoTitle: "Modern Interior Design & Modular Kitchen Solutions in Kashmir | NEIPL",
    metaDescription: "Bespoke interior design, custom modular kitchens, BWP cabinetry, false ceilings, and ambient architectural lighting customized for Kashmir homes.",
    keywords: ["modular kitchen Kashmir", "interior designers Srinagar", "luxury interior design Baramulla", "custom wardrobes Kashmir"],
    features: [
      "Modular Kitchens & Wardrobes",
      "False Ceiling & Ambient Lighting",
      "Acoustic Wood & Wall Paneling",
      "3D Visuals & Material Palettes"
    ],
    specs: [
      { label: "Primary Materials", value: "HDMR, Boiling Water Proof (BWP) Ply" },
      { label: "Hardware Standards", value: "Soft-Close German & European Fittings" },
      { label: "Design Approach", value: "Ergonomic & Space-Optimized" }
    ],
    complianceInfo: {
      title: "Moisture Resistance & Material Durability",
      subtitle: "High-performance materials selected to resist valley humidity, temperature shifts, and everyday wear.",
      list: [
        "100% Boiling Water Proof (BWP) marine ply for kitchen wet zones.",
        "Anti-warp termite-treated substrates for long-lasting cabinetry and joinery.",
        "Ergonomic workflow layout design (Kitchen Work Triangle principles)."
      ]
    },
    workflow: [
      { step: "01", title: "Interior Layout & Theme", desc: "Selecting design style, color palettes, and functional zoning." },
      { step: "02", title: "3D Interior Modeling", desc: "Rendering realistic views of false ceilings, kitchens, and cabinetry." },
      { step: "03", title: "Precision Fabrication", desc: "Off-site factory manufacturing of modular cabinets and wood panels." },
      { step: "04", title: "On-Site Installation", desc: "Seamless assembly, hardware fitting, and final surface polishing." }
    ]
  },
  {
    id: "regulatory-approvals",
    slug: "regulatory-approvals",
    title: "Regulatory Approvals",
    shortDesc: "Certified civil engineering consultation and municipal building permission sanction file documentation.",
    fullDesc: "Navigating local municipal compliance and building permits can be time-consuming. We assist clients by preparing municipal sanction drawings, setback clearance reports, floor area ratio (FAR) calculations, and certified engineering documentation needed for municipal approval.",
    icon: "FaClipboardCheck",
    coverImage: "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/services/regulatory-approvals.webp",
    imageAlt: "Municipal building permission sanction drawings and civil approval dossiers in Jammu and Kashmir",
    seoTitle: "Municipal Building Permission & Sanction Plan Services in J&K | NEIPL",
    metaDescription: "Hassle-free municipal building clearance files, certified FAR calculations, setback reports, and municipal authority liaison across Jammu & Kashmir.",
    keywords: ["building permission Kashmir", "municipal sanction drawings Baramulla", "FAR setback clearance Srinagar", "certified civil engineer sanction"],
    features: [
      "Municipal Sanction Drawings",
      "FAR & Setback Bylaw Compliance",
      "Building Permission Dossiers",
      "Certified Structural Safety Sign-Offs"
    ],
    specs: [
      { label: "Authority Compliance", value: "Municipal Development Authorities" },
      { label: "Drawing Type", value: "Official Municipal Clearance File" },
      { label: "Technical Sign-off", value: "Registered Civil Engineer Certification" }
    ],
    complianceInfo: {
      title: "Setbacks, Zoning & Municipal Bylaw Verification",
      subtitle: "Ensuring your architectural plan strictly adheres to regional master plans and government development codes.",
      list: [
        "Accurate calculation of ground coverage and Floor Area Ratio (FAR).",
        "Clearance verification for road widening setbacks and drainage lines.",
        "Complete technical dossier preparation to minimize approval turnaround time."
      ]
    },
    workflow: [
      { step: "01", title: "Site Bylaw Verification", desc: "Checking permissible FAR, setbacks, and height limits for your specific location." },
      { step: "02", title: "Sanction Drawing Drafting", desc: "Creating standard municipal format architectural and site plan drawings." },
      { step: "03", title: "Dossier Compilation", desc: "Compiling structural stability certificates, ownership documents, and plans." },
      { step: "04", title: "Submission & Clearance", desc: "Liaising with technical municipal reviewers through to sanction approval." }
    ]
  }
];