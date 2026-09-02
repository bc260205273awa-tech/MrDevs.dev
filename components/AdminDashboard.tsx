"use client";

import { useState, useEffect, useMemo } from "react";
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
  ChevronRight,
  X,
  Lock,
  Users,
  Award,
  Calendar,
  Activity,
  TrendingUp,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { getFirebaseDb } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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
  const [selectedConfidence, setSelectedConfidence] = useState<string>("All");
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  // Check saved session
  useEffect(() => {
    const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("mrdevs_admin_authenticated") : null;
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load submissions
  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      let combined: AssessmentRecord[] = [];

      // 1. Try Firebase Firestore
      const db = getFirebaseDb();
      if (db) {
        try {
          const q = query(collection(db, "cold_calling_survey"), orderBy("submitted_at", "desc"));
          const querySnapshot = await getDocs(q);
          const fbRecords: AssessmentRecord[] = [];
          querySnapshot.forEach((doc) => {
            fbRecords.push({
              id: doc.id,
              ...(doc.data() as any),
            });
          });
          if (fbRecords.length > 0) {
            combined = fbRecords;
          }
        } catch (fbErr) {
          console.warn("Firebase query notice:", fbErr);
        }
      }

      // 2. Try Supabase if no Firebase records
      if (combined.length === 0) {
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
      }

      // 3. Read LocalStorage submissions only as fallback if cloud has no records
      if (combined.length === 0 && typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("mrdevs_cc_submissions") || "[]");
        if (local.length > 0) {
          const mappedLocal: AssessmentRecord[] = local.map((item: any, idx: number) => ({
            id: `local-${idx}-${Date.now()}`,
            ...item,
            status: item.status || "Ready"
          }));
          combined = mappedLocal;
        }
      }

      // Deduplicate records to ensure no duplicate cards appear
      const uniqueMap = new Map<string, AssessmentRecord>();
      combined.forEach((rec) => {
        const key = `${rec.staff_name.toLowerCase().trim()}_${rec.submitted_at || rec.id}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, rec);
        }
      });
      combined = Array.from(uniqueMap.values());

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

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();
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

  // Zero-overhead 3D Tilt handlers on mouse move over individual card
  const handleTiltMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
  };

  const handleTiltMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
  };

  // Memoized Search & Filter
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch = 
        rec.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.staff_role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesConfidence = 
        selectedConfidence === "All" ||
        (selectedConfidence === "High (8-10)" && (rec.q10_confidence_scale || 0) >= 8) ||
        (selectedConfidence === "Moderate (5-7)" && (rec.q10_confidence_scale || 0) >= 5 && (rec.q10_confidence_scale || 0) < 8) ||
        (selectedConfidence === "Developing (1-4)" && (rec.q10_confidence_scale || 0) < 5);

      return matchesSearch && matchesConfidence;
    });
  }, [records, searchTerm, selectedConfidence]);

  // Metrics
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

  // 1-Click CSV Export
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

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return isoString;
    }
  };

  // Helper for confidence badge colors
  const getScoreBadge = (score: number) => {
    if (score >= 8) {
      return {
        bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        label: `${score} / 10`
      };
    }
    if (score >= 5) {
      return {
        bg: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30 shadow-[0_0_12px_rgba(0,212,255,0.2)]",
        label: `${score} / 10`
      };
    }
    return {
      bg: "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
      label: `${score} / 10`
    };
  };

  // ==========================================
  // VIEW 1: AUTHENTICATION / LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#060a12] text-text-heading flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(47, 168, 255, 0.25) 1px, transparent 1px)",
            backgroundSize: "36px 36px"
          }}
        />

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-accent-primary/20 to-accent-cyan/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-[110px] pointer-events-none" />

        {/* 3D Glass Login Card */}
        <div
          onMouseMove={handleTiltMouseMove}
          onMouseLeave={handleTiltMouseLeave}
          style={{ transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease" }}
          className="relative z-10 w-full max-w-md bg-[#0c1424]/90 backdrop-blur-xl border border-white/15 border-t-white/30 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col items-center"
        >
          {/* Logo Badge */}
          <div className="mb-5 sm:mb-6 relative flex items-center justify-center group">
            <div className="absolute inset-0 bg-accent-cyan/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-[#040810] border border-accent-cyan/50 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(0,212,255,0.35)]">
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

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Lock size={12} />
            <span>Executive Command Center</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1.5 text-center">
            Admin Assessment Portal
          </h1>
          <p className="text-text-body text-xs sm:text-sm text-center mb-5 sm:mb-6 leading-relaxed max-w-xs">
            Restricted to MR Devs Leadership &amp; Mubeen. Enter your passkey to review team submissions.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3.5">
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
                className="w-full px-4 py-3 bg-[#040810] border border-white/15 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-primary to-accent-cyan text-[#040A14] font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(47,168,255,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] hover:scale-[1.02] active:scale-[0.98] mt-1"
            >
              <span>Authenticate &amp; Enter</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="mt-5 pt-3.5 border-t border-white/5 text-[11px] text-text-body/60 text-center flex items-center justify-center gap-2">
            <span>Passcode: <code className="text-accent-cyan font-mono font-bold bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/20">mrdevs2026</code></span>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // VIEW 2: FULL ADMIN DASHBOARD
  // ==========================================
  return (
    <main className="min-h-screen bg-[#060a12] text-text-heading p-3.5 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      {/* Cyber Grid Texture */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(47, 168, 255, 0.25) 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }}
      />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6 relative z-10">
        
        {/* TOP BAR */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0c1424]/90 backdrop-blur-xl border border-white/10 border-t-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#040810] border border-accent-cyan/40 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,212,255,0.3)] shrink-0">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                  Cold Calling Command Center
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#5DCAA5] text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-text-body mt-0.5">MR Devs Staff Readiness &amp; Outreach Capabilities</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={loadSubmissions}
              className="px-3 py-2 rounded-xl bg-[#040810] hover:bg-[#101b30] border border-white/10 text-xs font-semibold text-text-body hover:text-white flex items-center gap-1.5 transition-all shadow hover:border-white/20"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 rounded-xl bg-accent-primary/20 hover:bg-accent-primary/30 border border-accent-cyan/40 text-xs font-bold text-accent-cyan flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,212,255,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-1.5 transition-all ml-1"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* METRICS KPI GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Assessed */}
          <div
            onMouseMove={handleTiltMouseMove}
            onMouseLeave={handleTiltMouseLeave}
            style={{ transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease" }}
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0c1424]/90 backdrop-blur-xl border border-white/10 border-t-white/20 shadow-md flex flex-col justify-between hover:border-accent-primary/40 group cursor-default"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold text-text-body tracking-wider uppercase">Total Assessed</span>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                <Users size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{stats.total}</div>
              <p className="text-[10px] sm:text-xs text-text-body mt-0.5 sm:mt-1 flex items-center gap-1 font-medium truncate">
                <Activity size={11} className="text-accent-cyan shrink-0" />
                Staff members
              </p>
            </div>
          </div>

          {/* Card 2: Average Confidence */}
          <div
            onMouseMove={handleTiltMouseMove}
            onMouseLeave={handleTiltMouseLeave}
            style={{ transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease" }}
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0c1424]/90 backdrop-blur-xl border border-white/10 border-t-white/20 shadow-md flex flex-col justify-between hover:border-accent-cyan/40 group cursor-default"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold text-text-body tracking-wider uppercase">Avg. Confidence</span>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                <Award size={16} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{stats.avgConfidence}</span>
                <span className="text-xs sm:text-sm font-semibold text-text-body">/ 10</span>
              </div>
              <p className="text-[10px] sm:text-xs text-text-body mt-0.5 sm:mt-1 flex items-center gap-1 font-medium truncate">
                <TrendingUp size={11} className="text-accent-cyan shrink-0" />
                Team avg score
              </p>
            </div>
          </div>

          {/* Card 3: Ready for Outreach */}
          <div
            onMouseMove={handleTiltMouseMove}
            onMouseLeave={handleTiltMouseLeave}
            style={{ transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease" }}
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0c1424]/90 backdrop-blur-xl border border-white/10 border-t-white/20 shadow-md flex flex-col justify-between hover:border-emerald-500/40 group cursor-default"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold text-text-body tracking-wider uppercase">Outreach Ready</span>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#5DCAA5] group-hover:scale-110 transition-transform">
                <Target size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">{stats.readyPercent}%</div>
              <p className="text-[10px] sm:text-xs text-text-body mt-0.5 sm:mt-1 flex items-center gap-1 font-medium truncate">
                <Flame size={11} className="text-emerald-400 shrink-0" />
                Call willingness
              </p>
            </div>
          </div>

          {/* Card 4: Needs Script / Training */}
          <div
            onMouseMove={handleTiltMouseMove}
            onMouseLeave={handleTiltMouseLeave}
            style={{ transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease" }}
            className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0c1424]/90 backdrop-blur-xl border border-white/10 border-t-white/20 shadow-md flex flex-col justify-between hover:border-amber-500/40 group cursor-default"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold text-text-body tracking-wider uppercase">Training Needed</span>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <GraduationCap size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-300 tracking-tight">{stats.trainingCount}</div>
              <p className="text-[10px] sm:text-xs text-text-body mt-0.5 sm:mt-1 flex items-center gap-1 font-medium truncate">
                <Sparkles size={11} className="text-amber-400 shrink-0" />
                Scripts requested
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#0c1424]/90 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F5E5A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team member by name or role..."
              className="w-full pl-10 pr-4 py-2 bg-[#040810] border border-white/10 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-xs sm:text-sm focus:outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="flex items-center gap-1.5 bg-[#040810] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-text-body text-[11px] font-medium">Score:</span>
              <select
                value={selectedConfidence}
                onChange={(e) => setSelectedConfidence(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="All">All Scores</option>
                <option value="High (8-10)">High (8-10)</option>
                <option value="Moderate (5-7)">Moderate (5-7)</option>
                <option value="Developing (1-4)">Developing (1-4)</option>
              </select>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#040810] border border-white/10 text-xs font-semibold text-text-body whitespace-nowrap">
              Showing <span className="text-accent-cyan font-bold">{filteredRecords.length}</span> of {records.length}
            </div>
          </div>
        </div>

        {/* ==========================================
            MOBILE FEED VIEW (Visible on < md screens)
        ========================================== */}
        <div className="flex flex-col gap-3 md:hidden">
          {filteredRecords.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0c1424]/90 border border-white/10 text-center text-text-body">
              <Users size={28} className="mx-auto mb-2 text-white/20" />
              <p className="text-sm font-semibold text-white">No submissions found</p>
              <p className="text-xs text-text-body">Try clearing your search or filter.</p>
            </div>
          ) : (
            filteredRecords.map((rec) => {
              const badge = getScoreBadge(rec.q10_confidence_scale || 0);

              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className="p-4 rounded-2xl bg-[#0c1424]/95 border border-white/10 shadow-lg flex flex-col gap-3 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {/* Top: Avatar, Name, Role, Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-cyan font-bold text-sm uppercase shrink-0">
                        {rec.staff_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm truncate">{rec.staff_name}</h3>
                        <p className="text-xs text-text-body truncate">{rec.staff_role}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Info Chips Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-1.5 text-text-body bg-[#040810] px-2.5 py-1.5 rounded-lg border border-white/5">
                      <PhoneCall size={12} className="text-accent-cyan shrink-0" />
                      <span className="font-semibold text-white truncate">{rec.q4_calls_per_day} calls/day</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-text-body bg-[#040810] px-2.5 py-1.5 rounded-lg border border-white/5">
                      <GraduationCap size={12} className={rec.q11_training_script_wanted === "Yes" ? "text-amber-400 shrink-0" : "text-text-body shrink-0"} />
                      <span className="truncate">
                        {rec.q11_training_script_wanted === "Yes" ? "Wants Script" : "No Script"}
                      </span>
                    </div>
                  </div>

                  {/* Languages Tags */}
                  <div className="flex flex-wrap items-center gap-1">
                    {(rec.q6_languages || []).map((l, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#040810] border border-white/5 text-[10px] text-text-body">
                        {l}
                      </span>
                    ))}
                  </div>

                  {/* Bottom: Date & Inspect button */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-text-body">
                    <span>{formatDate(rec.submitted_at)}</span>
                    <span className="text-accent-cyan font-bold flex items-center gap-1">
                      Inspect Details →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ==========================================
            DESKTOP TABLE VIEW (Visible on >= md screens)
        ========================================== */}
        <div className="hidden md:block rounded-3xl bg-[#0c1424]/90 backdrop-blur-xl border border-white/10 border-t-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[880px]">
              <thead className="bg-[#040810]/80 border-b border-white/10 text-text-body text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap min-w-[200px]">Team Member</th>
                  <th className="px-6 py-4 whitespace-nowrap min-w-[180px]">Role</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap w-28">Confidence</th>
                  <th className="px-6 py-4 whitespace-nowrap min-w-[140px]">Daily Volume</th>
                  <th className="px-6 py-4 min-w-[200px]">Languages</th>
                  <th className="px-6 py-4 whitespace-nowrap">Script Wanted</th>
                  <th className="px-6 py-4 whitespace-nowrap">Submitted</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
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
                    const badge = getScoreBadge(rec.q10_confidence_scale || 0);

                    return (
                      <tr
                        key={rec.id}
                        onClick={() => setSelectedRecord(rec)}
                        className="hover:bg-[#101b30] transition-colors cursor-pointer group"
                      >
                        {/* Member */}
                        <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-cyan font-bold text-xs uppercase shrink-0 group-hover:scale-105 transition-transform">
                              {rec.staff_name.charAt(0)}
                            </div>
                            <div>
                              <span className="group-hover:text-accent-cyan transition-colors">{rec.staff_name}</span>
                              {rec.q2_cold_calling_experience === "Yes" && (
                                <span className="block text-[10px] text-[#5DCAA5] font-normal">Experienced Caller</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4 text-text-body font-medium whitespace-nowrap">
                          {rec.staff_role}
                        </td>

                        {/* Confidence */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Daily Volume (Crisp, non-wrapping badge) */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-xl bg-[#040810] border border-white/10 text-xs font-semibold text-white whitespace-nowrap shadow-sm">
                            {rec.q4_calls_per_day} calls/day
                          </span>
                        </td>

                        {/* Languages */}
                        <td className="px-6 py-4 text-text-body text-xs">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {(rec.q6_languages || []).map((l, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-[#040810] border border-white/5 text-[10px] text-text-body whitespace-nowrap">
                                {l}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Script Wanted */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {rec.q11_training_script_wanted === "Yes" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                              <GraduationCap size={13} />
                              Yes
                            </span>
                          ) : (
                            <span className="text-text-body text-xs">No</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-text-body text-xs whitespace-nowrap">
                          {formatDate(rec.submitted_at)}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(rec);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#040810] hover:bg-accent-primary hover:text-[#040A14] border border-white/10 hover:border-accent-cyan text-xs font-bold text-white transition-all inline-flex items-center gap-1 group/btn"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-up">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c1424] border border-white/15 border-t-white/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-[#040810] hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-body hover:text-white transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3.5 mb-5 sm:mb-6 pr-8">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-accent-primary/10 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan font-bold text-xl sm:text-2xl uppercase shrink-0 shadow-[0_0_25px_rgba(0,212,255,0.25)]">
                {selectedRecord.staff_name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                  {selectedRecord.staff_name}
                </h2>
                <p className="text-xs sm:text-sm text-accent-cyan font-semibold truncate">{selectedRecord.staff_role}</p>
                <p className="text-[11px] sm:text-xs text-text-body mt-0.5">Submitted: {formatDate(selectedRecord.submitted_at)}</p>
              </div>
            </div>

            {/* Rating Highlight Pill */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/10 mb-5 sm:mb-6 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Gauge size={18} className="text-accent-cyan shrink-0" />
                <div>
                  <span className="text-[10px] sm:text-[11px] text-text-body uppercase font-bold tracking-wider">Confidence Score</span>
                  <p className="text-base sm:text-lg font-extrabold text-white">{selectedRecord.q10_confidence_scale} / 10</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] sm:text-xs text-text-body font-medium">Phone Outreach:</span>
                <p className="text-xs sm:text-sm font-bold text-accent-cyan">{selectedRecord.q1_comfortable_calls}</p>
              </div>
            </div>

            {/* 11 Questions Breakdown */}
            <div className="flex flex-col gap-3.5 sm:gap-4">
              <h3 className="text-xs font-bold text-accent-cyan tracking-wider uppercase">Full Assessment Breakdown</h3>

              {/* Q1, Q3, Q4, Q5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">1. Comfortable on Phone Calls?</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q1_comfortable_calls}</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">3. Calling New Business Owners?</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q3_calling_business_owner}</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">4. Daily Realistic Call Volume</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q4_calls_per_day} calls/day</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">5. Handling Common Objections</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q5_handling_objections}</p>
                </div>
              </div>

              {/* Q2 Written Experience Note (if any) */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                <span className="text-xs text-text-body">2. Past Cold Calling Experience:</span>
                <p className="text-sm font-bold text-white mt-1">{selectedRecord.q2_cold_calling_experience}</p>
                {selectedRecord.q2_experience_details && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[#080E1A] border border-accent-cyan/30 text-xs text-text-body leading-relaxed">
                    <span className="text-accent-cyan font-bold block mb-1">Experience Summary:</span>
                    &ldquo;{selectedRecord.q2_experience_details}&rdquo;
                  </div>
                )}
              </div>

              {/* Q6 Languages */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                <span className="text-xs text-text-body">6. Fluent Languages &amp; Dialects:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(selectedRecord.q6_languages || []).map((l, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-xs text-accent-cyan font-semibold">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Q7, Q8, Q9, Q11 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">7. Regular Cold Calling Role?</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q7_regular_calls_willingness}</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">8. Personal Phone &amp; SIM Available?</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q8_phone_sim_available}</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">9. Company Calling Package?</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q9_company_calling_package}</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040810] border border-white/5">
                  <span className="text-xs text-text-body">11. Wants Training &amp; Script?</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedRecord.q11_training_script_wanted}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-text-body">ID: <code className="font-mono text-[10px]">{selectedRecord.id}</code></span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-primary to-accent-cyan text-[#040A14] font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
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
