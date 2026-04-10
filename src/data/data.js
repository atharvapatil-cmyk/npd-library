// NPD Library â Core Data & Helpers
// Mosaic Wellness R&D Team

export const OPENAI_KEY = 'sk-proj-La3ShLvVPQyprwivMQ7T3BlbkFJplaceholderReplaceMe';

export const ROLE_META = {
  admin:      { label: 'Admin',             color: '#7c3aed', bg: '#f3e8ff', emoji: 'ð¡ï¸' },
  nutra_lead: { label: 'Nutra Lead',        color: '#ea580c', bg: '#fff7ed', emoji: 'ð§ª' },
  pc_lead:    { label: 'PC Lead',           color: '#0891b2', bg: '#ecfeff', emoji: 'ð§´' },
  reg_lead:   { label: 'Reg Lead',          color: '#16a34a', bg: '#f0fdf4', emoji: 'ð' },
  pmo:        { label: 'PMO',               color: '#ca8a04', bg: '#fefce8', emoji: 'ð' },
  rd_member:  { label: 'R&D Member',        color: '#6366f1', bg: '#eef2ff', emoji: 'ð¬' },
};

export const INITIAL_USERS = [
  { id: 'u1',  name: 'Arjun Mehta',      role: 'admin',      avatar: 'AM', email: 'arjun.m@mosaic.in' },
  { id: 'u2',  name: 'Priya Sharma',     role: 'nutra_lead', avatar: 'PS', email: 'priya.s@mosaic.in' },
  { id: 'u3',  name: 'Rahul Desai',      role: 'pc_lead',    avatar: 'RD', email: 'rahul.d@mosaic.in' },
  { id: 'u4',  name: 'Sneha Pillai',     role: 'reg_lead',   avatar: 'SP', email: 'sneha.p@mosaic.in' },
  { id: 'u5',  name: 'Vikram Joshi',     role: 'pmo',        avatar: 'VJ', email: 'vikram.j@mosaic.in' },
  { id: 'u6',  name: 'Deepa Nair',       role: 'rd_member',  avatar: 'DN', email: 'deepa.n@mosaic.in' },
  { id: 'u7',  name: 'Karan Verma',      role: 'rd_member',  avatar: 'KV', email: 'karan.v@mosaic.in' },
  { id: 'u8',  name: 'Meena Krishnan',   role: 'nutra_lead', avatar: 'MK', email: 'meena.k@mosaic.in' },
  { id: 'u9',  name: 'Rohan Agarwal',    role: 'pc_lead',    avatar: 'RA', email: 'rohan.a@mosaic.in' },
  { id: 'u10', name: 'Pooja Bhatt',      role: 'pmo',        avatar: 'PB', email: 'pooja.b@mosaic.in' },
];

