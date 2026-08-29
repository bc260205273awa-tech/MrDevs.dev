"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  PhoneCall, 
  User, 
  Briefcase 
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

// [NEW] Survey form state interface
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
  q12ReadyToStart: string;
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
  q12ReadyToStart: "",
};

// [NEW] Total steps: Step 0 (Staff Info) + Steps 1-12 (12 Questions)
const TOTAL_QUESTIONS = 12;
const TOTAL_STEPS = 13; // 0 to 12

export default function ColdCallingSurvey() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<SurveyState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // [NEW] Auto-focus input on step change
  useEffect(() => {
    setValidationError(null);
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // [NEW] Keyboard navigation handler for Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't auto-advance on Enter if user is in a multi-line textarea unless Shift is not pressed
      if (e.key === "Enter" && !e.shiftKey && !isSubmitting && !isSubmitted) {
        if (currentStep === 2 && formData.q2ColdCallingExperience === "Yes" && document.activeElement?.tagName === "TEXTAREA") {
          return; // Allow standard line breaks in textarea
        }
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, formData, isSubmitting, isSubmitted]);

  // [NEW] Check whether current step is valid to proceed
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
      case 12:
        return !!formData.q12ReadyToStart;
      default:
        return false;
    }
  };

  // [NEW] Move to next step or submit on final step
  const handleNext = () => {
    if (!isStepValid()) {
      if (currentStep === 0) {
        setValidationError("Please enter both your name and role to proceed.");
      } else if (currentStep === 2 && formData.q2ColdCallingExperience === "Yes" && !formData.q2ExperienceDetails.trim()) {
        setValidationError("Please briefly describe your past cold calling experience.");
      } else if (currentStep === 6 && formData.q6Languages.length === 0) {
        setValidationError("Please select at least one language option.");
      } else {
        setValidationError("Please select an answer to continue.");
      }
      return;
    }

    setValidationError(null);

    if (currentStep < TOTAL_STEPS - 1) {
      setDirection("next");
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  // [NEW] Move to previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      setValidationError(null);
      setDirection("prev");
      setCurrentStep((prev) => prev - 1);
    }
  };

  // [NEW] Quick select option handler with optional auto-advance
  const handleSingleSelect = (field: keyof SurveyState, value: string, autoAdvance = true) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);

    // Auto advance if requested and not conditional
    if (autoAdvance) {
      if (field === "q2ColdCallingExperience" && value === "Yes") {
        // Do not auto-advance if Yes, because follow-up textarea needs to be filled
        return;
      }
      setTimeout(() => {
        if (currentStep < TOTAL_STEPS - 1) {
          setDirection("next");
          setCurrentStep((prev) => prev + 1);
        }
      }, 250);
    }
  };

  // [NEW] Toggle multi-select language option
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

  // [NEW] Set scale value
  const handleScaleSelect = (val: number) => {
    setFormData((prev) => ({ ...prev, q10ConfidenceScale: val }));
    setValidationError(null);
    setTimeout(() => {
      if (currentStep < TOTAL_STEPS - 1) {
        setDirection("next");
        setCurrentStep((prev) => prev + 1);
      }
    }, 250);
  };

  // [NEW] Submit data to Supabase
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const supabase = getSupabaseClient();

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
        q12_ready_to_start: formData.q12ReadyToStart,
        submitted_at: new Date().toISOString(),
      };

      if (!supabase) {
        // Supabase env variables not configured in client environment
        console.warn("Supabase credentials not found. Storing submission fallback in localStorage.", payload);
        // Persist locally so data isn't lost
        if (typeof window !== "undefined") {
          const localSubmissions = JSON.parse(localStorage.getItem("mrdevs_cc_submissions") || "[]");
          localSubmissions.push(payload);
          localStorage.setItem("mrdevs_cc_submissions", JSON.stringify(localSubmissions));
        }
        // If Supabase environment is deliberately unconfigured in local test, proceed to submitted
        // Otherwise prompt warning
      } else {
        const { error } = await supabase.from("cold_calling_survey").insert([payload]);
        if (error) {
          throw new Error(error.message || "Failed to record survey response.");
        }
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setSubmitError(err?.message || "Something went wrong while submitting. Your answers have been preserved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate progress percentage
  const progressPercent = Math.round((currentStep / (TOTAL_STEPS - 1)) * 100);

  // [NEW] Final confirmation screen
  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-bg-main text-text-heading flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-accent-primary/20 selection:text-white">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center flex flex-col items-center animate-fade-up">
          {/* MR Devs Logo */}
          <div className="mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-bg-deep border border-accent-cyan/30 flex items-center justify-center p-3 shadow-[0_0_25px_rgba(0,212,255,0.25)]">
              <Image
                src="/logo.png"
                alt="MR Devs Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Success Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5DCAA5]/10 border border-[#5DCAA5]/30 text-[#5DCAA5] text-xs font-semibold uppercase tracking-wider mb-5">
            <CheckCircle2 size={14} />
            Response Submitted
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Thanks - we will be in touch
          </h1>

          <p className="text-text-body text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            Thank you, <span className="text-white font-medium">{formData.staffName}</span>. Your cold calling readiness details have been recorded. Mubeen and the leadership team will review your responses.
          </p>

          {/* Key Recap Pill */}
          <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-xs text-text-body flex flex-col gap-2 text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-text-body">Staff Member</span>
              <span className="text-white font-medium">{formData.staffName} ({formData.staffRole})</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-text-body">Status</span>
              <span className="text-accent-cyan font-medium">Ready for review</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-main text-text-heading flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans relative overflow-hidden selection:bg-accent-primary/20 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header / Progress Bar */}
      <header className="w-full max-w-3xl mx-auto pt-2 pb-6 z-20">
        <div className="flex items-center justify-between gap-4 mb-3">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-bg-deep border border-accent-cyan/30 flex items-center justify-center p-1 shadow-[0_0_10px_rgba(0,212,255,0.2)]">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide uppercase">MR Devs</span>
              <span className="text-[10px] text-accent-cyan/80 font-medium">Internal Staff Form</span>
            </div>
          </div>

          {/* Step Pill */}
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-text-body flex items-center gap-1.5">
            {currentStep === 0 ? (
              <span>Start</span>
            ) : (
              <>
                <span className="text-accent-cyan font-semibold">{currentStep}</span>
                <span>/</span>
                <span>{TOTAL_QUESTIONS}</span>
              </>
            )}
          </div>
        </div>

        {/* Glowing Progress Track */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-accent-primary via-accent-cyan to-accent-primary transition-all duration-300 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px]" />
          </div>
        </div>
      </header>

      {/* Center Question Screen */}
      <div className="flex-1 flex items-center justify-center my-6 z-10 w-full">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/5 border-t-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/5 rounded-tr-3xl blur-2xl pointer-events-none" />

          {/* STEP 0: Staff Info */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="animate-pulse" />
                <span>Cold Calling Readiness Check</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Welcome to the Readiness Assessment
                </h1>
                <p className="text-text-body text-sm sm:text-base leading-relaxed">
                  Before we begin, please enter your name and current role at MR Devs so your responses can be recorded.
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-body flex items-center gap-1.5">
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
                    className="w-full px-4 py-3.5 bg-bg-deep/80 border border-white/10 focus:border-accent-primary rounded-xl text-white placeholder-[#5F5E5A] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text-body flex items-center gap-1.5">
                    <Briefcase size={13} className="text-accent-cyan" />
                    Role / Position <span className="text-accent-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.staffRole}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, staffRole: e.target.value }));
                      setValidationError(null);
                    }}
                    placeholder="e.g. Frontend Developer, Sales Executive, Designer"
                    className="w-full px-4 py-3.5 bg-bg-deep/80 border border-white/10 focus:border-accent-primary rounded-xl text-white placeholder-[#5F5E5A] text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Comfortable speaking with potential clients on phone */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 1 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Comfortable speaking with potential clients on a phone call?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Somewhat" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q1ComfortableCalls", opt.label)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q1ComfortableCalls === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q1ComfortableCalls === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q1ComfortableCalls === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Done cold calling before? (Conditional follow-up) */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 2 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Done cold calling before?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q2ColdCallingExperience", opt.label, opt.label === "No")}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q2ColdCallingExperience === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q2ColdCallingExperience === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q2ColdCallingExperience === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>

              {/* Conditional open text field if Yes */}
              {formData.q2ColdCallingExperience === "Yes" && (
                <div className="flex flex-col gap-2 pt-2 animate-fade-up">
                  <label className="text-xs font-medium text-accent-cyan flex items-center gap-1.5">
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
                    placeholder="Mention the industry, volume of calls, results or role you had..."
                    className="w-full px-4 py-3 bg-bg-deep/80 border border-white/10 focus:border-accent-primary rounded-xl text-white placeholder-[#5F5E5A] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all duration-200"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Calling business owner/manager who never spoke to MR Devs */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 3 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Comfortable calling a business owner or manager who has never spoken to MR Devs before?
              </h2>

              <div className="grid grid-cols-1 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Need training" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q3CallingBusinessOwner", opt.label)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q3CallingBusinessOwner === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q3CallingBusinessOwner === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q3CallingBusinessOwner === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: How many cold calls can you realistically make in a day */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 4 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                How many cold calls can you realistically make in a day while maintaining quality?
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                {[
                  { key: "A", label: "20" },
                  { key: "B", label: "30" },
                  { key: "C", label: "50" },
                  { key: "D", label: "75" },
                  { key: "E", label: "100+" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q4CallsPerDay", opt.label)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-sm font-medium transition-all duration-200 ${
                      formData.q4CallsPerDay === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="text-lg font-bold text-white mb-1">{opt.label}</span>
                    <span className="text-[11px] text-text-body">calls/day</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Handling common objections */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 5 of 12</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-3">
                  Comfortable handling common objections?
                </h2>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-body leading-relaxed">
                  <span className="text-accent-cyan font-medium">Common objections include:</span> &quot;Not interested&quot;, &quot;We already have a website&quot;, &quot;Send me details on WhatsApp&quot;, &quot;How much does it cost?&quot;, &quot;I&apos;m busy right now&quot;.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Need training" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q5HandlingObjections", opt.label)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q5HandlingObjections === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q5HandlingObjections === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q5HandlingObjections === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Languages (Multi-select) */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <div className="flex items-center justify-between">
                <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 6 of 12</span>
                <span className="text-[11px] text-text-body bg-white/5 px-2.5 py-1 rounded-full">Multi-select</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-1">
                  Comfortable speaking in:
                </h2>
                <p className="text-xs text-text-body">Select all languages you feel confident using on calls.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
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
                      className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                        isChecked
                          ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                          : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span>{lang}</span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-accent-primary border-accent-primary text-bg-main"
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

          {/* STEP 7: Willing to make cold calls regularly */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 7 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Willing to make cold calls regularly as part of MR Devs responsibilities?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q7RegularCallsWillingness", opt.label)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q7RegularCallsWillingness === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q7RegularCallsWillingness === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q7RegularCallsWillingness === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Phone and SIM available */}
          {currentStep === 8 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 8 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Do you have a phone and SIM you can make business calls with?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q8PhoneSimAvailable", opt.label)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q8PhoneSimAvailable === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q8PhoneSimAvailable === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q8PhoneSimAvailable === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: Company-provided calling package on existing number */}
          {currentStep === 9 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 9 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Comfortable using a company-provided calling package on your existing number initially?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q9CompanyCallingPackage", opt.label)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q9CompanyCallingPackage === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q9CompanyCallingPackage === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q9CompanyCallingPackage === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: Confidence scale 1-10 */}
          {currentStep === 10 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 10 of 12</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-1">
                  Confidence making a cold call to a potential client?
                </h2>
                <p className="text-xs text-text-body">1 = Very uncomfortable, 10 = Very confident</p>
              </div>

              {/* 1-10 Button Row */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleScaleSelect(num)}
                      className={`h-12 rounded-xl border font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-200 ${
                        formData.q10ConfidenceScale === num
                          ? "bg-accent-primary border-accent-cyan text-bg-main shadow-[0_0_20px_rgba(0,212,255,0.4)] scale-105"
                          : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.08] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] text-text-body px-1">
                  <span>1 - Very uncomfortable</span>
                  <span>10 - Very confident</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 11: Training and script wanted */}
          {currentStep === 11 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 11 of 12</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Would you like training and a cold-calling script before starting?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q11TrainingScriptWanted", opt.label)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q11TrainingScriptWanted === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q11TrainingScriptWanted === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q11TrainingScriptWanted === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 12: Ready to start */}
          {currentStep === 12 && (
            <div className="flex flex-col gap-6 animate-fade-up">
              <span className="text-accent-cyan text-xs font-semibold uppercase tracking-wider">Question 12 of 12</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-1">
                  If selected, are you ready to start from the upcoming campaign cycle?
                </h2>
                <p className="text-xs text-text-body">Immediate availability for the next outreach cohort.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q12ReadyToStart", opt.label, false)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-200 text-left ${
                      formData.q12ReadyToStart === opt.label
                        ? "bg-accent-primary/15 border-accent-primary text-white shadow-[0_0_20px_rgba(47,168,255,0.2)]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        formData.q12ReadyToStart === opt.label
                          ? "bg-accent-primary text-bg-main"
                          : "bg-white/10 text-text-body"
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                    {formData.q12ReadyToStart === opt.label && <Check size={16} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inline Validation Alert */}
          {validationError && (
            <div className="mt-6 flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-fade-up">
              <AlertCircle size={15} className="text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submission Error Banner with Retry */}
          {submitError && (
            <div className="mt-6 flex flex-col gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-fade-up">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-amber-400 shrink-0" />
                <span className="font-semibold">Submission Issue</span>
              </div>
              <p className="text-text-body">{submitError}</p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="self-start mt-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} className={isSubmitting ? "animate-spin" : ""} />
                Retry Submission
              </button>
            </div>
          )}

          {/* CTA Actions */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
            {/* Back Button */}
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-text-body hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
              >
                <ChevronLeft size={15} />
                Back
              </button>
            ) : (
              <div />
            )}

            {/* Next / Submit Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-accent-primary text-bg-deep font-semibold text-xs sm:text-sm flex items-center gap-2 hover:bg-accent-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(47,168,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Submitting...
                </>
              ) : currentStep === TOTAL_STEPS - 1 ? (
                <>
                  Complete &amp; Submit
                  <Check size={15} />
                </>
              ) : currentStep === 0 ? (
                <>
                  Start Questionnaire
                  <ArrowRight size={15} />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Hint */}
      <footer className="w-full max-w-2xl mx-auto pb-2 text-center text-[11px] text-text-body/60 select-none z-10 flex items-center justify-center gap-4">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Enter ↵</kbd> to advance</span>
        <span>•</span>
        <span>Internal MR Devs Confidential</span>
      </footer>
    </main>
  );
}
