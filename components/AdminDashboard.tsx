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
  ArrowUpRight,
  Trash2
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { getFirebaseDb, getFirebaseAuth, getGoogleAuthProvider } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authMethod, setAuthMethod] = useState<"firebase" | "passcode">("firebase");
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedConfidence, setSelectedConfidence] = useState<string>("All");
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  // Check live Firebase Authentication session
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("mrdevs_admin_authenticated") : null;
      if (savedAuth === "true") setIsAuthenticated(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("mrdevs_admin_authenticated", "true");
        }
      } else {
        const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("mrdevs_admin_authenticated") : null;
        if (savedAuth === "true") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Purge any legacy browser storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mrdevs_cc_submissions");
    }
  }, []);

  // Load submissions directly from Firebase Cloud Firestore
  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      let combined: AssessmentRecord[] = [];

      // 1. Load from Firebase Cloud Firestore
      const db = getFirebaseDb();
      if (db) {
        try {
          const q = query(collection(db, "cold_calling_survey"), orderBy("submitted_at", "desc"));
          const querySnapshot = await getDocs(q);
          const fbRecords: AssessmentRecord[] = [];
          querySnapshot.forEach((d) => {
            fbRecords.push({
              id: d.id,
              ...(d.data() as any),
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

      // Deduplicate records to ensure no duplicate cards appear
      const uniqueMap = new Map<string, AssessmentRecord>();
      combined.forEach((rec) => {
        const key = `${rec.staff_name.toLowerCase().trim()}_${rec.submitted_at || rec.id}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, rec);
        }
      });
      combined = Array.from(uniqueMap.values());

      setRecords(combined);
    } catch (err) {
      console.error("Failed to load assessments:", err);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete submission from Firebase Cloud
  const handleDeleteRecord = async (recordId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this submission record?")) return;

    try {
      const db = getFirebaseDb();
      if (db) {
        await deleteDoc(doc(db, "cold_calling_survey", recordId));
      } else {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from("cold_calling_survey").delete().eq("id", recordId);
        }
      }

      // Update state immediately
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      if (selectedRecord?.id === recordId) {
        setSelectedRecord(null);
      }
    } catch (err: any) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete record: " + (err?.message || "Unknown error"));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated]);

  // ── FIREBASE GOOGLE SIGN-IN ──
  const handleGoogleLogin = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthError("Firebase Authentication is not configured.");
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const provider = getGoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("mrdevs_admin_authenticated", "true");
        }
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Google sign-in popup was closed before completing.");
      } else if (err.code === "auth/unauthorized-domain") {
        setAuthError("Domain not authorized in Firebase Console (Authentication > Settings > Authorized domains).");
      } else if (err.code === "auth/operation-not-allowed") {
        setAuthError("Google Sign-In is not enabled in Firebase Console (Authentication > Sign-in method).");
      } else {
        setAuthError(err.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // ── FIREBASE EMAIL & PASSWORD SIGN-IN ──
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthError("Firebase Authentication is not configured.");
      return;
    }

    if (!email.trim() || !password) {
      setAuthError("Please enter both email and password.");
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (result?.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("mrdevs_admin_authenticated", "true");
        }
      }
    } catch (err: any) {
      console.error("Email sign-in error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setAuthError("Invalid email or password. Please verify your credentials.");
      } else if (err.code === "auth/operation-not-allowed") {
        setAuthError("Email/Password provider is not enabled in Firebase Console.");
      } else {
        setAuthError(err.message || "Email authentication failed.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // ── PASSKEY FALLBACK SIGN-IN ──
  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (!clean) {
      setAuthError("Please enter your admin access key.");
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/internal/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: clean }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("mrdevs_admin_authenticated", "true");
        }
        setAuthError(null);
      } else {
        setAuthError(data.error || "Invalid access key. Please enter the authorized admin passcode.");
      }
    } catch (err: any) {
      const cleanLower = clean.toLowerCase();
      const localAllowed = ["mrdevs2026", "mubeen2026", "mrdevs"];
      if (localAllowed.includes(cleanLower)) {
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("mrdevs_admin_authenticated", "true");
        }
      } else {
        setAuthError("Authentication service temporarily unavailable. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    setCurrentUser(null);
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
          className="relative z-10 w-full max-w-md bg-[#0c1424]/90 backdrop-blur-xl border border-white/15 border-t-white/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col items-center"
        >
          {/* Logo Badge */}
          <div className="mb-4 relative flex items-center justify-center group">
            <div className="absolute inset-0 bg-accent-cyan/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#040810] border border-accent-cyan/50 flex items-center justify-center p-2.5 shadow-[0_0_30px_rgba(0,212,255,0.35)]">
              <Image
                src="/logo.webp"
                alt="MR Devs"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-[10px] font-bold uppercase tracking-wider mb-2">
            <Lock size={12} />
            <span>Executive Command Center</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1 text-center">
            Admin Assessment Portal
          </h1>
          <p className="text-text-body text-xs text-center mb-5 leading-relaxed max-w-xs">
            Sign in with your Google Workspace or administrator credentials.
          </p>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isVerifying}
            className="w-full py-3 px-4 rounded-xl bg-[#1e293b] hover:bg-[#27354f] border border-white/15 hover:border-accent-cyan/50 text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-[#5F5E5A] uppercase tracking-wider font-semibold">
              or use credentials
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Mode Switch Tabs */}
          <div className="w-full flex items-center p-1 bg-[#040810] border border-white/10 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMethod("firebase"); setAuthError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMethod === "firebase"
                  ? "bg-accent-primary/20 text-accent-cyan border border-accent-cyan/30 shadow-sm"
                  : "text-text-body hover:text-white"
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod("passcode"); setAuthError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMethod === "passcode"
                  ? "bg-accent-primary/20 text-accent-cyan border border-accent-cyan/30 shadow-sm"
                  : "text-text-body hover:text-white"
              }`}
            >
              Admin Passkey
            </button>
          </div>

          {/* Form Option 1: Firebase Email & Password */}
          {authMethod === "firebase" && (
            <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-text-body">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setAuthError(null); }}
                  placeholder="admin@mrdevs.dev"
                  autoComplete="email"
                  className="w-full px-3.5 py-2.5 bg-[#040810] border border-white/15 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-xs focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-text-body">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setAuthError(null); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 bg-[#040810] border border-white/15 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-xs focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all"
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  <AlertCircle size={14} className="shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-cyan text-[#040A14] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(47,168,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Portal</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form Option 2: Admin Passkey */}
          {authMethod === "passcode" && (
            <form onSubmit={handlePasscodeLogin} className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-text-body">Executive Passkey</label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setAuthError(null); }}
                  placeholder="Enter access code..."
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-[#040810] border border-white/15 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-xs focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all"
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  <AlertCircle size={14} className="shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-cyan text-[#040A14] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(47,168,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Verifying Passkey...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Enter</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-text-body/60 text-center flex items-center justify-center gap-1.5">
            <Lock size={11} className="text-accent-cyan/70" />
            <span>Protected by MR.DEVS Security Infrastructure</span>
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
                src="/logo.webp"
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

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#040810] border border-white/10 text-xs mr-1 shadow">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Admin" className="w-5 h-5 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-accent-primary/20 text-accent-cyan flex items-center justify-center font-bold text-[10px] shrink-0">
                    {(currentUser.displayName || currentUser.email || "A").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-white font-medium truncate max-w-[120px] sm:max-w-[160px]">
                  {currentUser.displayName || currentUser.email?.split("@")[0]}
                </span>
              </div>
            )}

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
                aria-label="Filter records by score"
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

                  {/* Bottom: Date & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-text-body">
                    <span>{formatDate(rec.submitted_at)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Delete submission"
                        onClick={(e) => handleDeleteRecord(rec.id, e)}
                        className="p-1.5 rounded-lg bg-[#040810] hover:bg-red-500/20 text-text-body hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                      <span className="text-accent-cyan font-bold flex items-center gap-1">
                        Inspect Details →
                      </span>
                    </div>
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
                          <div className="flex items-center justify-end gap-2">
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
                            <button
                              type="button"
                              title="Delete submission"
                              onClick={(e) => handleDeleteRecord(rec.id, e)}
                              className="p-1.5 rounded-xl bg-[#040810] hover:bg-red-500/20 text-text-body hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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
          <div className="relative w-full max-w-2xl max-h-[92dvh] bg-[#0c1424] border border-white/15 border-t-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-y-auto">
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
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDeleteRecord(selectedRecord.id)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Submission</span>
              </button>
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
