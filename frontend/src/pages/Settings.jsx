import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import { updateConfig, updateSectionOrder, updateProfile, updateSectionConfig, uploadMediaFile, createSection, deleteSection } from '../api/portfolio';
import { enhanceText } from '../api/ai';
import Home from './Home';

const TABS = [
  { key: 'theme', label: 'Theme Settings', icon: 'palette' },
  { key: 'profile', label: 'Profile Details', icon: 'person' },
  { key: 'sections', label: 'Section Architect', icon: 'layers' },
];

export default function Settings() {
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem('kenneth-auth') === 'true');
  const [activeTab, setActiveTab] = useState('theme');
  const { profile, sections, refreshData } = usePortfolio();

  // Local draft states for Live Site preview
  const [draftProfile, setDraftProfile] = useState(null);
  const [draftSections, setDraftSections] = useState([]);

  useEffect(() => {
    if (profile) {
      setDraftProfile({ ...profile });
    }
  }, [profile]);

  useEffect(() => {
    if (sections && sections.length > 0) {
      setDraftSections(JSON.parse(JSON.stringify(sections))); // deep clone
    }
  }, [sections]);

  // Synchronize dynamic updates to context/live site
  const handleProfileFieldChange = (key, value) => {
    setDraftProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSectionsChange = (newSections) => {
    setDraftSections(newSections);
  };

  if (!isAuthorized) {
    return <LoginGate onSuccess={() => setIsAuthorized(true)} />;
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem var(--section-gap) 1rem' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Top Section - Header & Tabs */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="text-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '0.25rem' }}>Portfolio Customizer</h1>
            <p className="text-body-md text-muted">Fine-tune your presentation layout and edit section content block by block.</p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '0.75rem' }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`filter-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem 1rem' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Middle Section - Controls Panel */}
        {draftProfile && draftSections.length > 0 && (
          <div style={{ width: '100%', minHeight: '300px' }}>
            {activeTab === 'theme' && <ThemePanel />}
            {activeTab === 'profile' && (
              <ProfilePanel
                draftProfile={draftProfile}
                onFieldChange={handleProfileFieldChange}
                onSave={refreshData}
              />
            )}
            {activeTab === 'sections' && (
              <SectionsPanel
                draftSections={draftSections}
                onSectionsChange={handleSectionsChange}
                onSave={refreshData}
              />
            )}
          </div>
        )}

        {/* Bottom Section - Live Site Preview (Very Small Box Down/Below) */}
        <div style={{
          width: '100%',
          background: 'var(--surface-container-low)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--outline-variant)',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>devices</span>
              <span style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Site</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--outline)' }} className="text-code">Real-time Draft Preview</span>
          </div>

          {/* Compact Browser Mockup Frame */}
          <div style={{
            background: 'var(--background)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--outline-variant)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '420px', // Smaller box below editor controls
          }}>
            {/* Browser Header Bar */}
            <div style={{
              background: 'var(--surface-container)',
              borderBottom: '1px solid var(--outline-variant)',
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
              </div>
              <div style={{
                flex: 1,
                background: 'var(--background)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                textAlign: 'center',
                padding: '0.15rem 0',
                color: 'var(--outline)',
                fontFamily: 'var(--font-code)',
                border: '1px solid var(--outline-variant)',
              }}>
                localhost:3000
              </div>
            </div>

            {/* Render Home inside the frame */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {draftProfile && draftSections.length > 0 ? (
                <Home
                  isPreview={true}
                  profileOverride={draftProfile}
                  sectionsOverride={draftSections}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p className="text-muted">Loading preview...</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

// Inline AI Enhancer Sub-component

function AIEnhanceButton({ value, onApply }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleEnhance = async () => {
    if (!value?.trim()) return;
    setLoading(true);
    setSuggestion('');
    try {
      const res = await enhanceText(value);
      setSuggestion(res.data.enhanced);
    } catch (e) {
      console.error(e);
      setSuggestion('Error: Could not enhance text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleEnhance}
        disabled={loading}
        style={{ padding: '0.25rem 0.75rem', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>auto_awesome</span>
        {loading ? 'Enhancing...' : 'AI Enhance'}
      </button>

      {loading && (
        <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite', borderLeft: '3px solid var(--outline-variant)' }}>
          <div style={{ width: '100%', height: '12px', background: 'var(--outline-variant)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }} />
          <div style={{ width: '80%', height: '12px', background: 'var(--outline-variant)', borderRadius: 'var(--radius-sm)' }} />
        </div>
      )}

      {suggestion && !loading && (
        <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(0, 109, 75, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 109, 75, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '13.5px', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>"{suggestion}"</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onApply(suggestion);
              setSuggestion('');
            }}
            style={{ padding: '0.2rem 0.6rem', fontSize: '12px', alignSelf: 'flex-start' }}
          >
            Tap to Apply
          </button>
        </div>
      )}
    </div>
  );
}

// 1. Theme Configuration Panel

function ThemePanel() {
  const { primaryColor, setPrimaryColor, glassmorphism, setGlassmorphism, animatedBg, setAnimatedBg } = useTheme();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Theme Palette */}
      <div className="glass-card-static" style={{ padding: 'var(--stack-lg)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span className="material-symbols-outlined text-primary">brush</span>
          <h2 className="text-headline-md" style={{ color: 'var(--on-surface)' }}>Theme Palette</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--on-surface)', marginBottom: '0.5rem' }}>Primary Accent Color</p>
            <div className="color-picker-wrapper">
              <input type="color" className="color-picker-input" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
              <div style={{
                flex: 1, background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)',
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--font-code)',
                fontSize: '14px', color: 'var(--on-surface-variant)',
              }}>
                {primaryColor.toUpperCase()}
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--on-surface)', marginBottom: '0.5rem' }}>Quick Presets</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
              {['#494BD6', '#4f46e5', '#7c3aed', '#059669', '#dc2626', '#ea580c'].map(c => (
                <button key={c} onClick={() => setPrimaryColor(c)} style={{
                  height: '36px', borderRadius: 'var(--radius-md)', background: c,
                  border: primaryColor === c ? '3px solid var(--on-surface)' : '1px solid var(--outline-variant)',
                  cursor: 'pointer', transition: 'transform 0.15s',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="glass-card-static" style={{ padding: 'var(--stack-lg)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
          <h2 className="text-headline-md" style={{ color: 'var(--on-surface)' }}>Visual Effects</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <ToggleRow
            label="Enable Glassmorphism"
            description="Apply translucent blur effects to UI containers."
            checked={glassmorphism}
            onChange={() => setGlassmorphism(!glassmorphism)}
          />
          <ToggleRow
            label="Animated Background"
            description="Render a subtle shader mesh behind content."
            checked={animatedBg}
            onChange={() => setAnimatedBg(!animatedBg)}
          />
        </div>
      </div>
    </div>
  );
}

// 2. Profile Details Panel

function ProfilePanel({ draftProfile, onFieldChange, onSave }) {
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      onFieldChange('profile_picture', objectUrl);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const uploadData = { ...draftProfile };
      if (selectedFile) {
        uploadData.profile_picture = selectedFile;
      } else if (typeof uploadData.profile_picture === 'string' && uploadData.profile_picture.startsWith('blob:')) {
        delete uploadData.profile_picture;
      }
      await updateProfile(draftProfile.id, uploadData);
      alert('Profile saved successfully!');
      onSave();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="glass-card-static" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span className="material-symbols-outlined text-primary">person</span>
        <h2 className="text-headline-md" style={{ color: 'var(--on-surface)' }}>Profile Settings</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <ToggleRow
          label="Show Profile Picture"
          description="Display avatar monogram or professional photo in hero."
          checked={draftProfile.show_profile_picture}
          onChange={() => onFieldChange('show_profile_picture', !draftProfile.show_profile_picture)}
        />

        {draftProfile.show_profile_picture && (
          <div style={{ padding: '1rem', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--outline-variant)' }}>
            <p className="text-muted" style={{ fontSize: '13.5px', marginBottom: '0.5rem' }}>Select file to upload headshot:</p>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '13px' }} />
          </div>
        )}

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Name</label>
          <input
            type="text"
            className="input-field"
            value={draftProfile.name || ''}
            onChange={e => onFieldChange('name', e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
            required
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Title</label>
          <input
            type="text"
            className="input-field"
            value={draftProfile.title || ''}
            onChange={e => onFieldChange('title', e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
            required
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Subtitle / Bio</label>
          <textarea
            className="input-field"
            value={draftProfile.subtitle || ''}
            onChange={e => onFieldChange('subtitle', e.target.value)}
            style={{ width: '100%', minHeight: '80px', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', resize: 'vertical' }}
            required
          />
          <AIEnhanceButton value={draftProfile.subtitle} onApply={(val) => onFieldChange('subtitle', val)} />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Email</label>
          <input
            type="email"
            className="input-field"
            value={draftProfile.email || ''}
            onChange={e => onFieldChange('email', e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
            required
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Location</label>
          <input
            type="text"
            className="input-field"
            value={draftProfile.location || ''}
            onChange={e => onFieldChange('location', e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>GitHub URL</label>
          <input
            type="url"
            className="input-field"
            value={draftProfile.github_url || ''}
            onChange={e => onFieldChange('github_url', e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>LinkedIn URL</label>
          <input
            type="url"
            className="input-field"
            value={draftProfile.linkedin_url || ''}
            onChange={e => onFieldChange('linkedin_url', e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={saving}
        style={{ marginTop: '1.5rem', width: '100%' }}
      >
        {saving ? 'Saving Profile...' : 'Save Profile Settings'}
      </button>
    </form>
  );
}

// 3. Section Architecture & Reordering (Drag and drop reordering)

function SectionsPanel({ draftSections, onSectionsChange, onSave }) {
  const [editingSection, setEditingSection] = useState(null);
  const [draggingKey, setDraggingKey] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      await updateSectionOrder(draftSections.map(s => ({ key: s.key, is_visible: s.is_visible })));
      alert('Section architecture updated successfully!');
      onSave();
    } catch (err) {
      console.error(err);
      alert('Failed to update section architecture.');
    } finally {
      setApplying(false);
    }
  };

  // Drag and drop event handlers
  const handleDragStart = (e, key) => {
    setDraggingKey(key);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', key);
  };

  const handleDragOver = (e, key) => {
    e.preventDefault();
    if (draggingKey !== key) {
      setDragOverKey(key);
    }
  };

  const handleDragLeave = () => {
    setDragOverKey(null);
  };

  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    if (sourceKey === targetKey) return;

    const fromIdx = draftSections.findIndex(s => s.key === sourceKey);
    const toIdx = draftSections.findIndex(s => s.key === targetKey);

    const reordered = [...draftSections];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Update order indices
    const updated = reordered.map((sec, idx) => ({ ...sec, order: idx }));
    onSectionsChange(updated);

    setDraggingKey(null);
    setDragOverKey(null);
  };

  const toggleVisibility = (key) => {
    const updated = draftSections.map(s =>
      s.key === key && !s.is_mandatory ? { ...s, is_visible: !s.is_visible } : s
    );
    onSectionsChange(updated);
  };

  // Add new custom section
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');
  const [addingSection, setAddingSection] = useState(false);

  const handleAddSection = async () => {
    if (!newSectionLabel.trim()) return;
    setAddingSection(true);
    try {
      const key = newSectionLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      const newSection = {
        key,
        label: newSectionLabel.trim(),
        description: newSectionDesc.trim() || `Custom section: ${newSectionLabel.trim()}`,
        is_visible: true,
        is_mandatory: false,
        order: draftSections.length,
        icon: 'widgets',
        content: [],
      };
      const res = await createSection(newSection);
      const updatedSections = [...draftSections, res.data];
      onSectionsChange(updatedSections);
      setNewSectionLabel('');
      setNewSectionDesc('');
      setShowAddSection(false);
      onSave();
    } catch (err) {
      console.error(err);
      alert('Failed to create section. Key may already exist.');
    } finally {
      setAddingSection(false);
    }
  };

  const handleDeleteSection = async (section) => {
    const builtInKeys = ['hero', 'stats', 'expertise', 'process', 'projects', 'experience', 'education', 'certifications', 'achievements', 'cta'];
    const isBuiltInSection = builtInKeys.includes(section.key);
    const confirmMsg = isBuiltInSection
      ? `Delete built-in section "${section.label}"? This will remove it from the site. You can re-add it later.`
      : `Delete section "${section.label}"? This cannot be undone.`;
    if (!confirm(confirmMsg)) return;
    try {
      await deleteSection(section.id);
      const updatedSections = draftSections.filter(s => s.key !== section.key);
      onSectionsChange(updatedSections);
      onSave();
    } catch (err) {
      console.error(err);
      alert('Failed to delete section.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      {editingSection ? (
        <BlockEditorPanel
          section={editingSection}
          onClose={() => {
            setEditingSection(null);
            onSave();
          }}
          onUpdateSection={(updatedSec) => {
            const nextSections = draftSections.map(s => s.key === updatedSec.key ? updatedSec : s);
            onSectionsChange(nextSections);
            setEditingSection(updatedSec);
          }}
        />
      ) : (
        <div className="glass-card-static" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>drag_indicator</span>
              <h2 className="text-headline-md" style={{ color: 'var(--on-surface)' }}>Section Architecture</h2>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--outline)', fontWeight: 500 }}>Drag items to reorder sections</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {draftSections.map((section, idx) => {
              const isOver = dragOverKey === section.key;
              const isDragging = draggingKey === section.key;

              return (
                <div
                  key={section.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section.key)}
                  onDragOver={(e) => handleDragOver(e, section.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.key)}
                  className="drag-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    cursor: 'grab',
                    opacity: isDragging ? 0.4 : 1,
                    border: isOver ? '2px dashed var(--primary)' : '1px solid var(--outline-variant)',
                    transform: isOver ? 'scale(1.02)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--outline)', userSelect: 'none', flexShrink: 0 }}>drag_handle</span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '14.5px', margin: 0 }}>{section.label}</p>
                      <p className="text-muted" style={{ fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{section.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditingSection(section)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit_document</span>
                      <span className="section-btn-label">Customize</span>
                    </button>

                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => toggleVisibility(section.key)}
                      style={{ padding: '4px' }}
                    >
                      <span className="material-symbols-outlined" style={{ color: section.is_visible ? 'var(--primary)' : 'var(--outline-variant)' }}>
                        {section.is_visible ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>

                    {/* Delete button for all sections */}
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => handleDeleteSection(section)}
                      style={{ padding: '4px' }}
                    >
                      <span className="material-symbols-outlined" style={{ color: 'var(--error)', fontSize: '18px' }}>delete_outline</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Section Button & Inline Form */}
          <div style={{ marginTop: '1rem' }}>
            {showAddSection ? (
              <div style={{
                padding: '1.25rem',
                background: 'var(--surface-container-low)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--on-surface)', margin: 0 }}>Create New Section</p>
                <input
                  type="text"
                  value={newSectionLabel}
                  onChange={(e) => setNewSectionLabel(e.target.value)}
                  placeholder="Section name (e.g. Professional Summary)"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', fontSize: '14px' }}
                />
                <input
                  type="text"
                  value={newSectionDesc}
                  onChange={(e) => setNewSectionDesc(e.target.value)}
                  placeholder="Short description (optional)"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', fontSize: '13px' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowAddSection(false); setNewSectionLabel(''); setNewSectionDesc(''); }} style={{ padding: '0.35rem 1rem', fontSize: '13px' }}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleAddSection} disabled={addingSection || !newSectionLabel.trim()} style={{ padding: '0.35rem 1rem', fontSize: '13px' }}>
                    {addingSection ? 'Creating...' : 'Create Section'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddSection(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '2px dashed var(--outline-variant)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: 'var(--on-surface-variant)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all var(--transition-apple)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--on-surface-variant)'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle_outline</span>
                Add Section
              </button>
            )}
          </div>

          {/* Apply Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--outline-variant)', paddingTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApply}
              disabled={applying}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', fontSize: '14px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
              {applying ? 'Applying Changes...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Dynamic Blocks Editor (Dropdown selector + custom components builder)

function BlockEditorPanel({ section, onClose, onUpdateSection }) {
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState(section.content || []);

  const handleSaveBlocks = async () => {
    setSaving(true);
    try {
      const res = await updateSectionConfig(section.id, { content: blocks });
      onUpdateSection(res.data);
      alert('Section content saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save blocks.');
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type) => {
    const id = `block_${Date.now()}`;
    const newBlock = { id, type };
    
    if (type === 'paragraph') {
      newBlock.text = '';
    } else if (type === 'card' || type === 'card_no_media') {
      newBlock.title = '';
      newBlock.text = '';
      newBlock.linkUrl = '';
      if (type === 'card') newBlock.imageUrl = '';
    } else if (type === 'media') {
      newBlock.imageUrl = '';
    } else if (type === 'grid_card') {
      newBlock.title = '';
      newBlock.text = '';
      newBlock.gridSpan = '1';
    } else if (type === 'timeline_card') {
      newBlock.date = '';
      newBlock.title = '';
      newBlock.subtitle = '';
      newBlock.text = '';
    } else if (type === 'quote_card') {
      newBlock.text = '';
      newBlock.author = '';
    } else if (type === 'code_block') {
      newBlock.language = 'javascript';
      newBlock.code = '';
    } else if (type === 'contact_form') {
      newBlock.title = 'Get In Touch';
      newBlock.emailPlaceholder = 'your.email@example.com';
      newBlock.messagePlaceholder = 'Hi Jason, let\'s collaborate...';
      newBlock.buttonText = 'Send Message';
    } else if (type === 'skill_progress') {
      newBlock.skillName = 'Backend Engineering';
      newBlock.percentageValue = '90';
    } else if (type === 'skill_badge_cloud') {
      newBlock.badgeList = 'Python, Django, React, PostgreSQL, Docker, Git';
    } else if (type === 'social_grid') {
      newBlock.github = '';
      newBlock.linkedin = '';
      newBlock.twitter = '';
      newBlock.email = '';
    } else if (type === 'faq_accordion') {
      newBlock.question = 'What is your typical stack?';
      newBlock.answer = 'I primarily build scalable backend services with Python, Django, PostgreSQL, and FastAPI.';
    } else if (type === 'stat_counter') {
      newBlock.metricValue = '500+';
      newBlock.metricLabel = 'LeetCode Solved';
      newBlock.description = 'Consistent practice in algorithmic problem solving.';
    } else if (type === 'youtube_embed') {
      newBlock.videoUrlOrId = 'dQw4w9WgXcQ';
    } else if (type === 'github_repo') {
      newBlock.repoName = 'jasonkennethn/RailTrace';
      newBlock.repoDesc = 'Railway operations and tracking dashboard with real-time stats.';
      newBlock.starsCount = '12';
      newBlock.language = 'Python';
    } else if (type === 'resume_embed') {
      newBlock.resumeUrl = '#';
      newBlock.buttonText = 'Download Resume';
    } else if (type === 'pricing_card') {
      newBlock.planName = 'Freelance Consultation';
      newBlock.priceText = '$80';
      newBlock.billingCycle = 'per hour';
      newBlock.featuresList = 'Architecture planning, Code reviews, Database migrations, FastAPI services';
      newBlock.buttonText = 'Hire Me';
    } else if (type === 'alert_banner') {
      newBlock.alertType = 'info';
      newBlock.text = 'Currently open to junior backend roles or internships in Bengaluru or remote.';
    } else if (type === 'tech_stack_grid') {
      newBlock.items = 'Python, Django, FastAPI, PostgreSQL, AWS, React';
    }
    
    const nextBlocks = [...blocks, newBlock];
    setBlocks(nextBlocks);
    onUpdateSection({ ...section, content: nextBlocks });
  };

  const handleBlockChange = (index, field, value) => {
    const nextBlocks = blocks.map((b, idx) => idx === index ? { ...b, [field]: value } : b);
    setBlocks(nextBlocks);
    onUpdateSection({ ...section, content: nextBlocks });
  };

  const moveBlock = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const nextBlocks = [...blocks];
    const [moved] = nextBlocks.splice(index, 1);
    nextBlocks.splice(targetIdx, 0, moved);
    setBlocks(nextBlocks);
    onUpdateSection({ ...section, content: nextBlocks });
  };

  const deleteBlock = (index) => {
    const nextBlocks = blocks.filter((_, idx) => idx !== index);
    setBlocks(nextBlocks);
    onUpdateSection({ ...section, content: nextBlocks });
  };

  const handleBlockImageUpload = async (index, file) => {
    if (!file) return;
    try {
      const res = await uploadMediaFile(file);
      handleBlockChange(index, 'imageUrl', res.data.url);
    } catch (err) {
      console.error(err);
      alert('Image upload failed.');
    }
  };

  return (
    <div className="glass-card-static" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" className="btn-ghost" onClick={onClose} style={{ padding: '4px' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', fontSize: '18px' }}>
            Content: {section.label}
          </h2>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveBlocks}
          disabled={saving}
          style={{ padding: '0.4rem 1rem', fontSize: '13px' }}
        >
          {saving ? 'Saving...' : 'Apply Changes'}
        </button>
      </div>

      {/* Info banner showing existing content block count */}
      {blocks.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1rem', marginBottom: '1rem',
          background: 'rgba(73, 75, 214, 0.06)', border: '1px solid rgba(73, 75, 214, 0.15)',
          borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--on-surface-variant)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>info</span>
          <span><strong>{blocks.length}</strong> content block{blocks.length !== 1 ? 's' : ''} in this section. Edit or delete below, then click <strong>Apply Changes</strong>.</span>
        </div>
      )}
      {blocks.length === 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1rem', marginBottom: '1rem',
          background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--outline)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>inbox</span>
          <span>No custom content blocks yet. Use the dropdown below to add components.</span>
        </div>
      )}

      {/* Styled drop-down selectors to add new dynamic content items */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        background: 'var(--surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--outline-variant)', marginBottom: '1.5rem',
      }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--outline)' }}>Add Section Content Component:</label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              addBlock(e.target.value);
              e.target.value = ''; // Reset dropdown after selection
            }
          }}
          defaultValue=""
          style={{
            width: '100%', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)',
            color: 'var(--on-surface-variant)', fontFamily: 'var(--font-display)', fontSize: '14px',
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="" disabled>Select content component type...</option>
          <option value="paragraph">+ Paragraph Text</option>
          <option value="card">+ Card (with Image)</option>
          <option value="card_no_media">+ Card (no Image)</option>
          <option value="media">+ Media (Image)</option>
          <option value="grid_card">+ Highlight Card (Grid Layout)</option>
          <option value="timeline_card">+ Timeline Entry Card</option>
          <option value="quote_card">+ Developer Quote Block</option>
          <option value="code_block">+ Custom Code Block</option>
          <option value="contact_form">+ Interactive Contact Form</option>
          <option value="skill_progress">+ Technical Progress Bar</option>
          <option value="skill_badge_cloud">+ Skills Badge Cloud</option>
          <option value="social_grid">+ Branded Social Network Grid</option>
          <option value="faq_accordion">+ Collapsible FAQ Details</option>
          <option value="stat_counter">+ High-Impact Stat Metric Card</option>
          <option value="youtube_embed">+ Responsive YouTube Video Embed</option>
          <option value="github_repo">+ GitHub Repository Showcase Card</option>
          <option value="resume_embed">+ Downloadable Resume Call-to-Action</option>
          <option value="pricing_card">+ Freelance Services Pricing Card</option>
          <option value="alert_banner">+ Action Alert Status Banner</option>
          <option value="tech_stack_grid">+ Tech Stack Icons Grid</option>
        </select>
      </div>

      {/* Dynamic blocks listings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {blocks.map((block, idx) => (
          <div
            key={block.id || idx}
            style={{
              padding: '1.25rem', background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--outline-variant)',
              display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative',
            }}
          >
            {/* Header controls for individual block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '0.5rem' }}>
              <span className="text-label-caps text-primary" style={{ fontSize: '10px', fontWeight: 700 }}>
                Block {idx + 1}: {block.type.replace('_', ' ')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button type="button" className="btn-ghost" onClick={() => moveBlock(idx, -1)} disabled={idx === 0} style={{ padding: '2px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_upward</span>
                </button>
                <button type="button" className="btn-ghost" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} style={{ padding: '2px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_downward</span>
                </button>
                <button type="button" className="btn-ghost" onClick={() => deleteBlock(idx)} style={{ padding: '2px', color: 'var(--error)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>
              </div>
            </div>

            {/* Block Fields Editor inputs */}
            {block.type === 'paragraph' && (
              <div>
                <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Paragraph Text</label>
                <textarea
                  className="input-field"
                  value={block.text || ''}
                  onChange={e => handleBlockChange(idx, 'text', e.target.value)}
                  style={{ width: '100%', minHeight: '85px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  placeholder="Enter paragraph text..."
                  required
                />
                <AIEnhanceButton value={block.text} onApply={(val) => handleBlockChange(idx, 'text', val)} />
              </div>
            )}

            {(block.type === 'card' || block.type === 'card_no_media') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Card Title</label>
                  <input
                    type="text"
                    value={block.title || ''}
                    onChange={e => handleBlockChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter card title..."
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Card Description</label>
                  <textarea
                    value={block.text || ''}
                    onChange={e => handleBlockChange(idx, 'text', e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter body text..."
                  />
                  <AIEnhanceButton value={block.text} onApply={(val) => handleBlockChange(idx, 'text', val)} />
                </div>
                {block.type === 'card' && (
                  <div>
                    <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Card Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleBlockImageUpload(idx, e.target.files[0])}
                      style={{ fontSize: '12px' }}
                    />
                    {block.imageUrl && (
                      <img src={block.imageUrl} alt="Card preview" style={{ width: '80px', height: '50px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: 'var(--radius-sm)' }} />
                    )}
                  </div>
                )}
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Link URL</label>
                  <input
                    type="url"
                    value={block.linkUrl || ''}
                    onChange={e => handleBlockChange(idx, 'linkUrl', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {block.type === 'media' && (
              <div>
                <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Upload Media File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleBlockImageUpload(idx, e.target.files[0])}
                  style={{ fontSize: '12px' }}
                />
                {block.imageUrl && (
                  <img src={block.imageUrl} alt="Media preview" style={{ width: '100px', height: '80px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: 'var(--radius-sm)' }} />
                )}
              </div>
            )}

            {block.type === 'grid_card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Card Title</label>
                  <input
                    type="text"
                    value={block.title || ''}
                    onChange={e => handleBlockChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter card title..."
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Card Description</label>
                  <textarea
                    value={block.text || ''}
                    onChange={e => handleBlockChange(idx, 'text', e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter description text..."
                  />
                  <AIEnhanceButton value={block.text} onApply={(val) => handleBlockChange(idx, 'text', val)} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Grid Columns Span (Width)</label>
                  <select
                    value={block.gridSpan || '1'}
                    onChange={e => handleBlockChange(idx, 'gridSpan', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', background: 'var(--surface-container-low)' }}
                  >
                    <option value="1">1 Column (Default)</option>
                    <option value="2">2 Columns (Medium)</option>
                    <option value="3">3 Columns (Full Width)</option>
                  </select>
                </div>
              </div>
            )}

            {block.type === 'timeline_card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Date / Timeline Range</label>
                  <input
                    type="text"
                    value={block.date || ''}
                    onChange={e => handleBlockChange(idx, 'date', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. 2025 - Present or Oct 2025"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Company / Institution Title</label>
                  <input
                    type="text"
                    value={block.title || ''}
                    onChange={e => handleBlockChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. Raylog Industries"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Role / Degree Subtitle</label>
                  <input
                    type="text"
                    value={block.subtitle || ''}
                    onChange={e => handleBlockChange(idx, 'subtitle', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. Software Development Intern"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Description Details</label>
                  <textarea
                    value={block.text || ''}
                    onChange={e => handleBlockChange(idx, 'text', e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter details..."
                  />
                  <AIEnhanceButton value={block.text} onApply={(val) => handleBlockChange(idx, 'text', val)} />
                </div>
              </div>
            )}

            {block.type === 'quote_card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Quote Content</label>
                  <textarea
                    value={block.text || ''}
                    onChange={e => handleBlockChange(idx, 'text', e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter the quote description..."
                  />
                  <AIEnhanceButton value={block.text} onApply={(val) => handleBlockChange(idx, 'text', val)} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Author / Source Attribution</label>
                  <input
                    type="text"
                    value={block.author || ''}
                    onChange={e => handleBlockChange(idx, 'author', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. Jason Kenneth N"
                  />
                </div>
              </div>
            )}

            {block.type === 'code_block' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Programming Language</label>
                  <input
                    type="text"
                    value={block.language || 'javascript'}
                    onChange={e => handleBlockChange(idx, 'language', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. python, javascript, django"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Code Snippet Content</label>
                  <textarea
                    value={block.code || ''}
                    onChange={e => handleBlockChange(idx, 'code', e.target.value)}
                    style={{ width: '100%', minHeight: '120px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', fontFamily: 'var(--font-code)', fontSize: '13px' }}
                    placeholder="class SoftwareEngineer { ... }"
                  />
                </div>
              </div>
            )}

            {block.type === 'contact_form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Form Title</label>
                  <input
                    type="text"
                    value={block.title || ''}
                    onChange={e => handleBlockChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Email Placeholder</label>
                  <input
                    type="text"
                    value={block.emailPlaceholder || ''}
                    onChange={e => handleBlockChange(idx, 'emailPlaceholder', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Message Placeholder</label>
                  <input
                    type="text"
                    value={block.messagePlaceholder || ''}
                    onChange={e => handleBlockChange(idx, 'messagePlaceholder', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Submit Button Text</label>
                  <input
                    type="text"
                    value={block.buttonText || ''}
                    onChange={e => handleBlockChange(idx, 'buttonText', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
              </div>
            )}

            {block.type === 'skill_progress' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Skill Name</label>
                  <input
                    type="text"
                    value={block.skillName || ''}
                    onChange={e => handleBlockChange(idx, 'skillName', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Percentage Value (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={block.percentageValue || ''}
                    onChange={e => handleBlockChange(idx, 'percentageValue', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
              </div>
            )}

            {block.type === 'skill_badge_cloud' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Badges List (Comma-Separated)</label>
                  <input
                    type="text"
                    value={block.badgeList || ''}
                    onChange={e => handleBlockChange(idx, 'badgeList', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. React, Python, Django, SQL"
                  />
                </div>
              </div>
            )}

            {block.type === 'social_grid' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>GitHub Link</label>
                  <input
                    type="url"
                    value={block.github || ''}
                    onChange={e => handleBlockChange(idx, 'github', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>LinkedIn Link</label>
                  <input
                    type="url"
                    value={block.linkedin || ''}
                    onChange={e => handleBlockChange(idx, 'linkedin', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Twitter Link</label>
                  <input
                    type="url"
                    value={block.twitter || ''}
                    onChange={e => handleBlockChange(idx, 'twitter', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Email Address</label>
                  <input
                    type="email"
                    value={block.email || ''}
                    onChange={e => handleBlockChange(idx, 'email', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            )}

            {block.type === 'faq_accordion' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Question</label>
                  <input
                    type="text"
                    value={block.question || ''}
                    onChange={e => handleBlockChange(idx, 'question', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter question text..."
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Answer</label>
                  <textarea
                    value={block.answer || ''}
                    onChange={e => handleBlockChange(idx, 'answer', e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter answer text..."
                  />
                  <AIEnhanceButton value={block.answer} onApply={(val) => handleBlockChange(idx, 'answer', val)} />
                </div>
              </div>
            )}

            {block.type === 'stat_counter' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Metric Value</label>
                  <input
                    type="text"
                    value={block.metricValue || ''}
                    onChange={e => handleBlockChange(idx, 'metricValue', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. 500+ or 5+"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Metric Label</label>
                  <input
                    type="text"
                    value={block.metricLabel || ''}
                    onChange={e => handleBlockChange(idx, 'metricLabel', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. GitHub Stars"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Short Description</label>
                  <input
                    type="text"
                    value={block.description || ''}
                    onChange={e => handleBlockChange(idx, 'description', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. Accumulated across repositories."
                  />
                </div>
              </div>
            )}

            {block.type === 'youtube_embed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>YouTube Video ID (or URL)</label>
                  <input
                    type="text"
                    value={block.videoUrlOrId || ''}
                    onChange={e => handleBlockChange(idx, 'videoUrlOrId', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. dQw4w9WgXcQ"
                  />
                </div>
              </div>
            )}

            {block.type === 'github_repo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Repository Name (e.g. username/repo)</label>
                  <input
                    type="text"
                    value={block.repoName || ''}
                    onChange={e => handleBlockChange(idx, 'repoName', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="jasonkennethn/RailTrace"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Description</label>
                  <textarea
                    value={block.repoDesc || ''}
                    onChange={e => handleBlockChange(idx, 'repoDesc', e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                  <AIEnhanceButton value={block.repoDesc} onApply={(val) => handleBlockChange(idx, 'repoDesc', val)} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Stars Count</label>
                  <input
                    type="text"
                    value={block.starsCount || ''}
                    onChange={e => handleBlockChange(idx, 'starsCount', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="12"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Primary Language</label>
                  <input
                    type="text"
                    value={block.language || ''}
                    onChange={e => handleBlockChange(idx, 'language', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Python"
                  />
                </div>
              </div>
            )}

            {block.type === 'resume_embed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Resume URL / File Link</label>
                  <input
                    type="text"
                    value={block.resumeUrl || ''}
                    onChange={e => handleBlockChange(idx, 'resumeUrl', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="#"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Button Text</label>
                  <input
                    type="text"
                    value={block.buttonText || ''}
                    onChange={e => handleBlockChange(idx, 'buttonText', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
              </div>
            )}

            {block.type === 'pricing_card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Plan Name</label>
                  <input
                    type="text"
                    value={block.planName || ''}
                    onChange={e => handleBlockChange(idx, 'planName', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Freelance Consultation"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Price</label>
                  <input
                    type="text"
                    value={block.priceText || ''}
                    onChange={e => handleBlockChange(idx, 'priceText', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="$80"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Billing Cycle</label>
                  <input
                    type="text"
                    value={block.billingCycle || ''}
                    onChange={e => handleBlockChange(idx, 'billingCycle', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="per hour"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Features List (Comma-Separated)</label>
                  <input
                    type="text"
                    value={block.featuresList || ''}
                    onChange={e => handleBlockChange(idx, 'featuresList', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Architecture planning, Code review, FastAPI"
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Button Text</label>
                  <input
                    type="text"
                    value={block.buttonText || ''}
                    onChange={e => handleBlockChange(idx, 'buttonText', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                  />
                </div>
              </div>
            )}

            {block.type === 'alert_banner' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Alert Type</label>
                  <select
                    value={block.alertType || 'info'}
                    onChange={e => handleBlockChange(idx, 'alertType', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', background: 'var(--surface-container-low)' }}
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Yellow/Orange)</option>
                    <option value="success">Success (Green)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Alert Text</label>
                  <textarea
                    value={block.text || ''}
                    onChange={e => handleBlockChange(idx, 'text', e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="Enter announcement text..."
                  />
                </div>
              </div>
            )}

            {block.type === 'tech_stack_grid' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: '0.25rem' }}>Tech Stack Items (Comma-Separated)</label>
                  <input
                    type="text"
                    value={block.items || ''}
                    onChange={e => handleBlockChange(idx, 'items', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}
                    placeholder="e.g. Python, Django, PostgreSQL, Docker"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '14.5px' }}>{label}</p>
        <p className="text-muted" style={{ fontSize: '12px' }}>{description}</p>
      </div>
      <div className={`toggle-track ${checked ? 'active' : ''}`} onClick={onChange}>
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
}

function LoginGate({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'jasonkennethn' && password === 'Nerellas@123') {
      sessionStorage.setItem('kenneth-auth', 'true');
      onSuccess();
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem var(--section-gap) 1rem' }}>
      <div className="glass-card-static" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--outline-variant)',
        background: 'var(--surface-container-low)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '0.5rem' }}>lock</span>
          <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', fontWeight: 800, margin: 0 }}>Admin Panel</h2>
          <p className="text-body-sm text-muted" style={{ marginTop: '0.25rem' }}>Enter credentials to access customizer settings</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '13.5px',
              textAlign: 'center',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ fontWeight: 600, fontSize: '13.5px', display: 'block', marginBottom: '0.5rem', color: 'var(--on-surface-variant)' }}>Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--outline-variant)',
                background: 'var(--surface-container-low)',
                fontSize: '14px',
                outline: 'none',
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: '13.5px', display: 'block', marginBottom: '0.5rem', color: 'var(--on-surface-variant)' }}>Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--outline-variant)',
                background: 'var(--surface-container-low)',
                fontSize: '14px',
                outline: 'none',
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
            Authenticate
          </button>
        </form>
      </div>
    </main>
  );
}