// FOLDER_TREE: sections with sub-folders
// viewRoles: roles that can see files | editRoles: roles that can upload/delete
export const FOLDER_TREE = [
  {
    id: 's1', name: 'Nutraceuticals', emoji: 'ð§ª', color: '#ea580c',
    folders: [
      { id: 'f1',  name: 'Formulation Briefs',    viewRoles: ['admin','nutra_lead','rd_member','pmo'], editRoles: ['admin','nutra_lead'] },
      { id: 'f2',  name: 'Clinical Studies',       viewRoles: ['admin','nutra_lead','rd_member'],      editRoles: ['admin','nutra_lead'] },
      { id: 'f3',  name: 'Ingredient Specs',       viewRoles: ['admin','nutra_lead','rd_member'],      editRoles: ['admin','nutra_lead'] },
      { id: 'f4',  name: 'Stability Reports',      viewRoles: ['admin','nutra_lead','pmo'],            editRoles: ['admin','nutra_lead'] },
    ]
  },
  {
    id: 's2', name: 'Personal Care', emoji: 'ð§´', color: '#0891b2',
    folders: [
      { id: 'f5',  name: 'Product Concepts',       viewRoles: ['admin','pc_lead','rd_member','pmo'],   editRoles: ['admin','pc_lead'] },
      { id: 'f6',  name: 'Safety Assessments',     viewRoles: ['admin','pc_lead','reg_lead'],          editRoles: ['admin','pc_lead','reg_lead'] },
      { id: 'f7',  name: 'Claim Dossiers',         viewRoles: ['admin','pc_lead','reg_lead'],          editRoles: ['admin','pc_lead'] },
    ]
  },
  {
    id: 's3', name: 'Regulatory', emoji: 'ð', color: '#16a34a',
    folders: [
      { id: 'f8',  name: 'Compliance Checklists',  viewRoles: ['admin','reg_lead','pmo'],              editRoles: ['admin','reg_lead'] },
      { id: 'f9',  name: 'Market Approvals',       viewRoles: ['admin','reg_lead','pmo'],              editRoles: ['admin','reg_lead'] },
      { id: 'f10', name: 'Label Reviews',          viewRoles: ['admin','reg_lead','pc_lead'],          editRoles: ['admin','reg_lead'] },
    ]
  },
  {
    id: 's4', name: 'PMO / Project Mgmt', emoji: 'ð', color: '#ca8a04',
    folders: [
      { id: 'f11', name: 'Stage Gate Trackers',    viewRoles: ['admin','pmo','nutra_lead','pc_lead'],  editRoles: ['admin','pmo'] },
      { id: 'f12', name: 'Timelines & Milestones', viewRoles: ['admin','pmo'],                         editRoles: ['admin','pmo'] },
      { id: 'f13', name: 'Launch Checklists',      viewRoles: ['admin','pmo','reg_lead'],              editRoles: ['admin','pmo'] },
    ]
  },
  {
    id: 's5', name: 'R&D Lab', emoji: 'ð¬', color: '#6366f1',
    folders: [
      { id: 'f14', name: 'Trial Reports',          viewRoles: ['admin','rd_member','nutra_lead'],      editRoles: ['admin','rd_member'] },
      { id: 'f15', name: 'SOPs',                   viewRoles: ['admin','rd_member','nutra_lead','pc_lead'], editRoles: ['admin','rd_member'] },
      { id: 'f16', name: 'Raw Material COAs',      viewRoles: ['admin','rd_member','nutra_lead'],      editRoles: ['admin','rd_member'] },
    ]
  },
];

// All folders flat
const ALL_FOLDERS = FOLDER_TREE.flatMap(s => s.folders.map(f => ({ ...f, sectionId: s.id })));

export function getFolderById(id) {
  return ALL_FOLDERS.find(f => f.id === id) || null;
}

export function getParentSection(folderId) {
  return FOLDER_TREE.find(s => s.folders.some(f => f.id === folderId)) || null;
}

export function canView(role, folder) {
  if (!role || !folder) return false;
  return folder.viewRoles.includes(role);
}

export function canEdit(role, folder) {
  if (!role || !folder) return false;
  return folder.editRoles.includes(role);
}

export function fileTypeLabel(type) {
  const m = { pdf: 'PDF', xlsx: 'Excel', pptx: 'PPT', docx: 'Word', csv: 'CSV', img: 'Image' };
  return m[type] || type.toUpperCase();
}

export function fileTypeColor(type) {
  const m = { pdf: '#dc2626', xlsx: '#16a34a', pptx: '#ea580c', docx: '#2563eb', csv: '#0891b2', img: '#7c3aed' };
  return m[type] || '#6b7280';
}

