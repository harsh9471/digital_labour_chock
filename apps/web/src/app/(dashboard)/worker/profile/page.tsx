'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  User, MapPin, Star, Briefcase, Phone, Mail, Calendar,
  Plus, Trash2, Edit2, CheckCircle, Clock, X, Save,
  CreditCard, Award, Shield, Camera, Upload, Loader2,
  TrendingUp, IndianRupee, BadgeCheck, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth.store';
import { workersApi } from '@/lib/workers-api';
import { formatDate, formatCurrency } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorkerProfile = any;

const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const SECTIONS = [
  { id: 'basic',      label: 'Basic Info',       icon: User },
  { id: 'skills',     label: 'Skills',            icon: Briefcase },
  { id: 'experience', label: 'Work Experience',   icon: Award },
  { id: 'contact',    label: 'Contact & Payment', icon: CreditCard },
] as const;
type SectionId = typeof SECTIONS[number]['id'];

const LEVEL_CONFIG: Record<string, { cls: string; bar: string; width: string }> = {
  BEGINNER:     { cls: 'bg-slate-100 text-slate-600 border-slate-200',       bar: 'bg-slate-400',    width: '25%' },
  INTERMEDIATE: { cls: 'bg-blue-100 text-blue-700 border-blue-200',          bar: 'bg-blue-500',     width: '50%' },
  ADVANCED:     { cls: 'bg-violet-100 text-violet-700 border-violet-200',    bar: 'bg-violet-500',   width: '75%' },
  EXPERT:       { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500',  width: '100%' },
};

/* ─── Avatar Upload ─────────────────────────────────────────────────────── */
function AvatarUpload({ current, initials, onSave }: {
  current?: string | null;
  initials: string;
  onSave: (url: string) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [urlVal, setUrlVal] = useState('');
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'file' | 'url'>('file');
  const { toast } = useToast();

  /* sync preview with the saved avatar */
  useEffect(() => { setPreview(current ?? null); }, [current]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Too large', description: 'Choose an image under 2 MB', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setUrlVal('');
  };

  const handleSave = async () => {
    const url = tab === 'url' ? urlVal.trim() : (preview ?? '');
    if (!url) return;
    setUploading(true);
    try {
      await onSave(url);
      setOpen(false);
      toast({ title: 'Profile photo updated!' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update photo', variant: 'destructive' });
    } finally { setUploading(false); }
  };

  const displaySrc = preview || null;

  return (
    <div className="relative group">
      <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl overflow-hidden ring-4 ring-white/30">
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displaySrc} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center text-white text-4xl font-black">
            {initials}
          </div>
        )}
        <button onClick={() => { setOpen(true); setTab('file'); }}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1.5">
          <Camera className="h-7 w-7 text-white drop-shadow" />
          <span className="text-white text-xs font-bold tracking-wide">Change Photo</span>
        </button>
      </div>
      <button onClick={() => { setOpen(true); setTab('file'); }}
        className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-full bg-blue-600 border-3 border-white shadow-xl flex items-center justify-center hover:bg-blue-500 transition-colors">
        <Edit2 className="h-4 w-4 text-white" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 text-xl">Update Photo</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg mb-5">
              {displaySrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displaySrc} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl font-black">{initials}</div>
              )}
            </div>

            <div className="flex gap-1.5 mb-5 bg-gray-100 p-1 rounded-2xl">
              {(['file', 'url'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                  {t === 'file' ? '📁 Upload' : '🔗 URL'}
                </button>
              ))}
            </div>

            {tab === 'file' ? (
              <div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
                <button onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all group/upload">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-3 group-hover/upload:bg-blue-200 transition-colors">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Click to upload photo</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Max 2 MB</p>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input type="url" placeholder="https://example.com/photo.jpg"
                  value={urlVal}
                  onChange={e => { setUrlVal(e.target.value); if (e.target.value) setPreview(e.target.value); else setPreview(current ?? null); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-400">Paste a direct link to your profile photo</p>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleSave} disabled={uploading || (!displaySrc && !urlVal)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function WorkerProfilePage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [allSkills, setAllSkills] = useState<{ id: string; name: string; icon?: string; category: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('basic');
  const [editMode, setEditMode] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [addingExp, setAddingExp] = useState(false);

  /* ── Fully controlled form state (no react-hook-form) ── */
  const [form, setForm] = useState({ bio: '', city: '', state: '', pincode: '', dailyRate: '', experienceYears: '', upiId: '' });
  const [expF, setExpF] = useState({ title: '', company: '', city: '', startDate: '', endDate: '', description: '' });

  /* Skills form */
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('BEGINNER');
  const [expYears, setExpYears] = useState('0');

  useEffect(() => {
    Promise.all([workersApi.getMyProfile(), workersApi.getSkills()])
      .then(([profileRes, skillsRes]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pd = profileRes.data as any;
        setProfile(pd);
        setAllSkills(skillsRes.data ?? []);
        setForm({
          bio:             pd?.bio              ?? '',
          city:            pd?.city             ?? '',
          state:           pd?.state            ?? '',
          pincode:         pd?.pincode          ?? '',
          dailyRate:       pd?.dailyRate        != null ? String(pd.dailyRate)        : '',
          experienceYears: pd?.experienceYears  != null ? String(pd.experienceYears)  : '',
          upiId:           pd?.upiId            ?? '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        bio:             form.bio             || undefined,
        city:            form.city            || undefined,
        state:           form.state           || undefined,
        pincode:         form.pincode         || undefined,
        dailyRate:       form.dailyRate       ? Number(form.dailyRate)       : undefined,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        upiId:           form.upiId           || undefined,
      };
      const res = await workersApi.updateMyProfile(payload);
      setProfile(res.data);
      setEditMode(false);
      toast({ title: 'Profile updated!' });
    } catch { toast({ title: 'Failed to update', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const handleAvatarSave = async (avatarUrl: string) => {
    await workersApi.updateAvatar(avatarUrl);
    if (user) setUser({ ...user, avatar: avatarUrl });
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await workersApi.toggleAvailability();
      setProfile((p: WorkerProfile) => ({ ...p, availableForWork: res.data.availableForWork }));
      toast({ title: res.data.availableForWork ? 'Now Available for Work' : 'Set to Unavailable' });
    } catch { toast({ title: 'Failed to update', variant: 'destructive' }); }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;
    try {
      await workersApi.addSkill(selectedSkillId, selectedLevel, Number(expYears) || 0);
      const res = await workersApi.getMyProfile();
      setProfile(res.data);
      setAddingSkill(false);
      setSelectedSkillId('');
      setExpYears('0');
      toast({ title: 'Skill added!' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await workersApi.removeSkill(skillId);
      setProfile((p: WorkerProfile) => ({ ...p, skills: p.skills.filter((s: { skillId: string }) => s.skillId !== skillId) }));
    } catch { toast({ title: 'Failed to remove skill', variant: 'destructive' }); }
  };

  const handleAddExperience = async () => {
    if (!expF.title || !expF.company || !expF.startDate) {
      toast({ title: 'Please fill required fields', variant: 'destructive' }); return;
    }
    try {
      await workersApi.addExperience({ ...expF, isCurrent: !expF.endDate });
      const res = await workersApi.getMyProfile();
      setProfile(res.data);
      setAddingExp(false);
      setExpF({ title: '', company: '', city: '', startDate: '', endDate: '', description: '' });
      toast({ title: 'Experience added!' });
    } catch { toast({ title: 'Failed to add experience', variant: 'destructive' }); }
  };

  const handleDeleteExp = async (expId: string) => {
    try {
      await workersApi.deleteExperience(expId);
      setProfile((p: WorkerProfile) => ({ ...p, experiences: p.experiences?.filter((e: { id: string }) => e.id !== expId) }));
    } catch { toast({ title: 'Failed to delete', variant: 'destructive' }); }
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;
  const completionItems = [!!user?.phone, !!user?.email, !!profile?.city, !!profile?.bio,
    (profile?.skills?.length ?? 0) > 0, (profile?.experiences?.length ?? 0) > 0];
  const completion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  const existingSkillIds = new Set((profile?.skills ?? []).map((s: { skillId: string }) => s.skillId));
  const availableSkills = allSkills.filter(s => !existingSkillIds.has(s.id));

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-40 bg-gradient-to-r from-emerald-200 to-teal-200" />
      <div className="p-6 flex gap-5">
        <div className="w-60 shrink-0 space-y-4">
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  /* ── INPUT HELPER ── all inputs are always controlled strings */
  const inp = (field: keyof typeof form) => ({
    value: form[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value })),
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ─── HERO HEADER ─── */}
      <div className="relative bg-white shadow-sm">
        {/* Cover gradient */}
        <div className="h-44 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 overflow-hidden">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="absolute -top-16 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          {/* Avatar + name row */}
          <div className="flex items-end gap-6 -mt-16 pb-5 flex-wrap">
            <AvatarUpload current={user?.avatar} initials={initials} onSave={handleAvatarSave} />

            <div className="flex-1 min-w-0 pb-2">
              {/* Name + badges */}
              <div className="flex items-center gap-3 flex-wrap mt-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                  {user?.firstName} {user?.lastName}
                </h1>
                {profile?.availableForWork ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-500 border border-gray-200">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Unavailable
                  </span>
                )}
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {(profile?.city || profile?.state) && (
                  <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    {[profile.city, profile.state].filter(Boolean).join(', ')}
                  </span>
                )}
                {(profile?.experienceYears ?? 0) > 0 && (
                  <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    {profile.experienceYears} yrs experience
                  </span>
                )}
                {profile?.dailyRate && (
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                    <IndianRupee className="h-3.5 w-3.5 shrink-0" />
                    {Number(profile.dailyRate).toLocaleString('en-IN')}/day
                  </span>
                )}
              </div>
            </div>

            {/* Availability toggle */}
            <button onClick={handleToggleAvailability}
              className={`mb-2 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all shrink-0 ${
                profile?.availableForWork
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              {profile?.availableForWork ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              {profile?.availableForWork ? 'Mark Unavailable' : 'Mark Available'}
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-3 pb-5">
            {[
              { label: 'Rating',     val: profile?.rating ? `${Number(profile.rating).toFixed(1)}/5` : '—',                                icon: Star,        iconCls: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100' },
              { label: 'Jobs Done',  val: (profile?.totalJobsDone ?? 0).toString(),                                                        icon: TrendingUp,  iconCls: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100' },
              { label: 'Daily Rate', val: profile?.dailyRate ? formatCurrency(Number(profile.dailyRate)) : 'Not set',                       icon: IndianRupee, iconCls: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { label: 'Skills',     val: `${profile?.skills?.length ?? 0} skills`,                                                        icon: BadgeCheck,  iconCls: 'text-violet-500',  bg: 'bg-violet-50',  border: 'border-violet-100' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center gap-3`}>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Icon className={`h-5 w-5 ${s.iconCls}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{s.label}</p>
                    <p className="font-black text-gray-900 text-base truncate leading-tight">{s.val}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Profile completion */}
          <div className="mb-5 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">Profile Completeness</span>
              <span className={`text-sm font-black ${completion === 100 ? 'text-emerald-600' : completion >= 60 ? 'text-blue-600' : 'text-amber-500'}`}>{completion}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${completion === 100 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : completion >= 60 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                style={{ width: `${completion}%` }} />
            </div>
            {completion < 100 && (
              <div className="flex gap-2 mt-2.5 flex-wrap">
                {!profile?.bio && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">+ Add bio</span>}
                {(profile?.skills?.length ?? 0) === 0 && <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">+ Add skills</span>}
                {(profile?.experiences?.length ?? 0) === 0 && <span className="text-xs bg-violet-50 text-violet-600 border border-violet-200 px-2.5 py-1 rounded-full font-semibold">+ Add experience</span>}
                {!profile?.city && <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full font-semibold">+ Add city</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Two-column body ─── */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-5">

        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 space-y-4">
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button key={s.id}
                  onClick={() => { setActiveSection(s.id); setEditMode(false); setAddingSkill(false); setAddingExp(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all border-l-[3px] ${
                    active ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-700 border-emerald-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 border-transparent'
                  }`}>
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span>{s.label}</span>
                  {s.id === 'skills' && (profile?.skills?.length ?? 0) > 0 && (
                    <span className={`ml-auto text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${active ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {profile.skills.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-bold text-gray-800">Verification</span>
            </div>
            <div className="space-y-2">
              {[{ label: 'Phone', done: !!user?.phone }, { label: 'Email', done: !!user?.email }, { label: 'KYC', done: false }].map(v => (
                <div key={v.label} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${v.done ? 'bg-emerald-50 border border-emerald-100' : 'bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${v.done ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    {v.done ? <CheckCircle className="h-3 w-3 text-white" /> : <Clock className="h-3 w-3 text-gray-400" />}
                  </div>
                  <span className={`text-xs font-semibold flex-1 ${v.done ? 'text-emerald-700' : 'text-gray-400'}`}>{v.label}</span>
                  {v.done && <span className="text-[10px] text-emerald-500 font-bold">✓ Verified</span>}
                </div>
              ))}
            </div>
          </div>

          {completion < 80 && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="h-4 w-4 text-yellow-300" />
                <p className="text-xs font-black">Boost Your Profile</p>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">Complete your profile to get 3× more job matches from contractors!</p>
            </div>
          )}
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 min-w-0">

          {/* BASIC INFO */}
          {activeSection === 'basic' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                    <User className="h-[18px] w-[18px] text-white" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">Basic Information</h2>
                </div>
                {!editMode && (
                  <Button onClick={() => setEditMode(true)} variant="outline" size="sm"
                    className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl">
                    <Edit2 className="h-3.5 w-3.5" /> Edit Profile
                  </Button>
                )}
              </div>

              <div className="p-6">
                {!editMode ? (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Phone',      value: user?.phone,                                                                   icon: Phone },
                        { label: 'Email',      value: user?.email || 'Not set',                                                     icon: Mail },
                        { label: 'City',       value: profile?.city || 'Not set',                                                   icon: MapPin },
                        { label: 'State',      value: profile?.state || 'Not set',                                                  icon: MapPin },
                        { label: 'Pincode',    value: profile?.pincode || 'Not set',                                                icon: MapPin },
                        { label: 'Daily Rate', value: profile?.dailyRate ? formatCurrency(Number(profile.dailyRate)) : 'Not set',   icon: IndianRupee },
                        { label: 'Experience', value: profile?.experienceYears ? `${profile.experienceYears} years` : 'Not set',    icon: Calendar },
                        { label: 'UPI ID',     value: profile?.upiId || 'Not set',                                                 icon: CreditCard },
                      ].map(item => {
                        const ItemIcon = item.icon;
                        return (
                          <div key={item.label} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                              <ItemIcon className="h-3.5 w-3.5 text-gray-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                              <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{item.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {profile?.bio && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">About Me</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {([
                        { label: 'City',             field: 'city'            as const, placeholder: 'e.g. Mumbai',     type: 'text' },
                        { label: 'State',            field: 'state'           as const, placeholder: 'e.g. Maharashtra', type: 'text' },
                        { label: 'Pincode',          field: 'pincode'         as const, placeholder: '400001',           type: 'text' },
                        { label: 'Daily Rate (₹)',   field: 'dailyRate'       as const, placeholder: '800',              type: 'number' },
                        { label: 'Experience (yrs)', field: 'experienceYears' as const, placeholder: '5',               type: 'number' },
                        { label: 'UPI ID',           field: 'upiId'           as const, placeholder: 'name@upi',         type: 'text' },
                      ] as const).map(f => (
                        <div key={f.field}>
                          <label className="text-xs font-bold text-gray-600 block mb-1.5">{f.label}</label>
                          <input type={f.type} placeholder={f.placeholder} {...inp(f.field)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1.5">Bio / About Me</label>
                      <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                        rows={3} placeholder="Describe your skills and what makes you stand out..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveProfile} disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl px-5">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)} className="rounded-xl">
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {activeSection === 'skills' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                    <Briefcase className="h-[18px] w-[18px] text-white" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">Skills</h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  {(profile?.skills ?? []).length} added
                </span>
              </div>

              <div className="p-6 space-y-3">
                {(profile?.skills ?? []).map((ws: { id: string; skillId: string; level: string; yearsOfExperience: number; skill: { name: string; icon: string } }) => {
                  const lvl = LEVEL_CONFIG[ws.level] ?? LEVEL_CONFIG.BEGINNER;
                  return (
                    <div key={ws.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 group transition-all">
                      <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xl shrink-0">
                        {ws.skill?.icon ?? '🔧'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-bold text-gray-900 text-sm">{ws.skill?.name}</p>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${lvl.cls}`}>
                            {ws.level.charAt(0) + ws.level.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${lvl.bar}`} style={{ width: lvl.width }} />
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">{ws.yearsOfExperience}y exp</span>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveSkill(ws.skillId)}
                        className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}

                {(profile?.skills ?? []).length === 0 && !addingSkill && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-blue-200" />
                    </div>
                    <p className="text-gray-500 font-semibold">No skills added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add skills to get matched with the right jobs</p>
                  </div>
                )}

                {addingSkill ? (
                  <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-5 space-y-4">
                    <p className="text-sm font-bold text-blue-800">Add New Skill</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 font-semibold block mb-1">Select Skill</label>
                        <select value={selectedSkillId} onChange={e => setSelectedSkillId(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="">Choose a skill...</option>
                          {availableSkills.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-semibold block mb-1">Proficiency</label>
                        <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-semibold block mb-1">Years of Experience</label>
                        <input type="number" min={0} max={50}
                          value={expYears}
                          onChange={e => setExpYears(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl" onClick={handleAddSkill}>Add Skill</Button>
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setAddingSkill(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingSkill(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-semibold">
                    <Plus className="h-4 w-4" /> Add Skill
                  </button>
                )}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
                  <Award className="h-[18px] w-[18px] text-white" />
                </div>
                <h2 className="font-bold text-gray-900 text-lg">Work Experience</h2>
              </div>

              <div className="p-6 space-y-5">
                {(profile?.experiences ?? []).map((exp: { id: string; title: string; company: string; city?: string; startDate: string; endDate?: string; isCurrent: boolean; description?: string }) => (
                  <div key={exp.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shrink-0 shadow mt-0.5" />
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-violet-200 to-transparent mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-gray-900">{exp.title}</p>
                          <p className="text-sm text-gray-600 font-medium">{exp.company}</p>
                          {exp.city && <p className="text-xs text-gray-400">{exp.city}</p>}
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(exp.startDate)} — {exp.isCurrent ? <span className="text-emerald-600 font-bold">Present</span> : exp.endDate ? formatDate(exp.endDate) : ''}
                          </p>
                          {exp.description && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{exp.description}</p>}
                        </div>
                        <button onClick={() => handleDeleteExp(exp.id)}
                          className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!profile?.experiences || profile.experiences.length === 0) && !addingExp && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-violet-50 flex items-center justify-center">
                      <Award className="h-8 w-8 text-violet-200" />
                    </div>
                    <p className="text-gray-500 font-semibold">No experience added</p>
                    <p className="text-sm text-gray-400 mt-1">Showcase your work history to stand out</p>
                  </div>
                )}

                {addingExp ? (
                  <div className="border-2 border-dashed border-violet-200 bg-violet-50/30 rounded-2xl p-5 space-y-3">
                    <p className="text-sm font-bold text-violet-800">Add Work Experience</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {([
                        { label: 'Job Title *',  field: 'title'     as const, placeholder: 'e.g. Senior Mason',          type: 'text' },
                        { label: 'Company *',    field: 'company'   as const, placeholder: 'e.g. BuildRight',            type: 'text' },
                        { label: 'City',         field: 'city'      as const, placeholder: 'e.g. Mumbai',               type: 'text' },
                        { label: 'Start Date *', field: 'startDate' as const, placeholder: '',                           type: 'date' },
                      ] as const).map(f => (
                        <div key={f.field}>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                          <input type={f.type} placeholder={f.placeholder}
                            value={expF[f.field]}
                            onChange={e => setExpF(p => ({ ...p, [f.field]: e.target.value }))}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 block mb-1">End Date <span className="text-gray-400 font-normal">(leave blank if current)</span></label>
                        <input type="date" value={expF.endDate} onChange={e => setExpF(p => ({ ...p, endDate: e.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
                      <textarea value={expF.description} onChange={e => setExpF(p => ({ ...p, description: e.target.value }))}
                        rows={2} placeholder="Brief description of your role and responsibilities..."
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl" onClick={handleAddExperience}>Save Experience</Button>
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { setAddingExp(false); setExpF({ title: '', company: '', city: '', startDate: '', endDate: '', description: '' }); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingExp(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all text-sm font-semibold">
                    <Plus className="h-4 w-4" /> Add Experience
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CONTACT */}
          {activeSection === 'contact' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-sm">
                  <CreditCard className="h-[18px] w-[18px] text-white" />
                </div>
                <h2 className="font-bold text-gray-900 text-lg">Contact & Payment</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Phone',  value: user?.phone ?? 'Not set',  icon: Phone,       grad: 'from-blue-400 to-blue-500' },
                    { label: 'Email',  value: user?.email ?? 'Not set',  icon: Mail,        grad: 'from-violet-400 to-purple-500' },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...((profile as any)?.upiId ? [{ label: 'UPI ID', value: (profile as any).upiId, icon: IndianRupee, grad: 'from-emerald-400 to-teal-500' }] : []),
                  ].map(item => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.grad} flex items-center justify-center shadow-sm shrink-0`}>
                          <ItemIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                          <p className="font-bold text-gray-900 text-sm mt-0.5">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>💡 Tip:</strong> To update phone, email, or UPI ID, go to{' '}
                    <button onClick={() => setActiveSection('basic')} className="underline font-bold">Basic Info</button> → Edit Profile.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
