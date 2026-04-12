// NPD Team Central Document Library
// Architecture based on R&D Design Space Architecture v2.7

export const ACCESS = { NONE: 0, VIEW: 1, EDIT: 2, ADMIN: 3 };
export const ACCESS_LABEL = ['No Access', 'View', 'Edit', 'Admin'];
export const ACCESS_COLOR = ['#374151', '#1d4ed8', '#b45309', '#15803d'];

export const FOLDER_TREE = [
  {
    id: 'nutraceuticals',
    name: 'Nutraceuticals',
    owner: 'Darshani',
    color: '#16a34a',
    light: '#4ade80',
    tag: 'NUTRA',
    folders: [
      {
        id: 'nutra-fd',
        name: 'Formulation & Development',
        desc: 'Formulation trials, product specs, development roadmaps',
        access: { admin: 3, nutra_lead: 3, pc_lead: 1, reg_lead: 1, pmo: 1, rd_member: 2 },
        files: [
          { id: 'f001', name: 'Ashwagandha Extract Formulation v3.pdf', type: 'pdf', size: '2.4 MB', modified: '2026-03-15', tags: ['ayurvedic', 'adaptogen'] },
          { id: 'f002', name: 'Omega-3 Softgel Development Notes.docx', type: 'docx', size: '890 KB', modified: '2026-03-28', tags: ['omega', 'softgel'] },
          { id: 'f003', name: 'Collagen Peptide Matrix Study.xlsx', type: 'xlsx', size: '1.1 MB', modified: '2026-04-01', tags: ['collagen', 'peptide'] },
        ]
      },
      {
        id: 'nutra-rs',
        name: 'Recipe & Specifications',
        desc: 'Master recipes, batch formulas, specification sheets',
        access: { admin: 3, nutra_lead: 3, pc_lead: 1, reg_lead: 1, pmo: 1, rd_member: 2 },
        files: [
          { id: 'f004', name: 'Master Recipe - Ashwagandha 500mg.pdf', type: 'pdf', size: '560 KB', modified: '2026-02-10', tags: ['master', 'recipe'] },
          { id: 'f005', name: 'Spec Sheet - Vitamin D3 2000IU.pdf', type: 'pdf', size: '340 KB', modified: '2026-03-05', tags: ['vitamin', 'spec'] },
        ]
      },
      {
        id: 'nutra-ing',
        name: 'Ingredients TDS/COA',
        desc: 'Technical data sheets and certificates of analysis for all ingredients',
        access: { admin: 3, nutra_lead: 3, pc_lead: 1, reg_lead: 2, pmo: 0, rd_member: 2 },
        files: [
          { id: 'f006', name: 'COA - Ashwagandha KSM-66 Lot#2024.pdf', type: 'pdf', size: '1.2 MB', modified: '2026-01-20', tags: ['coa', 'ksm66'] },
          { id: 'f007', name: 'TDS - Marine Collagen Supplier.pdf', type: 'pdf', size: '780 KB', modified: '2026-02-14', tags: ['tds', 'collagen'] },
        ]
      },
      {
        id: 'nutra-tr',
        name: 'Trial Records',
        desc: 'Lab trial documentation, batch records, observations',
        access: { admin: 3, nutra_lead: 3, pc_lead: 1, reg_lead: 1, pmo: 2, rd_member: 2 },
        files: [
          { id: 'f008', name: 'Trial Batch TB-2024-011 Record.pdf', type: 'pdf', size: '2.1 MB', modified: '2026-03-22', tags: ['trial', 'batch'] },
          { id: 'f009', name: 'Pilot Scale Trial Results Q1 2026.xlsx', type: 'xlsx', size: '1.5 MB', modified: '2026-04-02', tags: ['pilot', 'scale'] },
        ]
      },
    ]
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    owner: 'Kapil',
    color: '#2563eb',
    light: '#60a5fa',
    tag: 'PC',
    folders: [
      {
        id: 'pc-fd',
        name: 'Formulation & Development',
        desc: 'Skincare and personal care product formulations',
        access: { admin: 3, nutra_lead: 1, pc_lead: 3, reg_lead: 1, pmo: 1, rd_member: 2 },
        files: [
          { id: 'f010', name: 'Retinol Serum Formulation v2.pdf', type: 'pdf', size: '1.8 MB', modified: '2026-03-18', tags: ['retinol', 'serum'] },
          { id: 'f011', name: 'SPF 50 Sunscreen Development.docx', type: 'docx', size: '1.2 MB', modified: '2026-03-30', tags: ['spf', 'sunscreen'] },
        ]
      },
      {
        id: 'pc-rs',
        name: 'Recipe & Specifications',
        desc: 'Personal care master recipes and product specs',
        access: { admin: 3, nutra_lead: 1, pc_lead: 3, reg_lead: 1, pmo: 1, rd_member: 2 },
        files: [
          { id: 'f012', name: 'Moisturizer Master Recipe v4.pdf', type: 'pdf', size: '670 KB', modified: '2026-02-25', tags: ['moisturizer', 'recipe'] },
        ]
      },
      {
        id: 'pc-ing',
        name: 'Ingredients TDS/COA',
        desc: 'TDS/COA for personal care ingredients',
        access: { admin: 3, nutra_lead: 0, pc_lead: 3, reg_lead: 2, pmo: 0, rd_member: 2 },
        files: [
          { id: 'f013', name: 'COA - Hyaluronic Acid Grade A.pdf', type: 'pdf', size: '450 KB', modified: '2026-01-15', tags: ['hyaluronic', 'coa'] },
        ]
      },
      {
        id: 'pc-tr',
        name: 'Trial Records',
        desc: 'Personal care product trial documentation',
        access: { admin: 3, nutra_lead: 1, pc_lead: 3, reg_lead: 1, pmo: 2, rd_member: 2 },
        files: [
          { id: 'f014', name: 'Face Serum Trial TB-2026-003.pdf', type: 'pdf', size: '1.9 MB', modified: '2026-04-01', tags: ['trial', 'serum'] },
        ]
      },
    ]
  },
  {
    id: 'regulatory',
    name: 'Regulatory & Compliance',
    owner: 'Supriya',
    color: '#ca8a04',
    light: '#fbbf24',
    tag: 'REG',
    folders: [
      {
        id: 'reg-lf',
        name: 'Label Files (FSSAI/FDA/Ayush)',
        desc: 'Approved and draft label artwork files for all regulatory bodies',
        access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 3, pmo: 1, rd_member: 1 },
        files: [
          { id: 'f015', name: 'FSSAI Label - Ashwagandha Capsules.pdf', type: 'pdf', size: '2.2 MB', modified: '2026-03-10', tags: ['fssai', 'label'] },
          { id: 'f016', name: 'FDA Compliance Label - Omega 3.pdf', type: 'pdf', size: '1.8 MB', modified: '2026-03-12', tags: ['fda', 'label'] },
          { id: 'f017', name: 'Ayush Certificate - Chyawanprash.pdf', type: 'pdf', size: '890 KB', modified: '2026-02-28', tags: ['ayush', 'cert'] },
        ]
      },
      {
        id: 'reg-ra',
        name: 'Regulatory Approvals',
        desc: 'All regulatory approval documents and correspondence',
        access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 3, pmo: 1, rd_member: 0 },
        files: [
          { id: 'f018', name: 'FSSAI License FBO-2024-MH-0234.pdf', type: 'pdf', size: '1.1 MB', modified: '2026-01-08', tags: ['fssai', 'license'] },
        ]
      },
      {
        id: 'reg-cs',
        name: 'Claims Substantiation',
        desc: 'Scientific evidence and studies supporting product claims',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 3, pmo: 1, rd_member: 1 },
        files: [
          { id: 'f019', name: 'Ashwagandha Stress Reduction Claims Evidence.pdf', type: 'pdf', size: '3.4 MB', modified: '2026-03-20', tags: ['claims', 'evidence'] },
          { id: 'f020', name: 'Collagen Skin Health Clinical References.pdf', type: 'pdf', size: '2.7 MB', modified: '2026-03-25', tags: ['collagen', 'clinical'] },
        ]
      },
    ]
  },
  {
    id: 'testing',
    name: 'Testing & Records',
    owner: 'R&D Team',
    color: '#ea580c',
    light: '#fb923c',
    tag: 'TEST',
    folders: [
      {
        id: 'test-ltr',
        name: 'Lab Test Reports (vs. COA)',
        desc: 'Internal lab testing vs supplier certificate of analysis',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 3, pmo: 1, rd_member: 2 },
        files: [
          { id: 'f021', name: 'Lab Report - Ashwagandha vs COA Q1.pdf', type: 'pdf', size: '1.6 MB', modified: '2026-03-15', tags: ['lab', 'coa'] },
          { id: 'f022', name: 'Heavy Metal Panel - Batch TB-2026-001.pdf', type: 'pdf', size: '780 KB', modified: '2026-03-18', tags: ['heavy-metal', 'safety'] },
        ]
      },
      {
        id: 'test-ss',
        name: 'Stability Studies',
        desc: 'Accelerated and real-time stability study data',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 3, pmo: 1, rd_member: 2 },
        files: [
          { id: 'f023', name: 'Stability Study - Vitamin D3 12 Month.xlsx', type: 'xlsx', size: '2.3 MB', modified: '2026-03-30', tags: ['stability', 'vitd3'] },
        ]
      },
      {
        id: 'test-audit',
        name: 'CDMO & Vendor Audits',
        desc: 'Contract manufacturer and vendor qualification audits',
        access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 3, pmo: 2, rd_member: 1 },
        files: [
          { id: 'f024', name: 'CDMO Audit Report - Supplier X 2025.pdf', type: 'pdf', size: '4.1 MB', modified: '2026-02-10', tags: ['cdmo', 'audit'] },
        ]
      },
      {
        id: 'test-sop',
        name: 'R&D SOPs',
        desc: 'Standard Operating Procedures for R&D activities',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 2, pmo: 1, rd_member: 2 },
        files: [
          { id: 'f025', name: 'SOP-001 Lab Safety & Handling.pdf', type: 'pdf', size: '1.2 MB', modified: '2026-01-05', tags: ['sop', 'safety'] },
          { id: 'f026', name: 'SOP-012 Formulation Development Process.pdf', type: 'pdf', size: '2.0 MB', modified: '2026-01-20', tags: ['sop', 'formulation'] },
        ]
      },
      {
        id: 'test-pat',
        name: 'Patents',
        desc: 'Patent applications, grants, and IP documentation',
        access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 2, pmo: 1, rd_member: 0 },
        files: [
          { id: 'f027', name: 'Patent Application - Novel Delivery System.pdf', type: 'pdf', size: '5.2 MB', modified: '2026-03-08', tags: ['patent', 'ip'] },
        ]
      },
    ]
  },
  {
    id: 'projects',
    name: 'Projects (Active/Archive)',
    owner: 'Anish',
    color: '#6b7280',
    light: '#9ca3af',
    tag: 'PROJ',
    folders: [
      {
        id: 'proj-sku',
        name: 'By Product/SKU',
        desc: 'All project files organized by product SKU',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 2, pmo: 3, rd_member: 2 },
        files: [
          { id: 'f028', name: 'SKU-MW-001 Ashwagandha 60C Project Folder.pdf', type: 'pdf', size: '3.4 MB', modified: '2026-04-01', tags: ['sku', 'ashwagandha'] },
          { id: 'f029', name: 'SKU-MW-014 Retinol Serum 30ml Project.pdf', type: 'pdf', size: '2.8 MB', modified: '2026-03-28', tags: ['sku', 'retinol'] },
        ]
      },
      {
        id: 'proj-bt',
        name: 'Project Briefs & Timelines',
        desc: 'Project briefs, Gantt charts, and milestone tracking',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 1, pmo: 3, rd_member: 2 },
        files: [
          { id: 'f030', name: 'Project Brief - Q2 2026 Launches.pdf', type: 'pdf', size: '1.4 MB', modified: '2026-04-03', tags: ['brief', 'q2'] },
          { id: 'f031', name: 'NPD Timeline Master - 2026.xlsx', type: 'xlsx', size: '890 KB', modified: '2026-04-04', tags: ['timeline', 'npd'] },
        ]
      },
      {
        id: 'proj-dash',
        name: 'Dashboards (Anish)',
        desc: 'R&D performance dashboards and KPI reports',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 2, pmo: 3, rd_member: 2 },
        files: [
          { id: 'f032', name: 'R&D KPI Dashboard Q1 2026.xlsx', type: 'xlsx', size: '2.1 MB', modified: '2026-04-05', tags: ['kpi', 'dashboard'] },
          { id: 'f033', name: 'Pipeline Overview - April 2026.pdf', type: 'pdf', size: '1.7 MB', modified: '2026-04-07', tags: ['pipeline', 'overview'] },
        ]
      },
    ]
  },
  {
    id: 'pmo',
    name: 'PMO (Monday.com)',
    owner: 'Vaishnavi',
    color: '#1e1e1e',
    light: '#6b7280',
    tag: 'PMO',
    folders: [
      {
        id: 'pmo-main',
        name: 'Monday.com Exports',
        desc: 'Exported reports and data from Monday.com project management',
        access: { admin: 3, nutra_lead: 1, pc_lead: 1, reg_lead: 1, pmo: 3, rd_member: 1 },
        files: [
          { id: 'f034', name: 'Weekly Status Report - W14 2026.pdf', type: 'pdf', size: '560 KB', modified: '2026-04-07', tags: ['status', 'weekly'] },
          { id: 'f035', name: 'Sprint Board Export - April 2026.xlsx', type: 'xlsx', size: '780 KB', modified: '2026-04-08', tags: ['sprint', 'export'] },
        ]
      },
    ]
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    owner: 'R&D Team',
    color: '#7c3aed',
    light: '#a78bfa',
    tag: 'MISC',
    folders: [
      {
        id: 'misc-vr',
        name: 'Visit Reports',
        desc: 'Field visit reports, factory visits, supplier visits',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 2, pmo: 2, rd_member: 2 },
        files: [
          { id: 'f036', name: 'Factory Visit - CDMO Supplier March 2026.pdf', type: 'pdf', size: '2.8 MB', modified: '2026-03-25', tags: ['visit', 'factory'] },
        ]
      },
      {
        id: 'misc-ca',
        name: 'Consultants Advice',
        desc: 'Expert consultant reports and advisory documents',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 2, pmo: 1, rd_member: 1 },
        files: [
          { id: 'f037', name: 'Regulatory Consultant Advisory Q1 2026.pdf', type: 'pdf', size: '1.3 MB', modified: '2026-03-15', tags: ['consultant', 'regulatory'] },
        ]
      },
      {
        id: 'misc-br',
        name: 'Benchmarking Reports',
        desc: 'Competitive benchmarking and market analysis',
        access: { admin: 3, nutra_lead: 2, pc_lead: 2, reg_lead: 1, pmo: 2, rd_member: 1 },
        files: [
          { id: 'f038', name: 'Nutraceuticals Market Benchmark 2026.pdf', type: 'pdf', size: '4.5 MB', modified: '2026-03-20', tags: ['benchmark', 'market'] },
        ]
      },
      {
        id: 'misc-ts',
        name: 'Trade Secrets',
        desc: 'Confidential proprietary formulation data and IP',
        access: { admin: 3, nutra_lead: 0, pc_lead: 0, reg_lead: 0, pmo: 0, rd_member: 0 },
        files: [
          { id: 'f039', name: 'Proprietary Blend Formula - CLASSIFIED.pdf', type: 'pdf', size: '890 KB', modified: '2026-04-01', tags: ['classified', 'proprietary'] },
        ]
      },
    ]
  },
];

