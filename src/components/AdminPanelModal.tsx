import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PodcastItem } from '../types';
import { CATEGORIES, createPodcast, extractSpotifyInfo, extractYoutubeId, getCategoryIcon, isAudioOnlyPodcast } from '../data/podcasts';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  podcasts: PodcastItem[];
  onSaveEpisodes: (episodes: PodcastItem[]) => void;
  onResetDefault: () => void;
  isDark?: boolean;
}

type PlatformType = 'youtube' | 'spotify';

const DEFAULT_ADMIN_PASSCODE = 'Lib@2026';

const getStoredPasscode = (): string => {
  try {
    return localStorage.getItem('slc_admin_passcode') || DEFAULT_ADMIN_PASSCODE;
  } catch {
    return DEFAULT_ADMIN_PASSCODE;
  }
};

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  podcasts,
  onSaveEpisodes,
  onResetDefault,
  isDark = true,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [showPasscode, setShowPasscode] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'security'>('create');

  // Change Password State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [changePassMsg, setChangePassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<PlatformType>('youtube');
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [category, setCategory] = useState('General Health');
  const [customCategory, setCustomCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Feedback / Status
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [searchManageQuery, setSearchManageQuery] = useState('');

  // Reset authentication error when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setPasscodeError(null);
      setInputPasscode('');
    }
  }, [isOpen]);

  // Handle Passcode Unlock
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentCorrectPasscode = getStoredPasscode();
    
    if (inputPasscode.trim() === currentCorrectPasscode.trim()) {
      setIsAuthenticated(true);
      setPasscodeError(null);
      setInputPasscode('');
    } else {
      setPasscodeError('รหัสผ่านไม่ถูกต้อง! กรุณาตรวจสอบและลองใหม่อีกครั้ง');
      setShakeTrigger((prev) => prev + 1);
    }
  };

  // Handle Logout / Lock
  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputPasscode('');
    setPasscodeError(null);
    setActiveTab('create');
    resetForm();
  };

  // Handle Change Passcode
  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassMsg(null);

    const currentPasscode = getStoredPasscode();
    if (oldPass.trim() !== currentPasscode.trim()) {
      setChangePassMsg({ type: 'error', text: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      return;
    }

    if (!newPass.trim() || newPass.trim().length < 4) {
      setChangePassMsg({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' });
      return;
    }

    if (newPass.trim() !== confirmPass.trim()) {
      setChangePassMsg({ type: 'error', text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' });
      return;
    }

    try {
      localStorage.setItem('slc_admin_passcode', newPass.trim());
      setChangePassMsg({ type: 'success', text: '✅ เปลี่ยนรหัสผ่าน Admin สำเร็จเรียบร้อยแล้ว!' });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } catch {
      setChangePassMsg({ type: 'error', text: 'ไม่สามารถบันทึกรหัสผ่านได้' });
    }
  };

  // Reset to default passcode
  const handleResetPasscodeDefault = () => {
    if (window.confirm('คุณต้องการรีเซ็ตรหัสผ่านกลับเป็นค่าเริ่มต้น (Lib@2026) ใช่หรือไม่?')) {
      try {
        localStorage.setItem('slc_admin_passcode', DEFAULT_ADMIN_PASSCODE);
        setChangePassMsg({ type: 'success', text: `🔄 รีเซ็ตรหัสผ่านกลับเป็น '${DEFAULT_ADMIN_PASSCODE}' แล้ว` });
        setOldPass('');
        setNewPass('');
        setConfirmPass('');
      } catch {
        setChangePassMsg({ type: 'error', text: 'ไม่สามารถรีเซ็ตรหัสผ่านได้' });
      }
    }
  };

  // Auto detect platform when URL changes
  const handleUrlChange = (val: string, currentPlatform: PlatformType) => {
    if (currentPlatform === 'youtube') {
      setYoutubeUrl(val);
      const ytId = extractYoutubeId(val);
      if (ytId && !imageUrl) {
        setImageUrl(`https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`);
      }
    } else {
      setSpotifyUrl(val);
    }
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setPlatform('youtube');
    setTitle('');
    setChannel('');
    setCategory('General Health');
    setCustomCategory('');
    setDuration('');
    setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase());
    setDescription('');
    setYoutubeUrl('');
    setSpotifyUrl('');
    setImageUrl('');
    setSaveSuccessMessage(null);
  };

  // Load episode for editing
  const handleStartEdit = (item: PodcastItem) => {
    setEditingId(item.id || null);
    const isSpotify = isAudioOnlyPodcast(item);
    setPlatform(isSpotify ? 'spotify' : 'youtube');
    setTitle(item.title || '');
    setChannel(item.channel || item.institution || '');
    
    if (CATEGORIES.includes(item.category || '')) {
      setCategory(item.category || 'General Health');
      setCustomCategory('');
    } else {
      setCategory('Custom');
      setCustomCategory(item.category || '');
    }
    
    setDuration(item.duration || '');
    setDate(item.date || '');
    setDescription(item.description || '');
    setYoutubeUrl(item.youtubeUrl || (item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : ''));
    setSpotifyUrl(item.spotifyUrl || '');
    setImageUrl(item.imageUrl || '');
    setActiveTab('create');
    setSaveSuccessMessage(null);
  };

  // Delete episode
  const handleDelete = (id?: string) => {
    if (!id) return;
    if (window.confirm('คุณต้องการลบตอนพอดแคสต์นี้ใช่หรือไม่?')) {
      const updated = podcasts.filter((p) => p.id !== id);
      onSaveEpisodes(updated);
      if (editingId === id) {
        resetForm();
      }
    }
  };

  // Move episode to Top (Newest priority)
  const handleMoveToTop = (id?: string) => {
    if (!id) return;
    const itemIndex = podcasts.findIndex((p) => p.id === id);
    if (itemIndex <= 0) return;
    const target = podcasts[itemIndex];
    const remaining = podcasts.filter((p) => p.id !== id);
    const updated = [target, ...remaining];
    onSaveEpisodes(updated);
  };

  // Submit Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('กรุณากรอกชื่อตอน (Title)');
      return;
    }

    const finalCategory = category === 'Custom' ? customCategory.trim() || 'General Health' : category;
    const finalChannel = channel.trim() || (platform === 'spotify' ? 'Spotify Podcast' : 'Medical YouTube');

    const newItemData: PodcastItem = {
      id: editingId || `custom-${Date.now()}`,
      title: title.trim(),
      category: finalCategory,
      channel: finalChannel,
      institution: finalChannel,
      duration: duration.trim() || (platform === 'spotify' ? '10:00' : '15:00'),
      date: date.trim() || 'LATEST',
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      youtubeUrl: platform === 'youtube' ? youtubeUrl.trim() : undefined,
      spotifyUrl: platform === 'spotify' ? spotifyUrl.trim() : undefined,
    };

    const normalized = createPodcast(newItemData);

    let updatedList: PodcastItem[];
    if (editingId) {
      // Update existing item
      updatedList = podcasts.map((p) => (p.id === editingId ? normalized : p));
      setSaveSuccessMessage('✅ อัปเดตข้อมูลตอนเรียบร้อยแล้ว!');
    } else {
      // Add as newest at the top
      updatedList = [normalized, ...podcasts];
      setSaveSuccessMessage('🎉 เพิ่มตอนใหม่ล่าสุดขึ้นด้านบนเรียบร้อยแล้ว!');
    }

    onSaveEpisodes(updatedList);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);

    if (!editingId) {
      resetForm();
    }
  };

  // Preview Object
  const previewItem: PodcastItem = createPodcast({
    id: editingId || 'preview-id',
    title: title.trim() || 'ตัวอย่างชื่อตอนพอดแคสต์ (Live Preview Title)',
    category: category === 'Custom' ? customCategory || 'General Health' : category,
    channel: channel.trim() || (platform === 'spotify' ? 'Spotify Channel' : 'YouTube Channel'),
    duration: duration.trim() || (platform === 'spotify' ? '08:30' : '15:00'),
    date: date.trim() || 'TODAY',
    description: description.trim() || 'คำอธิบายสรุปประเด็นสุขภาพและสาระสำคัญของพอดแคสต์ตอนดังกล่าว...',
    imageUrl: imageUrl.trim() || undefined,
    youtubeUrl: platform === 'youtube' ? youtubeUrl.trim() : undefined,
    spotifyUrl: platform === 'spotify' ? spotifyUrl.trim() : undefined,
  });

  const isPreviewSpotify = platform === 'spotify';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-[#0b132b] text-slate-100 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070d1e]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <span className="material-symbols-outlined text-[22px]">
                  {isAuthenticated ? 'admin_panel_settings' : 'lock'}
                </span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>แผงควบคุมแอดมิน (Admin Panel)</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${
                      isAuthenticated
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{isAuthenticated ? 'สิทธิ์ผู้ดูแลระบบ (Unlocked)' : 'ต้องใส่รหัสผ่าน (Locked)'}</span>
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isAuthenticated
                    ? 'จัดการ เพิ่ม ลบ แก้ไข ตอนพอดแคสต์ทั้ง YouTube และ Spotify พร้อมบันทึกข้อมูลถาวร'
                    : 'กรุณากรอกรหัสผ่านผู้ดูแลระบบเพื่อเข้าถึงและจัดการข้อมูล'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  title="ล็อค / ออกจากระบบผู้ดูแล"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span className="hidden sm:inline">ล็อคระบบ (Logout)</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="ปิดหน้าต่าง"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* If NOT Authenticated: Show Secure PIN / Passcode Screen */}
          {!isAuthenticated ? (
            <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center my-auto">
              <motion.div
                key={shakeTrigger}
                animate={shakeTrigger > 0 ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-[#070e22] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center"
              >
                {/* Security Icon Badge */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                    <span className="material-symbols-outlined text-[36px]">security</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">key</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5">
                  ยืนยันสิทธิ์ผู้ดูแลระบบ (Admin Access)
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  ระบบได้รับการป้องกันเพื่อความปลอดภัย กรุณาป้อนรหัสผ่าน Admin <p> เพื่อแก้ไขหรือจัดการรายการพอดแคสต์
                </p></p>

                {/* Password Form */}
                <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      รหัสผ่านผู้ดูแลระบบ (Admin Password)
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        lock
                      </span>
                      <input
                        id="admin-passcode-input"
                        type={showPasscode ? 'text' : 'password'}
                        value={inputPasscode}
                        onChange={(e) => {
                          setInputPasscode(e.target.value);
                          if (passcodeError) setPasscodeError(null);
                        }}
                        placeholder="กรอกรหัสผ่าน Admin..."
                        autoFocus
                        className={`w-full h-12 pl-11 pr-12 rounded-2xl bg-slate-900 border text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          passcodeError
                            ? 'border-rose-500/80 focus:ring-rose-500/50 bg-rose-950/20'
                            : 'border-slate-700 focus:ring-blue-500 focus:border-transparent'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                        title={showPasscode ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPasscode ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    {passcodeError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mt-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        <span>{passcodeError}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="admin-unlock-btn"
                    className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-102 active:scale-98 mt-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">lock_open</span>
                    <span>ปลดล็อคเข้าสู่ระบบ Admin</span>
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            /* If Authenticated: Show Full Admin Panel Tabs & Editors */
            <>
              {/* Navigation Sub-Tabs */}
              <div className="flex items-center justify-between px-6 border-b border-slate-800 bg-[#0a1124]">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={() => {
                      setActiveTab('create');
                      setSaveSuccessMessage(null);
                    }}
                    className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'create'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {editingId ? 'edit_note' : 'add_circle'}
                    </span>
                    <span>{editingId ? 'แก้ไขข้อมูลตอน' : 'เพิ่มตอนใหม่ (+ Add Episode)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('list');
                      setSaveSuccessMessage(null);
                    }}
                    className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'list'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                    <span>จัดการรายการทั้งหมด</span>
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {podcasts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('security');
                      setChangePassMsg(null);
                    }}
                    className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'security'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    <span>ตั้งค่ารหัสผ่าน (Security)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm('คุณต้องการคืนค่าตอนพอดแคสต์ทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
                        onResetDefault();
                        resetForm();
                        setSaveSuccessMessage('🔄 รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้นแล้ว');
                      }
                    }}
                    className="text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                    title="Reset to default initial list"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    <span className="hidden sm:inline">รีเซ็ตเป็นค่าเริ่มต้น</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {saveSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-medium flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
                      <span>{saveSuccessMessage}</span>
                    </div>
                    <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </motion.div>
                )}

                {/* TAB 1: ADD / EDIT EPISODE */}
                {activeTab === 'create' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Input Column */}
                    <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-4">
                      {/* Platform Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          1. เลือกแพลตฟอร์ม (Platform)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setPlatform('youtube');
                              if (youtubeUrl) handleUrlChange(youtubeUrl, 'youtube');
                            }}
                            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                              platform === 'youtube'
                                ? 'bg-red-500/15 border-red-500 text-red-400 shadow-lg shadow-red-500/10'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px] text-red-500">smart_display</span>
                            <span>YouTube Video (วิดีโอ)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPlatform('spotify');
                              if (spotifyUrl) handleUrlChange(spotifyUrl, 'spotify');
                            }}
                            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                              platform === 'spotify'
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px] text-emerald-500">podcasts</span>
                            <span>Spotify Podcast (เสียง)</span>
                          </button>
                        </div>
                      </div>

                      {/* URL Input */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          2. วางลิงก์ {platform === 'youtube' ? 'YouTube URL' : 'Spotify Podcast URL'}
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">
                            link
                          </span>
                          <input
                            type="text"
                            placeholder={
                              platform === 'youtube'
                                ? 'เช่น https://www.youtube.com/watch?v=dQw4w9WgXcQ หรือ https://youtu.be/...'
                                : 'เช่น https://open.spotify.com/episode/... หรือ https://open.spotify.com/show/...'
                            }
                            value={platform === 'youtube' ? youtubeUrl : spotifyUrl}
                            onChange={(e) => handleUrlChange(e.target.value, platform)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {platform === 'youtube'
                            ? '💡 ระบบจะดึง Video ID และรูปภาพหน้าปกความละเอียดสูงให้อัตโนมัติ'
                            : '💡 ระบบจะเชื่อมต่อกับตัวเล่นพอดแคสต์ Spotify และปรับสัดส่วนภาพปก 16:9 ให้โดยอัตโนมัติ'}
                        </p>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          3. ชื่อตอนพอดแคสต์ (Episode Title) <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="เช่น เจาะลึกเทคโนโลยี AI ทางการแพทย์ และการวินิจฉัยโรคยุคใหม่"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        />
                      </div>

                      {/* Category & Channel Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            4. หมวดหมู่ (Category)
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                            <option value="Custom">+ เพิ่มหมวดหมู่ใหม่ (Custom Category)</option>
                          </select>

                          {category === 'Custom' && (
                            <input
                              type="text"
                              placeholder="ระบุชื่อหมวดหมู่ใหม่..."
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              className="mt-2 w-full px-3 py-2 bg-slate-900 border border-blue-500/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            5. ช่อง / สถาบัน (Channel / Institution)
                          </label>
                          <input
                            type="text"
                            placeholder="เช่น Saint Louis College, Health Insight Thailand"
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Duration & Date Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            6. ความยาว (Duration)
                          </label>
                          <input
                            type="text"
                            placeholder="เช่น 18:45 หรือ 42:10"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            7. วันที่เผยแพร่ (Release Date)
                          </label>
                          <input
                            type="text"
                            placeholder="เช่น TODAY, OCT 2025, MAY 14, 2025"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Image URL override */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          8. ลิงก์รูปภาพหน้าปก (Cover Image URL) - ตัวเลือกเสริม
                        </label>
                        <input
                          type="text"
                          placeholder="URL รูปภาพหน้าปก (หากปล่อยว่างจะใช้รูปจาก YouTube หรือ Spotify อัตโนมัติ)"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          9. คำอธิบายสรุปประเด็นสำคัญ (Description & Key Points)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="สรุปเนื้อหาสำคัญ ข้อมูลทางการแพทย์ หรือประเด็นที่น่าสนใจในตอนนี้..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-102 active:scale-98"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {editingId ? 'save' : 'add_task'}
                          </span>
                          <span>{editingId ? 'บันทึกการแก้ไขตอน' : 'เพิ่มตอนใหม่ลงระบบ (Add to Library)'}</span>
                        </button>

                        {editingId && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                          >
                            ยกเลิก
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Live Preview Column */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          👁️ แสดงตัวอย่างการแสดงผลจริง (Live Card Preview)
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {platform.toUpperCase()}
                        </span>
                      </div>

                      {/* Render simulated card */}
                      <div className="bg-[#060e20] rounded-2xl overflow-hidden border border-[#334155] shadow-xl">
                        <div className="relative w-full aspect-video overflow-hidden bg-slate-950">
                          {isPreviewSpotify ? (
                            <div className="relative w-full h-full bg-[#030712] flex items-center justify-center overflow-hidden">
                              <img
                                className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-35"
                                src={previewItem.imageUrl}
                                alt=""
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-black/40" />
                              <img
                                className="relative z-10 h-full max-w-full aspect-square object-contain rounded-md shadow-2xl"
                                src={previewItem.imageUrl}
                                alt={previewItem.title}
                              />
                            </div>
                          ) : (
                            <img
                              className="w-full h-full object-cover"
                              src={previewItem.imageUrl}
                              alt={previewItem.title}
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.src.includes('unsplash')) {
                                  target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80';
                                }
                              }}
                            />
                          )}

                          <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white px-2 py-0.5 rounded-md text-[11px] font-medium backdrop-blur-sm z-10">
                            {previewItem.duration}
                          </div>

                          <div
                            className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[11px] backdrop-blur-sm border font-semibold flex items-center gap-1 max-w-[75%] truncate z-10 ${
                              isPreviewSpotify
                                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                                : 'bg-[#060e20]/90 text-red-300 border-red-500/30'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {isPreviewSpotify ? 'podcasts' : 'smart_display'}
                            </span>
                            <span className="truncate">{previewItem.channel}</span>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col gap-2">
                          <h4 className="text-[16px] font-bold leading-snug text-white line-clamp-2">
                            {previewItem.title}
                          </h4>

                          {previewItem.description && (
                            <p className="text-[12px] text-slate-400 line-clamp-2">
                              {previewItem.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-800 text-xs text-slate-400">
                            <span className="flex items-center gap-1 text-blue-400">
                              <span className="material-symbols-outlined text-[14px]">
                                {previewItem.institutionIcon}
                              </span>
                              <span>{previewItem.category}</span>
                            </span>
                            <span>{previewItem.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">📌 หมายเหตุ:</span>{' '}
                        ตอนพอดแคสต์ที่เพิ่มเข้ามาใหม่จะถูกจัดวางเป็น <strong className="text-white">"ตอนล่าสุด (Newest First)"</strong> ที่ด้านบนสุดของ Discovery Grid และหน้าแรกทันที
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: MANAGE ALL EPISODES */}
                {activeTab === 'list' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                      <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                          search
                        </span>
                        <input
                          type="text"
                          placeholder="ค้นหาตอนพอดแคสต์ที่ต้องการแก้ไข..."
                          value={searchManageQuery}
                          onChange={(e) => setSearchManageQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <span className="text-xs text-slate-400">
                        พบทั้งหมด {podcasts.length} รายการ (เรียงตามลำดับจากบนลงล่าง)
                      </span>
                    </div>

                    {/* Episode List */}
                    <div className="flex flex-col gap-2.5">
                      {podcasts
                        .filter((p) => {
                          if (!searchManageQuery) return true;
                          const q = searchManageQuery.toLowerCase();
                          return (
                            p.title.toLowerCase().includes(q) ||
                            (p.channel && p.channel.toLowerCase().includes(q)) ||
                            (p.category && p.category.toLowerCase().includes(q))
                          );
                        })
                        .map((item, idx) => {
                          const isAudio = isAudioOnlyPodcast(item);

                          return (
                            <div
                              key={item.id || idx}
                              className="p-3.5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="text-xs font-mono text-slate-500 w-6 flex-shrink-0 text-center">
                                  #{idx + 1}
                                </span>

                                {/* Thumbnail */}
                                <div className="w-16 h-11 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 relative">
                                  <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                  <span
                                    className={`absolute bottom-0 right-0 px-1 text-[9px] font-bold text-white ${
                                      isAudio ? 'bg-emerald-600' : 'bg-red-600'
                                    }`}
                                  >
                                    {isAudio ? 'SPOTIFY' : 'YT'}
                                  </span>
                                </div>

                                {/* Details */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[11px] text-slate-400">{item.category}</span>
                                    <span className="text-[11px] text-slate-500">• {item.channel}</span>
                                  </div>
                                  <h4 className="text-sm font-semibold text-white truncate max-w-md">
                                    {item.title}
                                  </h4>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                                {idx > 0 && (
                                  <button
                                    onClick={() => handleMoveToTop(item.id)}
                                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors text-xs flex items-center gap-1"
                                    title="ย้ายขึ้นเป็นตอนล่าสุด (Move to Top)"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                                    <span className="hidden md:inline text-[11px]">ขึ้นบนสุด</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-600 hover:text-white text-slate-300 transition-colors text-xs flex items-center gap-1"
                                  title="แก้ไขข้อมูล (Edit)"
                                >
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                  <span className="hidden md:inline text-[11px]">แก้ไข</span>
                                </button>

                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600 hover:text-white text-slate-300 transition-colors text-xs flex items-center gap-1"
                                  title="ลบตอนนี้ (Delete)"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                  <span className="hidden md:inline text-[11px]">ลบ</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* TAB 3: SECURITY & PASSWORD SETTINGS */}
                {activeTab === 'security' && (
                  <div className="max-w-lg mx-auto flex flex-col gap-6 py-4">
                    <div className="bg-[#070e22] border border-slate-800 rounded-3xl p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                          <span className="material-symbols-outlined text-[22px]">lock_reset</span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">เปลี่ยนรหัสผ่าน Admin (Change Password)</h3>
                          <p className="text-xs text-slate-400">กำหนดรหัสผ่านใหม่เพื่อป้องกันไม่ให้ผู้อื่นแก้ไขข้อมูล</p>
                        </div>
                      </div>

                      {changePassMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                            changePassMsg.type === 'success'
                              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {changePassMsg.type === 'success' ? 'check_circle' : 'error'}
                          </span>
                          <span>{changePassMsg.text}</span>
                        </motion.div>
                      )}

                      <form onSubmit={handleChangePasscode} className="flex flex-col gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            รหัสผ่านปัจจุบัน (Current Password)
                          </label>
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            required
                            placeholder="กรอกรหัสผ่านเดิม..."
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            รหัสผ่านใหม่ (New Password)
                          </label>
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            required
                            placeholder="อย่างน้อย 4 ตัวอักษร..."
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            ยืนยันรหัสผ่านใหม่ (Confirm New Password)
                          </label>
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            required
                            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง..."
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showNewPass}
                              onChange={(e) => setShowNewPass(e.target.checked)}
                              className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span>แสดงรหัสผ่านทั้งหมด</span>
                          </label>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                          >
                            <span className="material-symbols-outlined text-[18px]">key</span>
                            <span>บันทึกรหัสผ่านใหม่</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResetPasscodeDefault}
                            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-slate-700 transition-colors"
                            title="คืนค่ารหัสผ่านกลับเป็นค่าเริ่มต้นของระบบ"
                          >
                            คืนค่ารหัสผ่านเริ่มต้น
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 bg-[#070d1e] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>💾 ข้อมูลที่บันทึกจะถูกจัดเก็บไว้ใน Browser ของคุณโดยอัตโนมัติ (Local Persistence)</span>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
