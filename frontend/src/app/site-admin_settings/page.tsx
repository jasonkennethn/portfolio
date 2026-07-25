'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  CheckCircle2, 
  LogOut, 
  Settings, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Eye, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Wrench, 
  Upload,
  ExternalLink,
  ChevronRight,
  Trophy,
  ImageIcon,
  Zap,
  Star,
  Award,
  Target,
  Flame,
  Crown,
  Rocket,
  Globe,
  Medal,
  Heart,
  Lightbulb,
  Mail
} from 'lucide-react';
import { usePortfolio, PortfolioData } from '@/context/PortfolioContext';
import { getApiBaseUrl } from '@/config/api';

export default function AdminSettingsPage() {
  const { data: globalData, updateData, resetData } = usePortfolio();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'projects' | 'experience' | 'skills' | 'education' | 'certifications' | 'achievements' | 'messages'>('hero');
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  interface ContactMsg {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    is_read: boolean;
    created_at: string;
  }

  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/messages/`);
      const result = await res.json();
      if (res.ok && result.success) {
        setMessages(result.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/messages/${id}/`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'messages') {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab]);

  // Form State initialized from global context
  const [formData, setFormData] = useState<PortfolioData>(globalData);

  const achievementIconOptions = [
    { value: 'Trophy', label: '🏆 Trophy' },
    { value: 'Star', label: '⭐ Star' },
    { value: 'Zap', label: '⚡ Lightning' },
    { value: 'Award', label: '🎖️ Award' },
    { value: 'Target', label: '🎯 Target' },
    { value: 'Flame', label: '🔥 Flame' },
    { value: 'Crown', label: '👑 Crown' },
    { value: 'Rocket', label: '🚀 Rocket' },
    { value: 'Globe', label: '🌍 Globe' },
    { value: 'Medal', label: '🏅 Medal' },
    { value: 'Heart', label: '❤️ Heart' },
    { value: 'Lightbulb', label: '💡 Lightbulb' },
    { value: 'GraduationCap', label: '🎓 Graduation' },
    { value: 'Code', label: '💻 Code' },
  ];

  const handleImageUpload = async (file: File, targetType: 'project' | 'certification', targetIdx: number) => {
    const targetId = `${targetType}_${targetIdx}`;
    setUploadingTarget(targetId);
    setError('');

    // Instant local preview for zero-delay visual response
    const localPreviewUrl = URL.createObjectURL(file);
    if (targetType === 'project') {
      const updated = [...formData.projects];
      updated[targetIdx].image = localPreviewUrl;
      setFormData({ ...formData, projects: updated });
    } else {
      const updated = [...formData.certifications];
      updated[targetIdx].image = localPreviewUrl;
      setFormData({ ...formData, certifications: updated });
    }

    let oldUrl = '';
    if (targetType === 'project' && formData.projects[targetIdx]?.image) {
      oldUrl = formData.projects[targetIdx].image;
    } else if (targetType === 'certification' && formData.certifications[targetIdx]?.image) {
      oldUrl = formData.certifications[targetIdx].image;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('asset_type', 'photo');
    uploadFormData.append('public_id', targetType === 'project' ? `project_${targetIdx}` : `cert_${targetIdx}`);
    if (oldUrl) {
      uploadFormData.append('old_url', oldUrl);
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/upload/`, {
        method: 'POST',
        body: uploadFormData
      });

      const result = await res.json();
      if (res.ok && result.success) {
        if (targetType === 'project') {
          const updated = [...formData.projects];
          updated[targetIdx].image = result.url;
          const updatedData = { ...formData, projects: updated };
          setFormData(updatedData);
          updateData(updatedData);
        } else {
          const updated = [...formData.certifications];
          updated[targetIdx].image = result.url;
          const updatedData = { ...formData, certifications: updated };
          setFormData(updatedData);
          updateData(updatedData);
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to upload image.');
      }
    } catch {
      setError('Could not connect to backend. Make sure Django is running on port 8000.');
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleReplaceAsset = async (e: React.ChangeEvent<HTMLInputElement>, assetType: 'photo' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(`hero_${assetType}`);
    setError('');

    if (assetType === 'photo') {
      const localPreviewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, hero: { ...formData.hero, photoUrl: localPreviewUrl } });
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('asset_type', assetType);
    uploadFormData.append('public_id', 'hero_photo');
    if (assetType === 'photo' && formData.hero.photoUrl) {
      uploadFormData.append('old_url', formData.hero.photoUrl);
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/upload/`, {
        method: 'POST',
        body: uploadFormData
      });

      const result = await res.json();
      if (res.ok && result.success) {
        if (assetType === 'photo') {
          const updatedData = { ...formData, hero: { ...formData.hero, photoUrl: result.url } };
          setFormData(updatedData);
          updateData(updatedData);
        } else {
          const updatedData = { ...formData, hero: { ...formData.hero, resumeUrl: `${getApiBaseUrl()}/api/download-resume/` } };
          setFormData(updatedData);
          updateData(updatedData);
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to replace asset.');
      }
    } catch {
      setError('Could not connect to backend server. Make sure Python Django is running on port 8000.');
    } finally {
      setUploadingTarget(null);
    }
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setFormData(globalData);
  }, [globalData]);

  // Fix body overflow for admin page
  useEffect(() => {
    if (isAuthenticated) {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof document !== 'undefined' && formData?.hero?.siteTitle) {
      document.title = formData.hero.siteTitle;
      let el = document.querySelector('title');
      if (!el) {
        el = document.createElement('title');
        document.head.appendChild(el);
      }
      el.innerText = formData.hero.siteTitle;
    }
  }, [formData?.hero?.siteTitle]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/admin-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
      } else {
        setError(data.error || 'Invalid superadmin credentials.');
      }
    } catch {
      setError('Could not connect to backend authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('admin_authenticated');
  };

  const handleSave = () => {
    updateData(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website customizations back to original Jason Kenneth N defaults?')) {
      resetData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const tabs = [
    { key: 'hero' as const, label: 'Hero & Bio', icon: User },
    { key: 'projects' as const, label: `Projects (${formData.projects.length})`, icon: FolderGit2 },
    { key: 'experience' as const, label: `Experience (${formData.experiences.length})`, icon: Briefcase },
    { key: 'skills' as const, label: `Skills (${formData.skillCategories.length})`, icon: Wrench },
    { key: 'education' as const, label: `Education (${formData.education.length})`, icon: GraduationCap },
    { key: 'certifications' as const, label: `Certifications (${formData.certifications.length})`, icon: Award },
    { key: 'achievements' as const, label: `Achievements (${formData.achievements.length})`, icon: Trophy },
    { key: 'messages' as const, label: `Messages (${messages.length})`, icon: Mail },
  ];

  return (
    <div className="admin-cms-root">
      <main className="min-h-screen w-full bg-executive-mesh text-slate-800 relative">
        
        {/* Background Decor */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/5 via-indigo-500/5 to-transparent pointer-events-none" />

        {!isAuthenticated ? (
          /* ================= LOGIN FORM ================= */
          <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
            <div className="admin-content-card max-w-md w-full p-8 sm:p-10 relative z-10 space-y-6">
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 flex items-center justify-center mx-auto text-[var(--primary)]">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Superadmin Portal
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">Sign in to manage your portfolio</p>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="admin-label">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                      className="admin-input !pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="admin-input !pl-10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="apple-button btn-primary w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md cursor-pointer mt-2"
                >
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center pt-2">
                <a href="/" className="text-xs font-semibold text-slate-500 hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  Return to Portfolio Website
                </a>
              </div>

            </div>
          </div>
        ) : (
          /* ================= DYNAMIC WEBSITE CUSTOMIZATION CMS ================= */
          <div className="max-w-6xl mx-auto relative z-10 space-y-5 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            
            {/* Success Banner */}
            {saveSuccess && (
              <div className="admin-success-banner">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold">Changes saved & applied live!</span>
                </div>
                <a href="/" target="_blank" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 shrink-0">
                  View Live Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Top Bar Header */}
            <div className="admin-header-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 flex items-center justify-center text-[var(--primary)] shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                    Website Customizer
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Edit any section and persist changes instantly
                  </p>
                </div>
              </div>

              <div className="admin-actions w-full sm:w-auto justify-end flex items-center gap-2.5">
                <button
                  onClick={handleSave}
                  className="apple-button btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-500 transition-all cursor-pointer inline-flex items-center gap-2 text-xs font-bold"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-tab-bar">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: HERO & BIO */}
            {activeTab === 'hero' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="admin-section-title">
                  <div className="icon-circle"><User className="w-4 h-4" /></div>
                  <span>Hero Section & Profile Information</span>
                </div>

                <div>
                  <label className="admin-label">Website Title (Browser Tab HTML Title)</label>
                  <input
                    type="text"
                    value={formData.hero.siteTitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, hero: { ...formData.hero, siteTitle: val } });
                      if (typeof document !== 'undefined') {
                        const titleToSet = val || 'Jason Kenneth N | Software Engineer Portfolio';
                        document.title = titleToSet;
                        const tag = document.getElementsByTagName('title')[0];
                        if (tag) tag.textContent = titleToSet;
                      }
                    }}
                    placeholder="e.g. Jason Kenneth N | Software Engineer Portfolio"
                    className="admin-input font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="admin-label">Full Name</label>
                    <input
                      type="text"
                      value={formData.hero.name}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, name: e.target.value } })}
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Role Title</label>
                    <input
                      type="text"
                      value={formData.hero.role}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, role: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Bio Description</label>
                  <textarea
                    rows={3}
                    value={formData.hero.bio}
                    onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, bio: e.target.value } })}
                    className="admin-input resize-none"
                  />
                </div>

                {/* Photo & Resume */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="admin-upload-zone space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="admin-label !mb-0">Profile Photo</label>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        ✓ Active
                      </span>
                    </div>
                    <input
                      type="file"
                      id="replace-photo-input"
                      accept="image/*"
                      onChange={(e) => handleReplaceAsset(e, 'photo')}
                      className="hidden"
                    />
                    <label
                      htmlFor="replace-photo-input"
                      className="apple-button btn-primary w-full py-3 rounded-xl font-bold text-xs text-white shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingTarget === 'hero_photo' ? 'Uploading...' : 'Upload Profile Photo'}</span>
                    </label>
                  </div>

                  <div className="admin-upload-zone space-y-3">
                    <label className="admin-label">Resume PDF URL / Direct Source Link</label>
                    <input
                      type="url"
                      value={formData.hero.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, resumeUrl: e.target.value } })}
                      placeholder="https://drive.google.com/file/d/... or any direct PDF link"
                      className="admin-input"
                    />
                    <p className="text-[11px] text-slate-500">
                      Paste your Resume PDF direct source URL (Google Drive, Dropbox, Cloudinary, etc.)
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="admin-label">GitHub Link</label>
                    <input
                      type="text"
                      value={formData.hero.github}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, github: e.target.value } })}
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">LinkedIn Link</label>
                    <input
                      type="text"
                      value={formData.hero.linkedin}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, linkedin: e.target.value } })}
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Email Address</label>
                    <input
                      type="email"
                      value={formData.hero.email}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, email: e.target.value } })}
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Phone Number</label>
                    <input
                      type="text"
                      value={formData.hero.phone}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, phone: e.target.value } })}
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="admin-section-title !mb-0 !pb-0 !border-0">
                    <div className="icon-circle"><FolderGit2 className="w-4 h-4" /></div>
                    <span>Projects</span>
                  </div>
                  <button
                    onClick={() => {
                      const newProj = {
                        title: 'New Project',
                        tech: ['Python', 'React'],
                        github: 'https://github.com/jasonkennethn',
                        live: 'https://example.com',
                        desc: 'Description of the new software engineering project.',
                        image: ''
                      };
                      setFormData({ ...formData, projects: [...formData.projects, newProj] });
                      scrollToBottom();
                    }}
                    className="apple-button btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="admin-item-card space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="admin-badge">Project #{pIdx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = formData.projects.filter((_, idx) => idx !== pIdx);
                            setFormData({ ...formData, projects: updated });
                          }}
                          className="admin-delete-btn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].title = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Tech Stack (comma separated)</label>
                          <input
                            type="text"
                            value={proj.tech.join(', ')}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].tech = e.target.value.split(',').map((t) => t.trim());
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">GitHub URL</label>
                          <input
                            type="text"
                            value={proj.github}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].github = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Live URL</label>
                          <input
                            type="text"
                            value={proj.live}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[pIdx].live = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="admin-label">Description</label>
                        <textarea
                          rows={2}
                          value={proj.desc}
                          onChange={(e) => {
                            const updated = [...formData.projects];
                            updated[pIdx].desc = e.target.value;
                            setFormData({ ...formData, projects: updated });
                          }}
                          className="admin-input resize-none"
                        />
                      </div>

                      <div>
                        <label className="admin-label">Project Image</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id={`proj-image-${pIdx}`}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'project', pIdx);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`proj-image-${pIdx}`}
                            className="apple-button btn-secondary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingTarget === `project_${pIdx}` ? 'Uploading...' : 'Upload Image'}</span>
                          </label>
                          {proj.image && (
                            <img src={proj.image} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          )}
                          {proj.image && (
                            <span className="text-[11px] font-bold text-emerald-600">✓ Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="admin-section-title !mb-0 !pb-0 !border-0">
                    <div className="icon-circle"><Briefcase className="w-4 h-4" /></div>
                    <span>Work Experience</span>
                  </div>
                  <button
                    onClick={() => {
                      const newExp = {
                        role: 'Software Engineer Intern',
                        company: 'Tech Company',
                        url: 'https://example.com',
                        period: '2026 – Present',
                        durationMonths: 4,
                        summary: 'Backend software development and API engineering.',
                        bullets: ['Engineered scalable features using Python and SQL.'],
                        tech: ['Python', 'Django']
                      };
                      setFormData({ ...formData, experiences: [...formData.experiences, newExp] });
                      scrollToBottom();
                    }}
                    className="apple-button btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.experiences.map((exp, eIdx) => (
                    <div key={eIdx} className="admin-item-card space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="admin-badge">Experience #{eIdx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = formData.experiences.filter((_, idx) => idx !== eIdx);
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="admin-delete-btn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[eIdx].role = e.target.value;
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[eIdx].company = e.target.value;
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Period (e.g. Oct 2025 – Mar 2026)</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[eIdx].period = e.target.value;
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Duration (in Months)</label>
                          <input
                            type="number"
                            value={exp.durationMonths}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[eIdx].durationMonths = parseInt(e.target.value) || 0;
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="admin-label">Summary</label>
                        <input
                          type="text"
                          value={exp.summary}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[eIdx].summary = e.target.value;
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="admin-label">Technologies Used (comma separated)</label>
                        <input
                          type="text"
                          value={exp.tech ? exp.tech.join(', ') : ''}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[eIdx].tech = e.target.value.split(',').map((t) => t.trim());
                            setFormData({ ...formData, experiences: updated });
                          }}
                          placeholder="e.g. Python, Django, SQL, Git, Agile"
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="admin-label">Bullet Points (one per line)</label>
                        <textarea
                          rows={3}
                          value={exp.bullets ? exp.bullets.join('\n') : ''}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[eIdx].bullets = e.target.value.split('\n').filter((b) => b.trim().length > 0);
                            setFormData({ ...formData, experiences: updated });
                          }}
                          placeholder="Enter bullet points, one per line..."
                          className="admin-input resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SKILLS */}
            {activeTab === 'skills' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="admin-section-title">
                  <div className="icon-circle"><Wrench className="w-4 h-4" /></div>
                  <span>Skills & Languages</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.skillCategories.map((cat, sIdx) => (
                    <div key={sIdx} className="admin-item-card space-y-3">
                      <label className="admin-label !text-[var(--primary)]">{cat.title}</label>
                      <textarea
                        rows={3}
                        value={cat.skills.join(', ')}
                        onChange={(e) => {
                          const updated = [...formData.skillCategories];
                          updated[sIdx].skills = e.target.value.split(',').map((s) => s.trim());
                          setFormData({ ...formData, skillCategories: updated });
                        }}
                        className="admin-input resize-none !text-[13px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: EDUCATION */}
            {activeTab === 'education' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="admin-section-title !mb-0 !pb-0 !border-0">
                    <div className="icon-circle"><GraduationCap className="w-4 h-4" /></div>
                    <span>Education</span>
                  </div>
                  <button
                    onClick={() => {
                      const newEdu = {
                        degree: 'Degree Name',
                        field: 'Field of Study',
                        institution: 'Institution Name',
                        period: '20XX – 20XX',
                        score: 'CGPA: X.X'
                      };
                      setFormData({ ...formData, education: [...formData.education, newEdu] });
                      scrollToBottom();
                    }}
                    className="apple-button btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.education.map((edu, edIdx) => (
                    <div key={edIdx} className="admin-item-card space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="admin-badge">Education #{edIdx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = formData.education.filter((_, idx) => idx !== edIdx);
                            setFormData({ ...formData, education: updated });
                          }}
                          className="admin-delete-btn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[edIdx].degree = e.target.value;
                              setFormData({ ...formData, education: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Field of Study</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[edIdx].field = e.target.value;
                              setFormData({ ...formData, education: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[edIdx].institution = e.target.value;
                              setFormData({ ...formData, education: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Period</label>
                          <input
                            type="text"
                            value={edu.period}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[edIdx].period = e.target.value;
                              setFormData({ ...formData, education: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Score / CGPA</label>
                          <input
                            type="text"
                            value={edu.score}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[edIdx].score = e.target.value;
                              setFormData({ ...formData, education: updated });
                            }}
                            className="admin-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="admin-section-title !mb-0 !pb-0 !border-0">
                    <div className="icon-circle"><Award className="w-4 h-4" /></div>
                    <span>Certifications</span>
                  </div>
                  <button
                    onClick={() => {
                      const newCert = {
                        title: 'Certification Title',
                        issuer: 'Issuing Organization',
                        image: ''
                      };
                      setFormData({ ...formData, certifications: [...formData.certifications, newCert] });
                      scrollToBottom();
                    }}
                    className="apple-button btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.certifications.map((cert, cIdx) => (
                    <div key={cIdx} className="admin-item-card space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="admin-badge">Certification #{cIdx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = formData.certifications.filter((_, idx) => idx !== cIdx);
                            setFormData({ ...formData, certifications: updated });
                          }}
                          className="admin-delete-btn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Certification Title</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => {
                              const updated = [...formData.certifications];
                              updated[cIdx].title = e.target.value;
                              setFormData({ ...formData, certifications: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Issuer</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = [...formData.certifications];
                              updated[cIdx].issuer = e.target.value;
                              setFormData({ ...formData, certifications: updated });
                            }}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="admin-label">Certificate Image</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id={`cert-image-${cIdx}`}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'certification', cIdx);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`cert-image-${cIdx}`}
                            className="apple-button btn-secondary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingTarget === `certification_${cIdx}` ? 'Uploading...' : 'Upload Image'}</span>
                          </label>
                          {cert.image && (
                            <img src={cert.image} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          )}
                          {cert.image && (
                            <span className="text-[11px] font-bold text-emerald-600">✓ Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="admin-section-title !mb-0 !pb-0 !border-0">
                    <div className="icon-circle"><Trophy className="w-4 h-4" /></div>
                    <span>Achievements</span>
                  </div>
                  <button
                    onClick={() => {
                      const newAch = {
                        title: 'New Achievement',
                        desc: 'Description of the achievement.',
                        location: 'Location / Event',
                        icon: 'Trophy'
                      };
                      setFormData({ ...formData, achievements: [...formData.achievements, newAch] });
                      scrollToBottom();
                    }}
                    className="apple-button btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Achievement</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="admin-item-card space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="admin-badge">Achievement #{aIdx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = formData.achievements.filter((_, idx) => idx !== aIdx);
                            setFormData({ ...formData, achievements: updated });
                          }}
                          className="admin-delete-btn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Title</label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => {
                              const updated = [...formData.achievements];
                              updated[aIdx].title = e.target.value;
                              setFormData({ ...formData, achievements: updated });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="admin-label">Location / Event</label>
                          <input
                            type="text"
                            value={ach.location}
                            onChange={(e) => {
                              const updated = [...formData.achievements];
                              updated[aIdx].location = e.target.value;
                              setFormData({ ...formData, achievements: updated });
                            }}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="admin-label">Description</label>
                        <textarea
                          rows={2}
                          value={ach.desc}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[aIdx].desc = e.target.value;
                            setFormData({ ...formData, achievements: updated });
                          }}
                          className="admin-input resize-none"
                        />
                      </div>

                      <div>
                        <label className="admin-label">Display Icon</label>
                        <select
                          value={ach.icon || 'Trophy'}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[aIdx].icon = e.target.value;
                            setFormData({ ...formData, achievements: updated });
                          }}
                          className="admin-input cursor-pointer font-medium"
                        >
                          {achievementIconOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="admin-content-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="admin-section-title !mb-0 !pb-0 !border-0">
                    <div className="icon-circle"><Mail className="w-4 h-4" /></div>
                    <span>Received Contact Messages</span>
                  </div>
                  <button
                    onClick={fetchMessages}
                    className="apple-button btn-secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Refresh
                  </button>
                </div>

                {loadingMessages ? (
                  <div className="py-12 text-center text-xs font-medium text-slate-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-xs font-medium text-slate-400 border border-dashed rounded-xl">
                    No messages received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="p-5 rounded-2xl border border-slate-200 bg-white/70 space-y-3 relative group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-sm font-bold text-slate-900">{msg.name}</span>
                            <span className="text-xs text-slate-500 ml-2">&lt;{msg.email}&gt;</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${msg.status === 'sent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                              {msg.status}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {msg.subject && (
                          <div className="text-xs font-semibold text-slate-800">
                            Subject: <span className="font-normal text-slate-600">{msg.subject}</span>
                          </div>
                        )}

                        <div className="text-xs font-medium text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Save Action Card at Bottom */}
            <div className="admin-content-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[var(--primary)]/20 shadow-lg">
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-extrabold text-slate-900">Save Your Customizations</h4>
                <p className="text-xs text-slate-500 mt-0.5">Persists all section edits live to database & Cloudinary CDN</p>
              </div>
              <button
                onClick={handleSave}
                className="apple-button btn-primary inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-xl transition-all cursor-pointer w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            {/* Footer Link */}
            <div className="text-center py-4">
              <a href="/" className="text-xs font-semibold text-slate-500 hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 rotate-180" />
                Return to Main Portfolio Website
              </a>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