export function fileTypeClass(type) {
  const m = { pdf: 'ð', xlsx: 'ð', pptx: 'ð', docx: 'ð', csv: 'ðï¸', img: 'ð¼ï¸' };
  return m[type] || 'ð';
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const INITIAL_FILES = [
  // Nutraceuticals
  { id: 'fil1',  name: 'Ashwagandha KSM-66 Formulation Brief v2.3',   type: 'pdf',  folderId: 'f1',  version: 'v2.3', desc: 'Full brief for stress-relief supplement with KSM-66 extract.', tags: ['ashwagandha','adaptogen','stress'], uploadedBy: 'u2', uploadedAt: '2026-03-12T09:30:00', starred: true,  size: '1.8 MB' },
  { id: 'fil2',  name: 'Omega-3 Clinical Study Summary',               type: 'docx', folderId: 'f2',  version: 'v1.0', desc: 'Summary of clinical endpoints for omega-3 cardiovascular claims.', tags: ['omega3','clinical','cardiovascular'], uploadedBy: 'u2', uploadedAt: '2026-03-18T11:00:00', starred: false, size: '2.4 MB' },
  { id: 'fil3',  name: 'Curcumin Bioavailability Enhancement Study',   type: 'pdf',  folderId: 'f2',  version: 'v1.2', desc: 'Research on piperine co-formulation improving curcumin absorption.', tags: ['curcumin','bioavailability','turmeric'], uploadedBy: 'u8', uploadedAt: '2026-03-20T14:00:00', starred: true,  size: '3.1 MB' },
  { id: 'fil4',  name: 'Probiotic Blend Ingredient Specs',             type: 'xlsx', folderId: 'f3',  version: 'v3.0', desc: 'Full COA and species breakdown for 10-strain probiotic blend.', tags: ['probiotic','gut','specs'], uploadedBy: 'u2', uploadedAt: '2026-02-28T10:00:00', starred: false, size: '0.9 MB' },
  { id: 'fil5',  name: 'Q1 Stability Report â Collagen Shots',        type: 'pdf',  folderId: 'f4',  version: 'v1.1', desc: 'Accelerated stability testing results for marine collagen shots.', tags: ['collagen','stability','q1'], uploadedBy: 'u8', uploadedAt: '2026-04-01T08:45:00', starred: false, size: '1.5 MB' },
  // Personal Care
  { id: 'fil6',  name: 'HairFall Defense Serum Concept Brief',         type: 'pptx', folderId: 'f5',  version: 'v1.0', desc: 'Product concept deck for hair fall serum targeting DHT.', tags: ['hairfall','serum','concept'], uploadedBy: 'u3', uploadedAt: '2026-03-05T13:20:00', starred: true,  size: '4.2 MB' },
  { id: 'fil7',  name: 'Face Wash Safety Assessment â Salicylic Acid', type: 'pdf',  folderId: 'f6',  version: 'v2.1', desc: 'ECHA safety dossier for 2% salicylic acid face wash formulation.', tags: ['facewash','salicylic','safety'], uploadedBy: 'u3', uploadedAt: '2026-03-22T10:30:00', starred: false, size: '2.2 MB' },
  { id: 'fil8',  name: 'Moisturiser Claim Dossier â Hyaluronic Acid',  type: 'docx', folderId: 'f7',  version: 'v1.3', desc: 'Supporting claims for 72-hour hydration moisturiser product.', tags: ['moisturiser','hyaluronic','claims'], uploadedBy: 'u9', uploadedAt: '2026-04-02T16:00:00', starred: true,  size: '1.6 MB' },
  { id: 'fil9',  name: 'SPF 50 Sunscreen Concept â Gen Z Line',       type: 'pptx', folderId: 'f5',  version: 'v1.0', desc: 'Concept presentation for SPF 50 sunscreen targeting Gen-Z segment.', tags: ['sunscreen','spf','genz'], uploadedBy: 'u3', uploadedAt: '2026-04-05T11:00:00', starred: false, size: '5.0 MB' },
  // Regulatory
  { id: 'fil10', name: 'FSSAI Compliance Checklist 2026',              type: 'xlsx', folderId: 'f8',  version: 'v4.0', desc: 'Updated checklist for FSSAI food supplement regulations 2026.', tags: ['fssai','compliance','2026'], uploadedBy: 'u4', uploadedAt: '2026-01-15T09:00:00', starred: true,  size: '0.7 MB' },
  { id: 'fil11', name: 'Cosmetics Market Approval â EU',               type: 'pdf',  folderId: 'f9',  version: 'v1.0', desc: 'EU CPNP notification documents for cosmetic product registration.', tags: ['eu','cpnp','cosmetics'], uploadedBy: 'u4', uploadedAt: '2026-02-20T14:30:00', starred: false, size: '3.4 MB' },
  { id: 'fil12', name: 'Label Review â Protein Bar SKU Matrix',        type: 'xlsx', folderId: 'f10', version: 'v2.2', desc: 'Final label review with nutrition claims for 8-SKU protein bar line.', tags: ['label','protein','sku'], uploadedBy: 'u4', uploadedAt: '2026-03-30T12:00:00', starred: false, size: '1.1 MB' },
  // PMO
  { id: 'fil13', name: 'Q2 NPD Stage Gate Tracker',                   type: 'xlsx', folderId: 'f11', version: 'v5.1', desc: 'Live stage gate tracker for all Q2 NPD projects across categories.', tags: ['stagegate','q2','tracker'], uploadedBy: 'u5', uploadedAt: '2026-04-08T08:00:00', starred: true,  size: '1.3 MB' },
  { id: 'fil14', name: 'FY26 NPD Master Timeline',                    type: 'xlsx', folderId: 'f12', version: 'v2.0', desc: 'Full-year product development timeline with milestones and owners.', tags: ['timeline','fy26','master'], uploadedBy: 'u5', uploadedAt: '2026-04-03T09:00:00', starred: false, size: '1.8 MB' },
  { id: 'fil15', name: 'ManFuel Protein Launch Checklist',             type: 'docx', folderId: 'f13', version: 'v1.4', desc: 'Pre-launch checklist covering regulatory, ops, and marketing tasks.', tags: ['launch','manfuel','protein'], uploadedBy: 'u10', uploadedAt: '2026-04-07T10:00:00', starred: true,  size: '0.6 MB' },
  // R&D Lab
  { id: 'fil16', name: 'Collagen Gummy Trial Report #7',               type: 'pdf',  folderId: 'f14', version: 'v1.0', desc: 'Lab trial report for collagen gummy formulation â texture optimization.', tags: ['collagen','gummy','trial'], uploadedBy: 'u6', uploadedAt: '2026-03-25T15:30:00', starred: false, size: '2.0 MB' },
  { id: 'fil17', name: 'Tablet Coating SOP â Standard Line',           type: 'pdf',  folderId: 'f15', version: 'v3.2', desc: 'Standard operating procedure for film coating on tablet line 2.', tags: ['sop','coating','tablet'], uploadedBy: 'u7', uploadedAt: '2026-03-10T11:00:00', starred: false, size: '1.2 MB' },
  { id: 'fil18', name: 'Zinc Picolinate COA â Batch ZP240',            type: 'pdf',  folderId: 'f16', version: 'v1.0', desc: 'Certificate of Analysis for Zinc Picolinate raw material batch.', tags: ['zinc','coa','rawmaterial'], uploadedBy: 'u6', uploadedAt: '2026-04-04T09:30:00', starred: true,  size: '0.4 MB' },
  { id: 'fil19', name: 'Biotin 10000mcg Softgel Trial Report',         type: 'docx', folderId: 'f14', version: 'v2.1', desc: 'Comparative trial for softgel vs. tablet biotin bioavailability.', tags: ['biotin','softgel','trial'], uploadedBy: 'u7', uploadedAt: '2026-04-06T14:00:00', starred: false, size: '1.7 MB' },
  { id: 'fil20', name: 'Encapsulation SOP â Liquid Fill Capsules',     type: 'pdf',  folderId: 'f15', version: 'v1.0', desc: 'SOP for liquid fill hard capsule manufacturing line.', tags: ['sop','encapsulation','liquidfill'], uploadedBy: 'u6', uploadedAt: '2026-04-09T08:30:00', starred: false, size: '0.9 MB' },
];

export const CHATBOT_SYSTEM_PROMPT = `You are the NPD Librarian for Mosaic Wellness â an expert AI assistant for the New Product Development (NPD) team's central document library.

Your role:
- Help team members find documents, formulations, compliance info, and project files
- Answer questions about NPD processes, regulatory requirements (FSSAI, EU CPNP, etc.), ingredients, and formulation best practices
- Guide users on document naming conventions, version control, and library structure
- Summarize what's available in the library and help prioritize review

Current library has sections: Nutraceuticals, Personal Care, Regulatory, PMO/Project Mgmt, R&D Lab
Total: 20 documents across 16 folders

Be concise, professional, and helpful. If asked about a specific document, explain you can only show what's in the visible library. Respond in 2-4 sentences unless a detailed answer is clearly needed.`;
