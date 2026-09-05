"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  User, 
  Briefcase,
  ShieldCheck,
  PhoneCall,
  Volume2,
  Languages,
  Target,
  Smartphone,
  CreditCard,
  Gauge,
  GraduationCap
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { getFirebaseDb } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface SurveyState {
  staffName: string;
  staffRole: string;
  q1ComfortableCalls: string;
  q2ColdCallingExperience: string;
  q2ExperienceDetails: string;
  q3CallingBusinessOwner: string;
  q4CallsPerDay: string;
  q5HandlingObjections: string;
  q6Languages: string[];
  q7RegularCallsWillingness: string;
  q8PhoneSimAvailable: string;
  q9CompanyCallingPackage: string;
  q10ConfidenceScale: number | null;
  q11TrainingScriptWanted: string;
}

const INITIAL_STATE: SurveyState = {
  staffName: "",
  staffRole: "",
  q1ComfortableCalls: "",
  q2ColdCallingExperience: "",
  q2ExperienceDetails: "",
  q3CallingBusinessOwner: "",
  q4CallsPerDay: "",
  q5HandlingObjections: "",
  q6Languages: [],
  q7RegularCallsWillingness: "",
  q8PhoneSimAvailable: "",
  q9CompanyCallingPackage: "",
  q10ConfidenceScale: null,
  q11TrainingScriptWanted: "",
};

const TOTAL_QUESTIONS = 11;
const TOTAL_STEPS = 12; // Step 0 (Staff Info) + Steps 1 to 11