export const INITIAL_USERS = [
  { id: 'u1', name: 'Aditya Rane', email: 'aditya@mosaicwellness.in', role: 'admin', avatar: 'AR', title: 'IT Admin', dept: 'IT' },
  { id: 'u2', name: 'Darshani', email: 'darshani@mosaicwellness.in', role: 'nutra_lead', avatar: 'DA', title: 'Nutraceuticals Lead', dept: 'R&D' },
  { id: 'u3', name: 'Kapil', email: 'kapil@mosaicwellness.in', role: 'pc_lead', avatar: 'KA', title: 'Personal Care Lead', dept: 'R&D' },
  { id: 'u4', name: 'Supriya', email: 'supriya@mosaicwellness.in', role: 'reg_lead', avatar: 'SU', title: 'Regulatory Lead', dept: 'Compliance' },
  { id: 'u5', name: 'Vaishnavi', email: 'vaishnavi@mosaicwellness.in', role: 'pmo', avatar: 'VA', title: 'PMO Manager', dept: 'PMO' },
  { id: 'u6', name: 'Anish', email: 'anish@mosaicwellness.in', role: 'rd_member', avatar: 'AN', title: 'R&D Analyst', dept: 'R&D' },
];

export function buildDefaultMatrix(users) {
  const m = {};
  users.forEach(u => {
    m[u.id] = {};
    FOLDER_TREE.forEach(section => {
      section.folders.forEach(folder => {
        m[u.id][folder.id] = folder.access[u.role] ?? ACCESS.NONE;
      });
    });
  });
  return m;
}

export function canAccess(userId, folderId, matrix, level = ACCESS.VIEW) {
  return (matrix?.[userId]?.[folderId] ?? 0) >= level;
}

export function canView(userId, folderId, matrix) {
  return canAccess(userId, folderId, matrix, ACCESS.VIEW);
}

export function canEdit(userId, folderId, matrix) {
  return canAccess(userId, folderId, matrix, ACCESS.EDIT);
}

export function getUserSections(userId, matrix) {
  return FOLDER_TREE.filter(section =>
    section.folders.some(folder => canView(userId, folder.id, matrix))
  );
}

export const FILE_TYPE_CONFIG = {
  pdf:  { label: 'PDF',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  docx: { label: 'DOC',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  xlsx: { label: 'XLSX',  color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  pptx: { label: 'PPT',   color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  png:  { label: 'IMG',   color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  jpg:  { label: 'IMG',   color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  other:{ label: 'FILE',  color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
};

export function getFileType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return FILE_TYPE_CONFIG[ext] || FILE_TYPE_CONFIG.other;
}


// Aliases for backward-compatible imports
export const USERS = INITIAL_USERS;
export function getAccessMatrix() { return buildDefaultMatrix(INITIAL_USERS); }
