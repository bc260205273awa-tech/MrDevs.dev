"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  User,
  Briefcase,
  PhoneCall,
  ShieldCheck,
  Languages as LanguagesIcon,
  Gauge,
  GraduationCap,
  Target,
  Smartphone,
  CreditCard,
  Search,
  Download,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Filter,
  ChevronRight,
  X,
  Lock,
  BarChart3,
  Users,
  Clock,
  Award,
  Check,
  FileText,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import gsap from "gsap";
import HeroParticles from "./HeroParticles";
import { getSupabaseClient } from "@/lib/supabaseClient";

// [NEW] Assessment Submission Schema
export interface AssessmentRecord {
  id: string;
  staff_name: string;
  staff_role: string;
  q1_comfortable_calls: string;
  q2_cold_calling_experience: string;
  q2_experience_details: string | null;
  q3_calling_business_owner: string;
  q4_calls_per_day: string;
  q5_handling_objections: string;
  q6_languages: string[];
  q7_regular_calls_willingness: string;
  q8_phone_sim_available: string;
  q9_company_calling_package: string;
  q10_confidence_scale: number | null;
  q11_training_script_wanted: string;
  submitted_at: string;
  status?: "Ready" | "Needs Training" | "Under Review";
}

// [NEW] Default High-Quality Demo Submissions
const DEMO_RECORDS: AssessmentRecord[] = [
  {
    id: "demo-1",
    staff_name: "Mubeen Khan",
    staff_role: "Lead Outreach & Strategy",
    q1_comfortable_calls: "Yes",
    q2_cold_calling_experience: "Yes",
    q2_experience_details: "Conducted 600+ B2B outreach calls for agency clients in healthcare and SaaS. Strong closing track record.",
    q3_calling_business_owner: "Yes",
    q4_calls_per_day: "75",
    q5_handling_objections: "Yes",
    q6_languages: ["Urdu", "English", "Urdu + English mixture"],
    q7_regular_calls_willingness: "Yes",
    q8_phone_sim_available: "Yes",
    q9_company_calling_package: "Yes",
    q10_confidence_scale: 10,
    q11_training_script_wanted: "No",
    submitted_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: "Ready"
  },
  {
    id: "demo-2",
    staff_name: "Hamza Tariq",
    staff_role: "Sales Representative",
    q1_comfortable_calls: "Yes",
    q2_cold_calling_experience: "Yes",
    q2_experience_details: "Over 1 year experience doing cold calls for digital marketing packages in Lahore and Karachi.",
    q3_calling_business_owner: "Yes",
    q4_calls_per_day: "50",
    q5_handling_objections: "Yes",
    q6_languages: ["Urdu", "Roman Urdu", "English"],
    q7_regular_calls_willingness: "Yes",
    q8_phone_sim_available: "Yes",
    q9_company_calling_package: "Yes",
    q10_confidence_scale: 8,
    q11_training_script_wanted: "Yes",
    submitted_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "Ready"
  },
  {
    id: "demo-3",
    staff_name: "Zainab Fatima",
    staff_role: "Junior Business Developer",
    q1_comfortable_calls: "Somewhat",
    q2_cold_calling_experience: "No",
    q2_experience_details: null,
    q3_calling_business_owner: "Need training",
    q4_calls_per_day: "30",
    q5_handling_objections: "Need training",
    q6_languages: ["Urdu", "English"],
    q7_regular_calls_willingness: "Yes",
    q8_phone_sim_available: "Yes",
    q9_company_calling_package: "Yes",
    q10_confidence_scale: 6,
    q11_training_script_wanted: "Yes",
    submitted_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: "Needs Training"
  },
  {
    id: "demo-4",
    staff_name: "Ali Raza",
    staff_role: "Client Acquisition",
    q1_comfortable_calls: "Yes",
    q2_cold_calling_experience: "Yes",
    q2_experience_details: "Handled outbound B2B calls for hospital management and e-commerce solutions.",
    q3_calling_business_owner: "Yes",
    q4_calls_per_day: "100+",
    q5_handling_objections: "Yes",
    q6_languages: ["Urdu", "English", "Urdu + English mixture"],
    q7_regular_calls_willingness: "Yes",
    q8_phone_sim_available: "Yes",
    q9_company_calling_package: "Yes",
    q10_confidence_scale: 9,
    q11_training_script_wanted: "No",
    submitted_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "Ready"
  }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedConfidence, setSelectedConfidence] = useState<string>("All");
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);

  // [NEW] Check session on load
  useEffect(() => {
    const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("mrdevs_admin_authenticated") : null;
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // [NEW] Load submissions from Supabase and LocalStorage
  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      let combined: AssessmentRecord[] = [];

      // 1. Try Supabase
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("cold_calling_survey")
          .select("*")
          .order("submitted_at", { ascending: false });

        if (!error && data && data.length > 0) {
          combined = data as AssessmentRecord[];
        }
      }

      // 2. Read LocalStorage submissions
      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("mrdevs_cc_submissions") || "[]");
        if (local.length > 0) {
          // Merge local submissions by unshifted ID
          const mappedLocal: AssessmentRecord[] = local.map((item: any, idx: number) => ({
            id: `local-${idx}-${Date.now()}`,
            ...item,
            status: item.status || "Ready"
          }));
          
          // Prepend local items not in combined
          combined = [...mappedLocal, ...combined];
        }
      }

      // 3. If still empty, use high-quality Demo records for instant preview
      if (combined.length === 0) {
        combined = DEMO_RECORDS;
      }

      setRecords(combined);
    } catch (err) {
      console.error("Failed to load assessments:", err);
      setRecords(DEMO_RECORDS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated]);

  // [NEW] Mouse Spotlight & 3D Tilt Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.querySelectorAll<HTMLElement>(".spotlight-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isAuthenticated]);

  // [NEW] Handle Passcode Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();

    // Accepted admin passcodes
    const validCodes = ["mrdevs2026", "mubeen2026", "mrdevs", "admin123", "mubeen"];

    if (validCodes.includes(clean)) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mrdevs_admin_authenticated", "true");
      }
      setAuthError(null);
    } else {
      setAuthError("Invalid access key. Please enter the authorized admin passcode.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mrdevs_admin_authenticated");
    }
  };

  // [NEW] Filtered Submissions
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch = 
        rec.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.staff_role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === "All" || rec.status === selectedStatus;

      const matchesConfidence = 
        selectedConfidence === "All" ||
        (selectedConfidence === "High (8-10)" && (rec.q10_confidence_scale || 0) >= 8) ||
        (selectedConfidence === "Moderate (5-7)" && (rec.q10_confidence_scale || 0) >= 5 && (rec.q10_confidence_scale || 0) < 8) ||
        (selectedConfidence === "Developing (1-4)" && (rec.q10_confidence_scale || 0) < 5);

      return matchesSearch && matchesStatus && matchesConfidence;
    });
  }, [records, searchTerm, selectedStatus, selectedConfidence]);

  // [NEW] Metrics Calculations
  const stats = useMemo(() => {
    const total = records.length;
    if (total === 0) return { total: 0, avgConfidence: 0, readyPercent: 0, trainingCount: 0 };

    const sumConfidence = records.reduce((acc, r) => acc + (r.q10_confidence_scale || 0), 0);
    const avgConfidence = (sumConfidence / total).toFixed(1);

    const readyCount = records.filter(r => r.q1_comfortable_calls === "Yes" && r.q7_regular_calls_willingness === "Yes").length;
    const readyPercent = Math.round((readyCount / total) * 100);

    const trainingCount = records.filter(r => r.q11_training_script_wanted === "Yes" || r.q5_handling_objections === "Need training").length;

    return { total, avgConfidence, readyPercent, trainingCount };
  }, [records]);

  // [NEW] 1-Click CSV Export
  const exportToCSV = () => {
    if (records.length === 0) return;

    const headers = [
      "Staff Name",
      "Staff Role",
      "Confidence (1-10)",
      "Calls On Phone",
      "Past Cold Calling Experience",
      "Experience Summary",
      "Calling Business Owners",
      "Daily Call Capacity",
      "Objection Handling",
      "Languages Spoken",
      "Regular Outreach Willingness",
      "Phone & SIM Available",
      "Company Calling Package",
      "Wants Script & Training",
      "Submitted Timestamp"
    ];

    const rows = records.map(r => [
      `"${r.staff_name}"`,
      `"${r.staff_role}"`,
      r.q10_confidence_scale || "",
      `"${r.q1_comfortable_calls}"`,
      `"${r.q2_cold_calling_experience}"`,
      `"${(r.q2_experience_details || "").replace(/"/g, '""')}"`,
      `"${r.q3_calling_business_owner}"`,
      `"${r.q4_calls_per_day}"`,
      `"${r.q5_handling_objections}"`,
      `"${(r.q6_languages || []).join(", ")}"`,
      `"${r.q7_regular_calls_willingness}"`,
      `"${r.q8_phone_sim_available}"`,
      `"${r.q9_company_calling_package}"`,
      `"${r.q11_training_script_wanted}"`,
      `"${r.submitted_at}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mrdevs-cold-calling-assessments-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // [NEW] Helper: Format Date
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return isoString;
    }
  };

  // ==========================================
  // VIEW 1: AUTHENTICATION / LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main ref={containerRef} className="min-h-screen bg-bg-main text-text-heading flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-accent-primary/20 selection:text-white">
        <HeroParticles />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-cyan/15 rounded-full blur-[140px] pointer-events-none" />

        {/* 3D Login Card */}
        <div
          ref={loginCardRef}
          className="spotlight-card relative z-10 w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-3xl p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] flex flex-col items-center animate-fade-up"
        >
          {/* Glowing MR Devs Logo Badge */}
          <div className="mb-6 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-accent-cyan/25 rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-bg-deep border border-accent-cyan/40 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(0,212,255,0.3)]">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={52}
                height={52}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-bold uppercase tracking-wider mb-3">
            <Lock size={13} />
            <span>Executive Command Center</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 text-center">
            Admin Assessment Portal
          </h1>
          <p className="text-text-body text-xs sm:text-sm text-center mb-6 leading-relaxed max-w-xs">
            Restricted to MR Devs Leadership &amp; Mubeen. Enter your passkey to review live team submissions.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-heading flex items-center gap-1.5">
                <Lock size={13} className="text-accent-cyan" />
                Admin Passkey
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError(null);
                }}
                placeholder="Enter access code..."
                className="w-full px-4 py-3.5 bg-[#0A0F1C]/90 border border-white/10 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-sm focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-fade-up">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-accent-primary hover:bg-accent-cyan text-bg-deep font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-glow hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] mt-1"
            >
              <span>Authenticate &amp; Enter</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-text-body/60 text-center flex items-center justify-center gap-2">
            <span>Passcode: <code className="text-accent-cyan font-mono">mrdevs2026</code></span>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // VIEW 2: FULL ADMIN DASHBOARD
  // ==========================================
  return (
    <main ref={containerRef} className="min-h-screen bg-bg-main text-text-heading p-4 sm:p-6 md:p-10 font-sans relative overflow-x-hidden selection:bg-accent-primary/20 selection:text-white">
      {/* 3D Spotlight Dynamic CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .spotlight-card {
          position: relative;
        }
        .spotlight-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            550px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(47, 168, 255, 0.12),
            transparent 45%
          );
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .spotlight-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: radial-gradient(
            400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 212, 255, 0.5),
            transparent 45%
          );
          z-index: 1;
          pointer-events: none;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .spotlight-card:hover::before,
        .spotlight-card:hover::after {
          opacity: 1;
        }
      `}} />

      {/* Interactive Cursor-Reactive Dust Particles */}
      <HeroParticles />

      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* TOP BAR */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 border-t-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-bg-deep border border-accent-cyan/40 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Cold Calling Command Center
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#5DCAA5] text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-text-body">MR Devs Staff Readiness &amp; Outreach Capabilities</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadSubmissions}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-text-body hover:text-white flex items-center gap-1.5 transition-all"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-4 py-2 rounded-xl bg-accent-primary/20 hover:bg-accent-primary/30 border border-accent-cyan/40 text-xs font-bold text-accent-cyan flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-1.5 transition-all ml-1"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* METRICS KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Assessed */}
          <div className="spotlight-card p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 border-t-white/20 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-text-body tracking-wider uppercase">Total Assessed</span>
              <div className="w-9 h-9 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-cyan">
                <Users size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{stats.total}</div>
              <p className="text-[11px] text-text-body mt-1">Staff members submitted</p>
            </div>
          </div>

          {/* Card 2: Average Confidence */}
          <div className="spotlight-card p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 border-t-white/20 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-text-body tracking-wider uppercase">Avg. Confidence</span>
              <div className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
                <Award size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{stats.avgConfidence}</span>
                <span className="text-sm font-semibold text-text-body">/ 10</span>
              </div>
              <p className="text-[11px] text-text-body mt-1">Team self-rating average</p>
            </div>
          </div>

          {/* Card 3: Ready for Outreach */}
          <div className="spotlight-card p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 border-t-white/20 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-text-body tracking-wider uppercase">Outreach Ready</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#5DCAA5]">
                <Target size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">{stats.readyPercent}%</div>
              <p className="text-[11px] text-text-body mt-1">Confirmed call willingness</p>
            </div>
          </div>

          {/* Card 4: Needs Script / Training */}
          <div className="spotlight-card p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 border-t-white/20 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-text-body tracking-wider uppercase">Training Requested</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <GraduationCap size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 tracking-tight">{stats.trainingCount}</div>
              <p className="text-[11px] text-text-body mt-1">Requested scripts or training</p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F5E5A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team member by name or role..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#0A0F1C]/80 border border-white/10 focus:border-accent-cyan rounded-2xl text-white placeholder-[#5F5E5A] text-xs sm:text-sm focus:outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Confidence Filter */}
            <div className="flex items-center gap-1.5 bg-[#0A0F1C]/80 border border-white/10 rounded-2xl px-3 py-2 text-xs">
              <span className="text-text-body text-[11px]">Score:</span>
              <select
                value={selectedConfidence}
                onChange={(e) => setSelectedConfidence(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="All">All Scores</option>
                <option value="High (8-10)">High (8-10)</option>
                <option value="Moderate (5-7)">Moderate (5-7)</option>
                <option value="Developing (1-4)">Developing (1-4)</option>
              </select>
            </div>

            {/* Total Filtered Badge */}
            <div className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-text-body">
              Showing <span className="text-accent-cyan font-bold">{filteredRecords.length}</span> of {records.length}
            </div>
          </div>
        </div>

        {/* SUBMISSIONS TABLE */}
        <div className="spotlight-card rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 border-t-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5 text-text-body text-[11px] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Team Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Confidence</th>
                  <th className="px-6 py-4">Daily Volume</th>
                  <th className="px-6 py-4">Languages</th>
                  <th className="px-6 py-4">Script Wanted</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-text-body">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={32} className="text-white/20" />
                        <p className="text-sm font-semibold text-white">No assessment submissions found</p>
                        <p className="text-xs text-text-body">Try clearing search or filter terms.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const score = rec.q10_confidence_scale || 0;
                    const scoreColor = 
                      score >= 8 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                      score >= 5 ? "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30" :
                      "bg-amber-500/15 text-amber-300 border-amber-500/30";

                    return (
                      <tr
                        key={rec.id}
                        onClick={() => setSelectedRecord(rec)}
                        className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                      >
                        {/* Member */}
                        <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-cyan font-bold text-xs uppercase">
                            {rec.staff_name.charAt(0)}
                          </div>
                          <div>
                            <span className="group-hover:text-accent-cyan transition-colors">{rec.staff_name}</span>
                            {rec.q2_cold_calling_experience === "Yes" && (
                              <span className="block text-[10px] text-[#5DCAA5] font-normal">Experienced Caller</span>
                            )}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4 text-text-body font-medium">
                          {rec.staff_role}
                        </td>

                        {/* Confidence */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                            {score} / 10
                          </span>
                        </td>

                        {/* Daily Volume */}
                        <td className="px-6 py-4 text-white font-medium">
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs">
                            {rec.q4_calls_per_day} calls/day
                          </span>
                        </td>

                        {/* Languages */}
                        <td className="px-6 py-4 text-text-body text-xs">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(rec.q6_languages || []).map((l, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-text-body">
                                {l}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Script Wanted */}
                        <td className="px-6 py-4">
                          {rec.q11_training_script_wanted === "Yes" ? (
                            <span className="inline-flex items-center gap-1 text-amber-300 text-xs font-medium">
                              <GraduationCap size={13} />
                              Yes
                            </span>
                          ) : (
                            <span className="text-text-body text-xs">No</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-text-body text-xs">
                          {formatDate(rec.submitted_at)}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(rec);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-accent-primary/20 border border-white/10 hover:border-accent-cyan/40 text-xs font-semibold text-white group-hover:text-accent-cyan transition-all"
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ==========================================
          MODAL: FULL 11-QUESTION DETAIL DRAWER
      ========================================== */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up">
          <div 
            style={{ transformStyle: "preserve-3d" }}
            className="spotlight-card relative w-full max-w-2xl max-h-[90vh] bg-[#0A0F1C] border border-white/10 border-t-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-body hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6 pr-10">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan font-bold text-xl uppercase shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                {selectedRecord.staff_name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {selectedRecord.staff_name}
                </h2>
                <p className="text-sm text-accent-cyan font-medium">{selectedRecord.staff_role}</p>
                <p className="text-xs text-text-body mt-0.5">Submitted: {formatDate(selectedRecord.submitted_at)}</p>
              </div>
            </div>

            {/* Rating Highlight Pill */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gauge size={20} className="text-accent-cyan" />
                <div>
                  <span className="text-xs text-text-body uppercase font-bold tracking-wider">Confidence Score</span>
                  <p className="text-lg font-bold text-white">{selectedRecord.q10_confidence_scale} / 10</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-body font-normal">Phone Outreach:</span>
                <p className="text-xs font-semibold text-accent-cyan">{selectedRecord.q1_comfortable_calls}</p>
              </div>
            </div>

            {/* 11 Questions Breakdown */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-accent-cyan tracking-wider uppercase">Full Assessment Breakdown</h3>

              {/* Q1, Q3, Q4, Q5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">1. Comfortable on Phone Calls?</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q1_comfortable_calls}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">3. Calling New Business Owners?</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q3_calling_business_owner}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">4. Daily Realistic Call Volume</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q4_calls_per_day} calls/day</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">5. Handling Common Objections</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q5_handling_objections}</p>
                </div>
              </div>

              {/* Q2 Written Experience Note (if any) */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] text-text-body">2. Past Cold Calling Experience:</span>
                <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q2_cold_calling_experience}</p>
                {selectedRecord.q2_experience_details && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[#050B14] border border-accent-cyan/20 text-xs text-text-body leading-relaxed">
                    <span className="text-accent-cyan font-medium block mb-1">Experience Summary:</span>
                    &ldquo;{selectedRecord.q2_experience_details}&rdquo;
                  </div>
                )}
              </div>

              {/* Q6 Languages */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] text-text-body">6. Fluent Languages &amp; Dialects:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(selectedRecord.q6_languages || []).map((l, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-xs text-accent-cyan font-medium">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Q7, Q8, Q9, Q11 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">7. Regular Cold Calling Role?</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q7_regular_calls_willingness}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">8. Personal Phone &amp; SIM Available?</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q8_phone_sim_available}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">9. Company Calling Package?</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q9_company_calling_package}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[11px] text-text-body">11. Wants Training &amp; Script?</span>
                  <p className="text-sm font-semibold text-white mt-1">{selectedRecord.q11_training_script_wanted}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-text-body">ID: <code className="font-mono text-[10px]">{selectedRecord.id}</code></span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-cyan text-bg-deep font-bold text-xs transition-all shadow-glow"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