export default function ColdCallingSurvey() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<SurveyState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Auto-focus input on step change
  useEffect(() => {
    setValidationError(null);
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Zero-Lag 3D Tilt handler on desktop
  const handleTiltMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
  };

  const handleTiltMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting || isSubmitted) return;

      if (e.key === "Enter" && !e.shiftKey) {
        if (currentStep === 2 && formData.q2ColdCallingExperience === "Yes" && document.activeElement?.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        handleNext();
        return;
      }

      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      const keyUpper = e.key.toUpperCase();

      if (currentStep === 1) {
        if (keyUpper === "A") handleSingleSelect("q1ComfortableCalls", "Yes");
        if (keyUpper === "B") handleSingleSelect("q1ComfortableCalls", "No");
        if (keyUpper === "C") handleSingleSelect("q1ComfortableCalls", "Somewhat");
      } else if (currentStep === 2) {
        if (keyUpper === "A") handleSingleSelect("q2ColdCallingExperience", "Yes", false);
        if (keyUpper === "B") handleSingleSelect("q2ColdCallingExperience", "No", true);
      } else if (currentStep === 3) {
        if (keyUpper === "A") handleSingleSelect("q3CallingBusinessOwner", "Yes");
        if (keyUpper === "B") handleSingleSelect("q3CallingBusinessOwner", "No");
        if (keyUpper === "C") handleSingleSelect("q3CallingBusinessOwner", "Need training");
      } else if (currentStep === 4) {
        if (keyUpper === "A") handleSingleSelect("q4CallsPerDay", "20");
        if (keyUpper === "B") handleSingleSelect("q4CallsPerDay", "30");
        if (keyUpper === "C") handleSingleSelect("q4CallsPerDay", "50");
        if (keyUpper === "D") handleSingleSelect("q4CallsPerDay", "75");
        if (keyUpper === "E") handleSingleSelect("q4CallsPerDay", "100+");
      } else if (currentStep === 5) {
        if (keyUpper === "A") handleSingleSelect("q5HandlingObjections", "Yes");
        if (keyUpper === "B") handleSingleSelect("q5HandlingObjections", "No");
        if (keyUpper === "C") handleSingleSelect("q5HandlingObjections", "Need training");
      } else if (currentStep === 7) {
        if (keyUpper === "A") handleSingleSelect("q7RegularCallsWillingness", "Yes");
        if (keyUpper === "B") handleSingleSelect("q7RegularCallsWillingness", "No");
      } else if (currentStep === 8) {
        if (keyUpper === "A") handleSingleSelect("q8PhoneSimAvailable", "Yes");
        if (keyUpper === "B") handleSingleSelect("q8PhoneSimAvailable", "No");
      } else if (currentStep === 9) {
        if (keyUpper === "A") handleSingleSelect("q9CompanyCallingPackage", "Yes");
        if (keyUpper === "B") handleSingleSelect("q9CompanyCallingPackage", "No");
      } else if (currentStep === 10) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num)) {
          const val = num === 0 ? 10 : num;
          handleScaleSelect(val);
        }
      } else if (currentStep === 11) {
        if (keyUpper === "A") handleSingleSelect("q11TrainingScriptWanted", "Yes", false);
        if (keyUpper === "B") handleSingleSelect("q11TrainingScriptWanted", "No", false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, formData, isSubmitting, isSubmitted]);

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return formData.staffName.trim().length > 0 && formData.staffRole.trim().length > 0;
      case 1:
        return !!formData.q1ComfortableCalls;
      case 2:
        if (!formData.q2ColdCallingExperience) return false;
        if (formData.q2ColdCallingExperience === "Yes") {
          return formData.q2ExperienceDetails.trim().length > 0;
        }
        return true;
      case 3:
        return !!formData.q3CallingBusinessOwner;
      case 4:
        return !!formData.q4CallsPerDay;
      case 5:
        return !!formData.q5HandlingObjections;
      case 6:
        return formData.q6Languages.length > 0;
      case 7:
        return !!formData.q7RegularCallsWillingness;
      case 8:
        return !!formData.q8PhoneSimAvailable;
      case 9:
        return !!formData.q9CompanyCallingPackage;
      case 10:
        return formData.q10ConfidenceScale !== null;
      case 11:
        return !!formData.q11TrainingScriptWanted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      if (currentStep === 0) {
        setValidationError("Please enter your name and current role to begin.");
      } else if (currentStep === 2 && formData.q2ColdCallingExperience === "Yes" && !formData.q2ExperienceDetails.trim()) {
        setValidationError("Please provide a short summary of your cold calling experience.");
      } else if (currentStep === 6 && formData.q6Languages.length === 0) {
        setValidationError("Please select at least one language to proceed.");
      } else {
        setValidationError("Please choose an answer to proceed.");
      }
      return;
    }

    setValidationError(null);

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setValidationError(null);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSingleSelect = (field: keyof SurveyState, value: string, autoAdvance = true) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);

    if (autoAdvance) {
      if (field === "q2ColdCallingExperience" && value === "Yes") {
        return;
      }
      setTimeout(() => {
        if (currentStep < TOTAL_STEPS - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      }, 160);
    }
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.q6Languages.includes(lang);
      const updated = exists
        ? prev.q6Languages.filter((l) => l !== lang)
        : [...prev.q6Languages, lang];
      return { ...prev, q6Languages: updated };
    });
    setValidationError(null);
  };

  const handleScaleSelect = (val: number) => {
    setFormData((prev) => ({ ...prev, q10ConfidenceScale: val }));
    setValidationError(null);
    setTimeout(() => {
      if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 160);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        staff_name: formData.staffName.trim(),
        staff_role: formData.staffRole.trim(),
        q1_comfortable_calls: formData.q1ComfortableCalls,
        q2_cold_calling_experience: formData.q2ColdCallingExperience,
        q2_experience_details: formData.q2ColdCallingExperience === "Yes" ? formData.q2ExperienceDetails.trim() : null,
        q3_calling_business_owner: formData.q3CallingBusinessOwner,
        q4_calls_per_day: formData.q4CallsPerDay,
        q5_handling_objections: formData.q5HandlingObjections,
        q6_languages: formData.q6Languages,
        q7_regular_calls_willingness: formData.q7RegularCallsWillingness,
        q8_phone_sim_available: formData.q8PhoneSimAvailable,
        q9_company_calling_package: formData.q9CompanyCallingPackage,
        q10_confidence_scale: formData.q10ConfidenceScale,
        q11_training_script_wanted: formData.q11TrainingScriptWanted,
        submitted_at: new Date().toISOString(),
      };

      let saved = false;

      // 1. Try Firebase Firestore
      const db = getFirebaseDb();
      if (db) {
        try {
          await addDoc(collection(db, "cold_calling_survey"), payload);
          saved = true;
        } catch (fbErr: any) {
          console.warn("Firebase save error:", fbErr);
          throw new Error(fbErr?.message || "Failed to record survey response in Firebase.");
        }
      }

      // 2. Try Supabase
      if (!saved) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { error } = await supabase.from("cold_calling_survey").insert([payload]);
          if (error) {
            throw new Error(error.message || "Failed to record survey response in Supabase.");
          }
          saved = true;
        }
      }

      // Clear any legacy local storage key from browser
      if (typeof window !== "undefined") {
        localStorage.removeItem("mrdevs_cc_submissions");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError(err?.message || "Something went wrong during submission. Your responses are safe. Please click Retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round((currentStep / (TOTAL_STEPS - 1)) * 100);

  const getScaleFeedback = (val: number | null) => {
    if (!val) return "Select a score from 1 to 10";
    if (val <= 3) return "Developing - Needs training & scripts";
    if (val <= 6) return "Moderate - Familiar with outreach basics";
    if (val <= 8) return "Confident - Handles objections & qualifies leads";
    return "High Performer - Strong closing ability";
  };

  // ==========================================
  // CONFIRMATION SCREEN (FULLY RESPONSIVE)
  // ==========================================
  if (isSubmitted) {
    return (
      <main className="min-h-[100dvh] bg-[#060a12] text-text-heading flex flex-col items-center justify-center p-3 sm:p-6 font-sans relative overflow-y-auto">
        {/* Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(47, 168, 255, 0.25) 1px, transparent 1px)",
            backgroundSize: "36px 36px"
          }}
        />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div 
          onMouseMove={handleTiltMouseMove}
          onMouseLeave={handleTiltMouseLeave}
          style={{ transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease" }}
          className="relative z-10 w-full max-w-lg bg-[#0c1424]/95 backdrop-blur-xl border border-white/15 border-t-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] text-center flex flex-col items-center animate-fade-up"
        >
          <div className="mb-4 sm:mb-6 relative flex items-center justify-center group">
            <div className="absolute inset-0 bg-accent-cyan/25 rounded-2xl blur-xl" />
            <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-[#040810] border border-accent-cyan/50 flex items-center justify-center p-3 shadow-[0_0_25px_rgba(0,212,255,0.3)]">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5DCAA5]/10 border border-[#5DCAA5]/30 text-[#5DCAA5] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
            <CheckCircle2 size={13} />
            Assessment Recorded
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Thanks - we will be in touch
          </h1>

          <p className="text-text-body text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 max-w-sm">
            Thank you, <span className="text-white font-semibold">{formData.staffName}</span>. Your cold calling assessment has been safely submitted. Mubeen and the team will review your responses.
          </p>

          <div className="w-full bg-[#040810] border border-white/10 rounded-xl sm:rounded-2xl p-4 text-xs text-text-body flex flex-col gap-2.5 text-left shadow-inner">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-text-body font-medium">Team Member</span>
              <span className="text-white font-semibold truncate ml-2">{formData.staffName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-text-body font-medium">Position</span>
              <span className="text-white font-semibold truncate ml-2">{formData.staffRole}</span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-text-body font-medium">Status</span>
              <span className="text-accent-cyan font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
                Submitted &amp; Logged
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="w-full mt-5 sm:mt-6 py-3.5 px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-accent-primary to-accent-cyan text-[#040A14] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,212,255,0.35)] hover:shadow-[0_0_35px_rgba(0,212,255,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Return to MR Devs Website</span>
            <ArrowRight size={15} />
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(0);
              setFormData(INITIAL_STATE);
            }}
            className="mt-3 text-xs text-text-body hover:text-white transition-colors cursor-pointer py-1"
          >
            Submit another response
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // MAIN FORM FLOW (FULLY RESPONSIVE)
  // ==========================================
  return (
    <main className="min-h-[100dvh] bg-[#060a12] text-text-heading flex flex-col justify-between p-3 sm:p-6 md:p-8 font-sans relative overflow-y-auto">
      {/* Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(47, 168, 255, 0.25) 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }}
      />

      {/* Ambient Lighting */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-3xl mx-auto pt-1 sm:pt-2 pb-3 sm:pb-4 z-20">
        <div className="flex items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5 bg-[#0c1424]/90 backdrop-blur-md px-3 py-1.5 sm:py-2 rounded-xl border border-white/10 shadow">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#040810] border border-accent-cyan/40 flex items-center justify-center p-1 shadow-[0_0_10px_rgba(0,212,255,0.2)] shrink-0">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide uppercase">MR Devs</span>
              <span className="text-[9px] sm:text-[10px] text-accent-cyan font-medium leading-none">Internal Assessment</span>
            </div>
          </div>

          <div className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#0c1424]/90 backdrop-blur-md border border-white/10 text-xs font-medium text-text-body flex items-center gap-2 shadow">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            {currentStep === 0 ? (
              <span className="text-white font-semibold text-[11px] sm:text-xs">Staff Info</span>
            ) : (
              <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                <span className="text-white font-semibold">Q{currentStep}</span>
                <span className="text-text-body/60">/</span>
                <span className="text-text-body">{TOTAL_QUESTIONS}</span>
                <span className="text-[10px] text-accent-cyan font-mono ml-0.5">({progressPercent}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 bg-[#0c1424] border border-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-accent-primary via-accent-cyan to-accent-primary transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Question Card with 3D Tilt & Responsive Sizing */}
      <div className="flex-1 flex items-center justify-center my-2 sm:my-4 z-10 w-full">
        <div
          onMouseMove={handleTiltMouseMove}
          onMouseLeave={handleTiltMouseLeave}
          style={{ transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease" }}
          className="w-full max-w-2xl bg-[#0c1424]/95 backdrop-blur-xl border border-white/15 border-t-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.7)] relative"
        >
          
          {/* STEP 0: Staff Info */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-[11px] font-bold uppercase tracking-wider w-fit">
                <Sparkles size={12} />
                <span>Cold Calling Readiness Check</span>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1.5 sm:mb-2">
                  Staff Readiness Assessment
                </h1>
                <p className="text-text-body text-xs sm:text-sm leading-relaxed max-w-xl">
                  This quick 11-question assessment evaluates readiness for upcoming outbound client outreach campaigns. Enter your name and role to begin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <div className="flex flex-col gap-1.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#040810] border border-white/10 focus-within:border-accent-cyan transition-colors">
                  <label className="text-xs font-semibold text-text-heading flex items-center gap-1.5">
                    <User size={13} className="text-accent-cyan" />
                    Full Name <span className="text-accent-primary">*</span>
                  </label>
                  <input
                    ref={inputRef as any}
                    type="text"
                    value={formData.staffName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, staffName: e.target.value }));
                      setValidationError(null);
                    }}
                    placeholder="e.g. Mubeen Khan"
                    className="w-full px-3.5 py-2.5 bg-[#080E1A] border border-white/10 focus:border-accent-cyan rounded-lg sm:rounded-xl text-white placeholder-[#5F5E5A] text-base sm:text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#040810] border border-white/10 focus-within:border-accent-cyan transition-colors">
                  <label className="text-xs font-semibold text-text-heading flex items-center gap-1.5">
                    <Briefcase size={13} className="text-accent-cyan" />
                    Current Role <span className="text-accent-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.staffRole}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, staffRole: e.target.value }));
                      setValidationError(null);
                    }}
                    placeholder="e.g. Developer, Outreach, Design"
                    className="w-full px-3.5 py-2.5 bg-[#080E1A] border border-white/10 focus:border-accent-cyan rounded-lg sm:rounded-xl text-white placeholder-[#5F5E5A] text-base sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Phone Calls */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <PhoneCall size={13} />
                <span>Question 1 of 11</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                Comfortable speaking with potential clients on a phone call?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Somewhat" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q1ComfortableCalls", opt.label)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      formData.q1ComfortableCalls === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q1ComfortableCalls === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q1ComfortableCalls === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Cold Calling Experience */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Target size={13} />
                <span>Question 2 of 11</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                Done cold calling before?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q2ColdCallingExperience", opt.label, opt.label === "No")}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      formData.q2ColdCallingExperience === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q2ColdCallingExperience === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q2ColdCallingExperience === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>

              {formData.q2ColdCallingExperience === "Yes" && (
                <div className="flex flex-col gap-2 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#040810] border border-accent-cyan/40 mt-1 shadow-inner">
                  <label className="text-xs font-semibold text-accent-cyan flex items-center gap-1.5">
                    <Sparkles size={13} />
                    Briefly tell me about your experience: <span className="text-accent-primary">*</span>
                  </label>
                  <textarea
                    ref={inputRef as any}
                    rows={3}
                    value={formData.q2ExperienceDetails}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, q2ExperienceDetails: e.target.value }));
                      setValidationError(null);
                    }}
                    placeholder="Mention the industry, call volume, or campaign outcomes..."
                    className="w-full px-3.5 py-2.5 bg-[#080E1A] border border-white/10 focus:border-accent-cyan rounded-lg sm:rounded-xl text-white placeholder-[#5F5E5A] text-base sm:text-sm resize-none focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Calling Business Owner */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <User size={13} />
                <span>Question 3 of 11</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                Comfortable calling a business owner or manager who has never spoken to MR Devs before?
              </h2>

              <div className="grid grid-cols-1 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Need training" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q3CallingBusinessOwner", opt.label)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.98] ${
                      formData.q3CallingBusinessOwner === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.01]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q3CallingBusinessOwner === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q3CallingBusinessOwner === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Call Volume (Responsive 2-col on mobile with full-width last item, 5-col on desktop) */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Gauge size={13} />
                <span>Question 4 of 11</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                How many cold calls can you realistically make in a day while maintaining quality?
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 mt-1">
                {[
                  { key: "A", label: "20" },
                  { key: "B", label: "30" },
                  { key: "C", label: "50" },
                  { key: "D", label: "75" },
                  { key: "E", label: "100+" },
                ].map((opt, idx) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q4CallsPerDay", opt.label)}
                    className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                      idx === 4 ? "col-span-2 sm:col-span-1" : ""
                    } ${
                      formData.q4CallsPerDay === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-105"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] font-bold text-accent-cyan/80 mb-0.5">[{opt.key}]</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-white">{opt.label}</span>
                    <span className="text-[10px] sm:text-[11px] text-text-body mt-0.5 font-normal">calls/day</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Objections */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={13} />
                <span>Question 5 of 11</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug mb-2">
                  Comfortable handling common objections?
                </h2>
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#040810] border border-white/10 text-xs text-text-body leading-relaxed flex flex-col gap-1">
                  <span className="text-accent-cyan font-bold text-[11px]">Common objections to navigate:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 sm:gap-1 text-[11px]">
                    <span>• &quot;Not interested&quot;</span>
                    <span>• &quot;We already have a website&quot;</span>
                    <span>• &quot;Send me details on WhatsApp&quot;</span>
                    <span>• &quot;How much does it cost?&quot;</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Need training" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q5HandlingObjections", opt.label)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      formData.q5HandlingObjections === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q5HandlingObjections === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q5HandlingObjections === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Languages Multi-Select */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <Languages size={13} />
                  <span>Question 6 of 11</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 px-2.5 py-0.5 rounded-full font-bold">
                  Multi-select
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug mb-1">
                  Comfortable speaking in:
                </h2>
                <p className="text-xs text-text-body">Select all languages you feel confident conducting calls in.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1">
                {[
                  "Urdu",
                  "Roman Urdu",
                  "English",
                  "Urdu + English mixture",
                ].map((lang) => {
                  const isChecked = formData.q6Languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                        isChecked
                          ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                          : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span className="text-sm sm:text-base">{lang}</span>
                      <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-md sm:rounded-lg border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-accent-cyan border-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "border-white/20 bg-white/5"
                      }`}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: Regular Calling */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Volume2 size={13} />
                <span>Question 7 of 11</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                Willing to make cold calls regularly as part of MR Devs responsibilities?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q7RegularCallsWillingness", opt.label)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      formData.q7RegularCallsWillingness === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q7RegularCallsWillingness === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q7RegularCallsWillingness === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Phone & SIM */}
          {currentStep === 8 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Smartphone size={13} />
                <span>Question 8 of 11</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                Do you have a phone and SIM you can make business calls with?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q8PhoneSimAvailable", opt.label)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      formData.q8PhoneSimAvailable === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q8PhoneSimAvailable === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q8PhoneSimAvailable === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: Calling Package */}
          {currentStep === 9 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <CreditCard size={13} />
                <span>Question 9 of 11</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                Comfortable using a company-provided calling package on your existing number initially?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q9CompanyCallingPackage", opt.label)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      formData.q9CompanyCallingPackage === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q9CompanyCallingPackage === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q9CompanyCallingPackage === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: Confidence Scale 1-10 (Optimized 5x2 grid for mobile) */}
          {currentStep === 10 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Gauge size={13} />
                <span>Question 10 of 11</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug mb-1">
                  Confidence making a cold call to a potential client?
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-accent-cyan">
                  <span>Rating: {formData.q10ConfidenceScale || "-"} / 10</span>
                  <span className="text-text-body font-normal">• {getScaleFeedback(formData.q10ConfidenceScale)}</span>
                </div>
              </div>

              {/* 1-10 Number Tiles Grid */}
              <div className="flex flex-col gap-2.5 mt-1">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleScaleSelect(num)}
                      className={`h-11 sm:h-12 min-h-[44px] rounded-xl border font-extrabold text-sm sm:text-base flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        formData.q10ConfidenceScale === num
                          ? "bg-accent-cyan border-accent-cyan text-[#040A14] shadow-[0_0_20px_rgba(0,212,255,0.6)] scale-105"
                          : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span>{num}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] sm:text-xs text-text-body px-1 font-medium">
                  <span>1 - Very Low</span>
                  <span>10 - Very High</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 11: Training and Script */}
          {currentStep === 11 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-accent-cyan text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <GraduationCap size={13} />
                <span>Question 11 of 11 (Final)</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                Would you like training and a cold-calling script before starting?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q11TrainingScriptWanted", opt.label, false)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-sm font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      formData.q11TrainingScriptWanted === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-[#040810] border-white/10 text-text-body hover:bg-[#101b30] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                        formData.q11TrainingScriptWanted === opt.label
                          ? "bg-accent-cyan text-[#040A14] shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </div>
                    {formData.q11TrainingScriptWanted === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation Alert */}
          {validationError && (
            <div className="mt-4 flex items-center gap-2 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-fade-up">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div className="mt-4 flex flex-col gap-2 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-400 shrink-0" />
                <span className="font-semibold">Submission Notice</span>
              </div>
              <p className="text-text-body">{submitError}</p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="self-start mt-1 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} className={isSubmitting ? "animate-spin" : ""} />
                Retry Submission
              </button>
            </div>
          )}

          {/* Navigation Controls Dock (Responsive Layout) */}
          <div className="flex items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/5">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#040810] hover:bg-[#101b30] border border-white/10 text-text-body hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-accent-primary to-accent-cyan text-[#040A14] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(47,168,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ml-auto"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Recording Response...
                </>
              ) : currentStep === TOTAL_STEPS - 1 ? (
                <>
                  Submit Assessment
                  <Check size={15} />
                </>
              ) : currentStep === 0 ? (
                <>
                  Begin Assessment
                  <ArrowRight size={15} />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <footer className="w-full max-w-2xl mx-auto pb-1 sm:pb-2 text-center text-[11px] sm:text-xs text-text-body/60 select-none z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="flex items-center gap-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[9px] sm:text-[10px]">Enter ↵</kbd> or click to advance
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:flex items-center gap-1">
          Use keys <kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">A</kbd>-<kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">E</kbd> for quick choice
        </span>
      </footer>
    </main>
  );
}
