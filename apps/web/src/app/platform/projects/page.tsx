import Link from 'next/link';
import {
  ArrowRight, MapPin, Users, IndianRupee, Building2,
  CheckCircle2, Clock, TrendingUp, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavActions from '@/components/home/NavActions';

const projects = [
  {
    id: '1',
    name: 'BKC Tower A — Premium Offices',
    location: 'Bandra Kurla Complex, Mumbai',
    city: 'Mumbai',
    status: 'ACTIVE',
    budget: '₹2.5 Cr – ₹4 Cr',
    workers: 85,
    contractor: 'Mehta Construction Pvt. Ltd.',
    category: 'Commercial',
    skills: ['Masonry', 'Electrical', 'Plumbing'],
    duration: '8 months',
    gradient: 'from-blue-500 to-indigo-600',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: '2',
    name: 'Whitefield IT Park — Phase 2',
    location: 'Whitefield, Bangalore',
    city: 'Bangalore',
    status: 'HIRING',
    budget: '₹5 Cr – ₹8 Cr',
    workers: 120,
    contractor: 'Prestige Construction',
    category: 'Commercial',
    skills: ['Construction', 'Carpentry', 'Painting'],
    duration: '12 months',
    gradient: 'from-purple-500 to-violet-600',
    statusColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: '3',
    name: 'Andheri Residential Complex',
    location: 'Andheri West, Mumbai',
    city: 'Mumbai',
    status: 'ACTIVE',
    budget: '₹1.8 Cr – ₹3 Cr',
    workers: 60,
    contractor: 'Sharma Builders',
    category: 'Residential',
    skills: ['Masonry', 'Painting', 'Plumbing'],
    duration: '6 months',
    gradient: 'from-emerald-500 to-teal-600',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: '4',
    name: 'CP Office Renovation',
    location: 'Connaught Place, Delhi',
    city: 'Delhi',
    status: 'HIRING',
    budget: '₹80 L – ₹1.5 Cr',
    workers: 35,
    contractor: 'Delhi Infra Works',
    category: 'Renovation',
    skills: ['Carpentry', 'Electrical', 'Painting'],
    duration: '3 months',
    gradient: 'from-orange-500 to-amber-600',
    statusColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: '5',
    name: 'Gachibowli Commercial Tower',
    location: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    status: 'ACTIVE',
    budget: '₹3.5 Cr – ₹6 Cr',
    workers: 95,
    contractor: 'Hyderabad Infra Corp',
    category: 'Commercial',
    skills: ['Construction', 'Welding', 'Electrical'],
    duration: '10 months',
    gradient: 'from-rose-500 to-pink-600',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: '6',
    name: 'OMR Road Housing Project',
    location: 'OMR Road, Chennai',
    city: 'Chennai',
    status: 'HIRING',
    budget: '₹2 Cr – ₹4.5 Cr',
    workers: 75,
    contractor: 'Tamil Nadu Realty Group',
    category: 'Residential',
    skills: ['Masonry', 'Plumbing', 'Carpentry'],
    duration: '9 months',
    gradient: 'from-teal-500 to-cyan-600',
    statusColor: 'bg-blue-100 text-blue-800',
  },
];

const cities = ['All Cities', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai'];
const statuses = ['All Status', 'ACTIVE', 'HIRING'];

const stats = [
  { val: '200+', label: 'Active Projects' },
  { val: '12,500+', label: 'Workers Deployed' },
  { val: '₹450 Cr+', label: 'Project Value' },
  { val: '50+', label: 'Cities Covered' },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              Digital Labour <span className="text-blue-600">Chowk</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/business', label: 'Business' },
              { href: '/platform/workers', label: 'Workers' },
              { href: '/platform/projects', label: 'Projects' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <NavActions />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, #60a5fa 0%, transparent 50%)' }} />
        <div className="relative container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium mb-6 backdrop-blur-md">
            <TrendingUp className="h-4 w-4" /> Live Project Updates
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Active Projects
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Across India
            </span>
          </h1>
          <p className="text-lg text-blue-100/80 mb-10 max-w-2xl mx-auto">
            Discover live construction projects actively hiring skilled workers. Apply directly to projects in your city and start working today.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ val, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-xs text-blue-300 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="py-6 px-4 bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Filter className="h-4 w-4" /> Filter by:
            </div>
            <div className="flex gap-2 flex-wrap">
              {cities.map((city) => (
                <button
                  key={city}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${city === 'All Cities' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'}`}
                >
                  {city}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${s === 'All Status' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
              <p className="text-gray-500 text-sm mt-0.5">Showing 6 of 200+ active projects</p>
            </div>
            <Link href="/register?role=CONTRACTOR">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-xl font-bold shadow-sm">
                Post a Project <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
                {/* Card Header */}
                <div className={`h-36 bg-gradient-to-br ${project.gradient} relative p-5 flex flex-col justify-between`}>
                  <div className="flex items-start justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${project.statusColor}`}>
                      {project.status === 'HIRING' ? '🔥 Actively Hiring' : '✅ In Progress'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                      {project.category}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg leading-tight line-clamp-2">{project.name}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <IndianRupee className="h-3 w-3" /> Budget
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{project.budget}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Users className="h-3 w-3" /> Workers
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{project.workers} needed</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Clock className="h-3 w-3" /> Duration
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{project.duration}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Building2 className="h-3 w-3" /> Contractor
                      </div>
                      <p className="font-bold text-gray-900 text-xs truncate">{project.contractor}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link href="/register?role=WORKER" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold py-2.5 gap-2 transition-all group-hover:shadow-md">
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-10">
            <Button variant="outline" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 gap-2 px-8 py-4 rounded-full font-bold">
              Load More Projects <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── For Contractors ── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 50%)' }} />
            <div className="relative md:flex items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Have a Project? Post It Today
                </h2>
                <p className="text-blue-200 text-lg mb-6 md:mb-0 max-w-lg">
                  Connect with 2.5 Lakh+ verified skilled workers. Post your project requirements and start receiving applications within minutes.
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  {['Free to post', 'Verified workers only', 'Direct communication', 'Digital contracts'].map(t => (
                    <span key={t} className="flex items-center gap-1.5 text-blue-100 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 mt-6 md:mt-0">
                <Link href="/register?role=CONTRACTOR">
                  <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 px-8 py-5 rounded-full text-lg shadow-xl transition-transform hover:scale-105 whitespace-nowrap">
                    Post Your Project <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DL</span>
              </div>
              <span className="font-bold text-white">Digital Labour Chowk</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/business', label: 'Business' }, { href: '/platform/workers', label: 'Workers' }].map(l => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p>© 2026 Digital Labour Chowk. All rights reserved.</p>
            <p className="text-gray-600">Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
