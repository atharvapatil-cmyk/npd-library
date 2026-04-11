import { useState, useRef } from 'react';
import { FOLDER_TREE, canView, canEdit } from '../data/data.js';

const SAMPLE_STATS = [
  { label: 'Total Folders', value: '47', delta: '+3 this month', up: true, icon: 'F' },
  { label: 'Active Projects', value: '12', delta: '+2 new', up: true, icon: 'P' },
  { label: 'Team Members', value: '6', delta: 'All active', up: null, icon: 'T' },
  { label: 'Recent Uploads', value: '28', delta: 'Last 30 days', up: true, icon: 'U' },
];

function StatCard({ stat }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  return (
    <div
      ref={cardRef}
      className="stat-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="stat-card-icon">{stat.icon}</div>
      <div className="stat-card-value">{stat.value}</div>
      <div className="stat-card-label">{stat.label}</div>
      <div className={`stat-card-delta ${stat.up === null ? 'neutral' : 'up'}`}>
        {stat.up === true ? '+' : ''}{stat.delta}
      </div>
    </div>
  );
}

function SectionCard({ section, currentUser, accessMatrix, onNavigate }) {
  const cardRef = useRef(null);
  const isAdmin = currentUser.role === 'admin';

  const visibleFolders = section.folders.filter(f =>
    isAdmin || canView(currentUser.id, f.id, accessMatrix)
  );

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-3px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      className="section-card"
      style={{ '--section-color': section.color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate(section.id)}
    >
      <div className="section-card-top">
        <div className="section-card-dot" style={{ background: section.color }} />
        <div className="section-card-name">{section.name}</div>
        {section.owner && <div className="section-card-owner">{section.owner}</div>}
      </div>
      <div className="section-card-folders">
        {visibleFolders.slice(0, 4).map(f => (
          <div
            key={f.id}
            className="section-folder-chip"
            onClick={e => { e.stopPropagation(); onNavigate(section.id, f.id); }}
          >
            {f.name}
          </div>
        ))}
        {visibleFolders.length > 4 && (
          <div className="section-folder-chip more">+{visibleFolders.length - 4} more</div>
        )}
      </div>
      <div className="section-card-meta">
        {visibleFolders.length} folders accessible
      </div>
    </div>
  );
}

export default function Dashboard({ currentUser, accessMatrix, onNavigate, onUpload }) {
  const isAdmin = currentUser.role === 'admin';

  const visibleSections = FOLDER_TREE.filter(section =>
    isAdmin || section.folders.some(f => canView(currentUser.id, f.id, accessMatrix))
  );

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>
          Welcome back, <span className="accent">{currentUser.name.split(' ')[0]}</span>
        </h1>
        <p>NPD Team Central Document Library</p>
      </div>

      <div className="stat-cards">
        {SAMPLE_STATS.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      <div className="dashboard-section-header">
        <div className="dashboard-section-title">Your Sections</div>
        {(isAdmin || canEdit(currentUser.id, visibleSections[0]?.folders[0]?.id, accessMatrix)) && (
          <button className="btn btn-primary btn-sm" onClick={onUpload}>
            Upload File
          </button>
        )}
      </div>

      <div className="section-grid">
        {visibleSections.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            currentUser={currentUser}
            accessMatrix={accessMatrix}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
