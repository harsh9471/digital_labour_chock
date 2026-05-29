'use client';

import React, { useEffect, useState } from 'react';
import {
  User, MapPin, Star, Briefcase, Phone, Mail, Calendar,
  Plus, Trash2, Edit2, CheckCircle, Clock, X, Save,
  CreditCard, Award, Shield,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

function SkillLevelBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    BEGINNER:     'bg-gray-100 text-gray-600',
    INTERMEDIATE: 'bg-blue-100 text-blue-700',
    ADVANCED:     'bg-purple-100 text-purple-700',
    EXPERT:       'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${map[level] ?? 'bg-gray-100 text-gray-600'}`}>
      {level.charAt(0) + level.slice(1).toLowerCase()}
    </span>
  );
}

export default function WorkerProfilePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [allSkills, setAllSkills] = useState<{ id: string; name: string; icon?: string; category: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('basic');
  const [editMode, setEditMode] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [addingExp, setAddingExp] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('BEGINNER');
  const [expYears, setExpYears] = useState(0);

  const { register, handleSubmit, reset } = useForm();
  const expForm = useForm();

  useEffect(() => {
    Promise.all([workersApi.getMyProfile(), workersApi.getSkills()])
      .then(([profileRes, skillsRes]) => {
        setProfile(profileRes.data);
        setAllSkills(skillsRes.data ?? []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pd = profileRes.data as any;
        reset({
          bio: pd?.bio ?? '', city: pd?.city ?? '', state: pd?.state ?? '',
          pincode: pd?.pincode ?? '', dailyRate: pd?.dailyRate ?? '',
          experienceYears: pd?.experienceYears ?? 0, upiId: pd?.upiId ?? '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [reset]);

  const onSaveProfile = handleSubmit(async (data) => {
    setSaving(true);
    try {
      const res = await workersApi.updateMyProfile(data);
      setProfile(res.data);
      setEditMode(false);
      toast({ title: 'Profile updated successfully!' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  });

  const handleToggleAvailability = async () => {
    try {
      const res = await workersApi.toggleAvailability();
      setProfile((p: WorkerProfile) => ({ ...p, availableForWork: res.data.availableForWork }));
      toast({ title: res.data.availableForWork ? 'You are now Available for Work' : 'Availability set to Unavailable' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update availability', variant: 'destructive' });
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;
    try {
      await workersApi.addSkill(selectedSkillId, selectedLevel, expYears);
      const res = await workersApi.getMyProfile();
      setProfile(res.data);
      setAddingSkill(false);
      setSelectedSkillId('');
      toast({ title: 'Skill added!' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to add skill';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await workersApi.removeSkill(skillId);
      setProfile((p: WorkerProfile) => ({ ...p, skills: p.skills.filter((s: { skillId: string }) => s.skillId !== skillId) }));
      toast({ title: 'Skill removed' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove skill', variant: 'destructive' });
    }
  };

  const onAddExperience = expForm.handleSubmit(async (data) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await workersApi.addExperience({ ...(data as any), isCurrent: !data.endDate });
      const res = await workersApi.getMyProfile();
      setProfile(res.data);
      setAddingExp(false);
      expForm.reset();
      toast({ title: 'Experience added!' });
    } catch {
      toast({ title: 'Error', description: 'Failed to add experience', variant: 'destructive' });
    }
  });

  const handleDeleteExp = async (expId: string) => {
    try {
      await workersApi.deleteExperience(expId);
      setProfile((p: WorkerProfile) => ({ ...p, experiences: p.experiences?.filter((e: { id: string }) => e.id !== expId) }));
      toast({ title: 'Experience deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete experience', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex gap-6">
        <div className="w-64 shrink-0 space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="flex-1 space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const existingSkillIds = new Set((profile?.skills ?? []).map((s: { skillId: string }) => s.skillId));
  const availableSkills = allSkills.filter(s => !existingSkillIds.has(s.id));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-24" />
        <div className="px-6 pb-5 max-w-6xl mx-auto">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 truncate">{profile?.city || 'City not set'}, {profile?.state || 'State'}</span>
              </div>
            </div>
            <button
              onClick={handleToggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors shrink-0 ${
                profile?.availableForWork
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {profile?.availableForWork ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              {profile?.availableForWork ? 'Available' : 'Unavailable'}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            {[
              { label: 'Rating',     value: profile?.rating ? `${Number(profile.rating).toFixed(1)}/5` : 'N/A',          icon: Star },
              { label: 'Jobs Done',  value: profile?.totalJobsDone ?? 0,                                                  icon: Briefcase },
              { label: 'Daily Rate', value: profile?.dailyRate ? formatCurrency(Number(profile.dailyRate)) : 'Not set',   icon: Calendar },
              { label: 'Experience', value: profile?.experienceYears ? `${profile.experienceYears} yrs` : 'N/A',          icon: User },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <Icon className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-base font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-6">
        {/* Sidebar nav */}
        <aside className="w-56 shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setEditMode(false); setAddingSkill(false); setAddingExp(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-l-2 ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                      : 'text-gray-600 hover:bg-gray-50 border-transparent hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-emerald-600' : 'text-gray-400'}`} />
                  {s.label}
                </button>
              );
            })}
          </nav>

          {/* Verification status card */}
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-800">Verification</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Phone', done: !!user?.phone },
                { label: 'Email', done: !!user?.email },
                { label: 'KYC',   done: false },
              ].map(v => (
                <div key={v.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${v.done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    {v.done
                      ? <CheckCircle className="h-3 w-3 text-emerald-600" />
                      : <Clock className="h-3 w-3 text-gray-400" />
                    }
                  </div>
                  <span className={v.done ? 'text-gray-700' : 'text-gray-400'}>{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content panel */}
        <main className="flex-1 min-w-0">

          {/* ── Basic Information ── */}
          {activeSection === 'basic' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Basic Information</h2>
                </div>
                {!editMode && (
                  <Button onClick={() => setEditMode(true)} variant="outline" size="sm" className="gap-2">
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                )}
              </div>

              {!editMode ? (
                <div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {[
                      { label: 'Phone',      value: user?.phone },
                      { label: 'Email',      value: user?.email || 'Not set' },
                      { label: 'City',       value: profile?.city || 'Not set' },
                      { label: 'State',      value: profile?.state || 'Not set' },
                      { label: 'Pincode',    value: profile?.pincode || 'Not set' },
                      { label: 'Daily Rate', value: profile?.dailyRate ? formatCurrency(Number(profile.dailyRate)) : 'Not set' },
                      { label: 'Experience', value: profile?.experienceYears ? `${profile.experienceYears} years` : 'Not set' },
                      { label: 'UPI ID',     value: profile?.upiId || 'Not set' },
                    ].map(item => (
                      <div key={item.label} className="flex flex-col p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{item.label}</span>
                        <span className="text-gray-900 mt-0.5 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {profile?.bio && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">About Me</span>
                      <p className="text-gray-700 text-sm mt-1 leading-relaxed">{profile.bio}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={onSaveProfile} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>City</Label><Input placeholder="e.g. Mumbai" {...register('city')} /></div>
                    <div><Label>State</Label><Input placeholder="e.g. Maharashtra" {...register('state')} /></div>
                    <div><Label>Pincode</Label><Input placeholder="400001" {...register('pincode')} /></div>
                    <div><Label>Daily Rate (₹)</Label><Input type="number" placeholder="800" {...register('dailyRate')} /></div>
                    <div><Label>Experience Years</Label><Input type="number" placeholder="5" {...register('experienceYears')} /></div>
                    <div><Label>UPI ID</Label><Input placeholder="name@upi" {...register('upiId')} /></div>
                  </div>
                  <div>
                    <Label>Bio / About Me</Label>
                    <textarea
                      {...register('bio')}
                      rows={3}
                      placeholder="Describe your skills and experience..."
                      className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" loading={saving}>
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditMode(false)}>
                      <X className="h-3.5 w-3.5" /> Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── Skills ── */}
          {activeSection === 'skills' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Skills</h2>
                <span className="ml-auto text-xs text-gray-400">{(profile?.skills ?? []).length} skills added</span>
              </div>

              <div className="space-y-3">
                {(profile?.skills ?? []).map((ws: { id: string; skillId: string; level: string; yearsOfExperience: number; skill: { name: string; icon: string } }) => (
                  <div key={ws.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-xl w-8 text-center">{ws.skill?.icon ?? '🔧'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{ws.skill?.name}</p>
                      <p className="text-xs text-gray-400">{ws.yearsOfExperience} years experience</p>
                    </div>
                    <SkillLevelBadge level={ws.level} />
                    <button onClick={() => handleRemoveSkill(ws.skillId)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors ml-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {profile?.skills?.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No skills added yet. Add your skills to get more job matches.</p>
                  </div>
                )}

                {addingSkill ? (
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-blue-800">Add New Skill</h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Select Skill</Label>
                        <select value={selectedSkillId} onChange={e => setSelectedSkillId(e.target.value)}
                          className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Choose skill...</option>
                          {availableSkills.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Level</Label>
                        <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}
                          className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Years of Experience</Label>
                        <Input type="number" min={0} value={expYears} onChange={e => setExpYears(Number(e.target.value))} className="mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddSkill}>Add Skill</Button>
                      <Button size="sm" variant="outline" onClick={() => setAddingSkill(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setAddingSkill(true)}>
                    <Plus className="h-3.5 w-3.5" /> Add Skill
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── Work Experience ── */}
          {activeSection === 'experience' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Work Experience</h2>
              </div>

              <div className="space-y-4">
                {(profile?.experiences ?? []).map((exp: { id: string; title: string; company: string; city?: string; startDate: string; endDate?: string; isCurrent: boolean; description?: string }) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-purple-200 pb-2">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500" />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{exp.title}</p>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        {exp.city && <p className="text-xs text-gray-400">{exp.city}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                        </p>
                        {exp.description && <p className="text-sm text-gray-500 mt-1">{exp.description}</p>}
                      </div>
                      <button onClick={() => handleDeleteExp(exp.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!profile?.experiences || profile.experiences.length === 0) && (
                  <div className="text-center py-10 text-gray-400">
                    <Award className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No experience added yet.</p>
                  </div>
                )}

                {addingExp ? (
                  <form onSubmit={onAddExperience} className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-blue-800">Add Experience</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div><Label className="text-xs">Job Title *</Label><Input placeholder="e.g. Senior Mason" {...expForm.register('title', { required: true })} /></div>
                      <div><Label className="text-xs">Company *</Label><Input placeholder="e.g. BuildRight Constructions" {...expForm.register('company', { required: true })} /></div>
                      <div><Label className="text-xs">City</Label><Input placeholder="e.g. Mumbai" {...expForm.register('city')} /></div>
                      <div><Label className="text-xs">Start Date *</Label><Input type="date" {...expForm.register('startDate', { required: true })} /></div>
                      <div className="sm:col-span-2"><Label className="text-xs">End Date (leave empty if current)</Label><Input type="date" {...expForm.register('endDate')} /></div>
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <textarea {...expForm.register('description')} rows={2} placeholder="Brief description of your role..."
                        className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Add Experience</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => { setAddingExp(false); expForm.reset(); }}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setAddingExp(true)}>
                    <Plus className="h-3.5 w-3.5" /> Add Experience
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── Contact & Payment ── */}
          {activeSection === 'contact' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-teal-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Contact & Payment</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-900">{user?.phone ?? 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900">{user?.email ?? 'Not set'}</p>
                  </div>
                </div>
                {profile?.upiId && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl sm:col-span-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">UPI ID</p>
                      <p className="font-semibold text-gray-900">{profile.upiId}</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-4 bg-gray-50 rounded-xl p-3">
                To update contact information or UPI ID, go to the <strong>Basic Info</strong> section and click Edit.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
