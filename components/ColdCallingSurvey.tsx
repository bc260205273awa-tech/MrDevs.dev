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
import gsap from "gsap";
import HeroParticles from "./HeroParticles";
import { getSupabaseClient } from "@/lib/supabaseClient";

// [NEW] Survey form state interface without Question 12
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

// [NEW] Exactly 11 Questions (Question 12 removed)
const TOTAL_QUESTIONS = 11;
const TOTAL_STEPS = 12; // Step 0 (Staff Info) + Steps 1 to 11

export default function ColdCallingSurvey() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<SurveyState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // [NEW] Master 3D Tilt Physics for the Main Container and Option Cards
  useEffect(() => {
    const card = mainCardRef.current;
    if (!card) return;

    const isMobile = typeof window !== "undefined" && (
      window.matchMedia("(pointer: coarse)").matches || 
      window.matchMedia("(hover: none)").matches
    );

    if (isMobile) {
      // Mobile subtle breathing wave
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(card, {
        rotationY: 3,
        rotationX: -3,
        duration: 3,
        ease: "sine.inOut"
      }).to(card, {
        rotationY: -3,
        rotationX: 3,
        duration: 3,
        ease: "sine.inOut"
      });
      return () => {
        tl.kill();
      };
    }

    // Desktop: Track mouse movement across window and apply 3D tilt to main card
    const handleMouseMoveWindow = (e: MouseEvent) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Calculate relative delta
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);

      const maxTilt = 8; // degrees for main frame
      gsap.to(card, {
        rotationY: dx * maxTilt,
        rotationX: -dy * maxTilt,
        transformPerspective: 1200,
        ease: "power2.out",
        duration: 0.35,
        overwrite: "auto",
      });

      // Also calculate spotlight coordinates
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${cardX}px`);
      card.style.setProperty("--mouse-y", `${cardY}px`);

      // Sub-cards spotlight
      const subCards = card.querySelectorAll<HTMLElement>(".tilt-button");
      subCards.forEach((sub) => {
        const sRect = sub.getBoundingClientRect();
        const sx = e.clientX - sRect.left;
        const sy = e.clientY - sRect.top;
        sub.style.setProperty("--mouse-x", `${sx}px`);
        sub.style.setProperty("--mouse-y", `${sy}px`);
      });
    };

    const handleMouseLeaveWindow = () => {
      if (!card) return;
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMoveWindow);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveWindow);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
    };
  }, []);

  // [NEW] Dynamic 3D tilt on individual button cards (re-attached on step change)
  useEffect(() => {
    const card = mainCardRef.current;
    if (!card) return;

    const isMobile = typeof window !== "undefined" && (
      window.matchMedia("(pointer: coarse)").matches || 
      window.matchMedia("(hover: none)").matches
    );

    if (isMobile) return;

    const buttons = card.querySelectorAll<HTMLElement>(".tilt-button");
    const cleanupList: (() => void)[] = [];

    buttons.forEach((btn) => {
      btn.style.transformStyle = "preserve-3d";
      btn.style.willChange = "transform";

      const onEnter = () => {
        gsap.to(btn, {
          scale: 1.03,
          z: 20,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        const btnMaxTilt = 12;
        gsap.to(btn, {
          rotationY: dx * btnMaxTilt,
          rotationX: -dy * btnMaxTilt,
          scale: 1.035,
          z: 25,
          transformPerspective: 600,
          ease: "power2.out",
          duration: 0.18,
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.to(btn, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          z: 0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      };

      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);

      cleanupList.push(() => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanupList.forEach((fn) => fn());
    };
  }, [currentStep]);

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

  // [NEW] Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting || isSubmitted) return;

      // Enter key handler
      if (e.key === "Enter" && !e.shiftKey) {
        if (currentStep === 2 && formData.q2ColdCallingExperience === "Yes" && document.activeElement?.tagName === "TEXTAREA") {
          return; // Allow multiline in textarea
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

  // Validation checker
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
      }, 220);
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
    }, 220);
  };

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
        submitted_at: new Date().toISOString(),
      };

      if (!supabase) {
        console.warn("Supabase credentials not configured in env. Storing in localStorage backup.", payload);
        if (typeof window !== "undefined") {
          const localSubmissions = JSON.parse(localStorage.getItem("mrdevs_cc_submissions") || "[]");
          localSubmissions.push(payload);
          localStorage.setItem("mrdevs_cc_submissions", JSON.stringify(localSubmissions));
        }
      } else {
        const { error } = await supabase.from("cold_calling_survey").insert([payload]);
        if (error) {
          throw new Error(error.message || "Failed to record survey response in Supabase.");
        }
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
    if (val <= 3) return "Developing - Requires script & training support";
    if (val <= 6) return "Moderate - Familiar with basic outreach principles";
    if (val <= 8) return "Confident - Comfortable qualifying leads & handling friction";
    return "High Performer - Strong objection handling & closing ability";
  };

  // [NEW] Confirmation Screen with 3D Holographic Tilt
  if (isSubmitted) {
    return (
      <main ref={containerRef} className="min-h-screen bg-bg-main text-text-heading flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-accent-primary/20 selection:text-white">
        <HeroParticles />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-cyan/15 rounded-full blur-[130px] pointer-events-none" />

        <div 
          ref={mainCardRef}
          style={{ transformStyle: "preserve-3d" }}
          className="spotlight-card relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 border-t-white/25 rounded-3xl p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.7)] text-center flex flex-col items-center animate-fade-up"
        >
          {/* 3D Elevated Logo Badge */}
          <div style={{ transform: "translateZ(35px)" }} className="mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-accent-cyan/25 rounded-3xl blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-bg-deep border border-accent-cyan/40 flex items-center justify-center p-4 shadow-[0_0_35px_rgba(0,212,255,0.35)]">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div style={{ transform: "translateZ(25px)" }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5DCAA5]/10 border border-[#5DCAA5]/30 text-[#5DCAA5] text-xs font-bold uppercase tracking-wider mb-5">
            <CheckCircle2 size={15} />
            Assessment Recorded
          </div>

          <h1 style={{ transform: "translateZ(30px)" }} className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Thanks - we will be in touch
          </h1>

          <p style={{ transform: "translateZ(20px)" }} className="text-text-body text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            Thank you, <span className="text-white font-medium">{formData.staffName}</span>. Your cold calling assessment has been safely submitted. Mubeen and the team will review your responses.
          </p>

          <div style={{ transform: "translateZ(15px)" }} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-xs text-text-body flex flex-col gap-3 text-left shadow-inner">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <span className="text-text-body font-medium">Team Member</span>
              <span className="text-white font-semibold">{formData.staffName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <span className="text-text-body font-medium">Position</span>
              <span className="text-white font-semibold">{formData.staffRole}</span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-text-body font-medium">Readiness Status</span>
              <span className="text-accent-cyan font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                Submitted &amp; Logged
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-bg-main text-text-heading flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans relative overflow-hidden selection:bg-accent-primary/20 selection:text-white">
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
            rgba(47, 168, 255, 0.14),
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
            rgba(0, 212, 255, 0.6),
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

      {/* Ambient Radial Background Glows */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-accent-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Floating Glass Header */}
      <header className="w-full max-w-4xl mx-auto pt-2 pb-6 z-20">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-bg-deep border border-accent-cyan/40 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(0,212,255,0.25)]">
              <Image
                src="/logo.png"
                alt="MR Devs"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide uppercase">MR Devs</span>
              <span className="text-[10px] text-accent-cyan font-medium">Internal Assessment</span>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-medium text-text-body flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            {currentStep === 0 ? (
              <span className="text-white font-semibold">Staff Identification</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold">Question {currentStep}</span>
                <span className="text-text-body/60">/</span>
                <span className="text-text-body">{TOTAL_QUESTIONS}</span>
                <span className="text-[10px] text-accent-cyan font-mono ml-1">({progressPercent}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Glowing Dynamic Progress Track */}
        <div className="w-full h-1.5 bg-white/5 backdrop-blur-sm border border-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-accent-primary via-accent-cyan to-accent-primary transition-all duration-300 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white blur-[3px]" />
          </div>
        </div>
      </header>

      {/* Main 3D Holographic Question Card */}
      <div className="flex-1 flex items-center justify-center my-4 z-10 w-full perspective-[1200px]">
        <div 
          ref={mainCardRef}
          style={{ transformStyle: "preserve-3d" }}
          className="spotlight-card w-full max-w-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-3xl p-6 sm:p-10 md:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.7)] relative overflow-hidden"
        >
          {/* Subtle Ambient Top Corner Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

          {/* STEP 0: Staff Info Identification */}
          {currentStep === 0 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-bold uppercase tracking-wider w-fit">
                <Sparkles size={14} className="animate-pulse" />
                <span>Cold Calling Readiness Check</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                  Staff Readiness Assessment
                </h1>
                <p className="text-text-body text-sm sm:text-base leading-relaxed max-w-xl">
                  This quick 11-question assessment evaluates readiness for upcoming outbound client communication campaigns. Please enter your name and current role to get started.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="tilt-button spotlight-card flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                  <label className="text-xs font-semibold text-text-heading flex items-center gap-2">
                    <User size={14} className="text-accent-cyan" />
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
                    className="w-full px-4 py-3 bg-[#0A0F1C]/90 border border-white/10 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-sm focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200"
                  />
                </div>

                <div className="tilt-button spotlight-card flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                  <label className="text-xs font-semibold text-text-heading flex items-center gap-2">
                    <Briefcase size={14} className="text-accent-cyan" />
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
                    className="w-full px-4 py-3 bg-[#0A0F1C]/90 border border-white/10 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-sm focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Phone Calls */}
          {currentStep === 1 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <PhoneCall size={14} />
                <span>Question 1 of 11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Comfortable speaking with potential clients on a phone call?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Somewhat" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q1ComfortableCalls", opt.label)}
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q1ComfortableCalls === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q1ComfortableCalls === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q1ComfortableCalls === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Cold Calling Experience (Conditional Follow-up) */}
          {currentStep === 2 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <Target size={14} />
                <span>Question 2 of 11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Done cold calling before?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q2ColdCallingExperience", opt.label, opt.label === "No")}
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q2ColdCallingExperience === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q2ColdCallingExperience === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q2ColdCallingExperience === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>

              {/* Conditional Follow-up textarea if Yes */}
              {formData.q2ColdCallingExperience === "Yes" && (
                <div className="tilt-button spotlight-card flex flex-col gap-2.5 p-5 rounded-2xl bg-white/[0.02] border border-accent-cyan/30 mt-2 animate-fade-up">
                  <label className="text-xs font-semibold text-accent-cyan flex items-center gap-2">
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
                    className="w-full px-4 py-3.5 bg-[#0A0F1C]/90 border border-white/10 focus:border-accent-cyan rounded-xl text-white placeholder-[#5F5E5A] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Calling Business Owner */}
          {currentStep === 3 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <User size={14} />
                <span>Question 3 of 11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
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
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q3CallingBusinessOwner === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.01]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q3CallingBusinessOwner === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q3CallingBusinessOwner === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Call Volume */}
          {currentStep === 4 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <Gauge size={14} />
                <span>Question 4 of 11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
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
                    className={`tilt-button spotlight-card flex flex-col items-center justify-center p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      formData.q4CallsPerDay === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-105"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-accent-cyan/80 mb-1">[{opt.key}]</span>
                    <span className="text-2xl font-bold text-white">{opt.label}</span>
                    <span className="text-[11px] text-text-body mt-1 font-normal">calls/day</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Objections */}
          {currentStep === 5 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>Question 5 of 11</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug mb-3">
                  Comfortable handling common objections?
                </h2>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-text-body leading-relaxed flex flex-col gap-1.5">
                  <span className="text-accent-cyan font-semibold">Common objections to navigate:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-text-body/90">
                    <span>• &quot;Not interested&quot;</span>
                    <span>• &quot;We already have a website&quot;</span>
                    <span>• &quot;Send me details on WhatsApp&quot;</span>
                    <span>• &quot;How much does it cost?&quot;</span>
                    <span>• &quot;I&apos;m busy right now&quot;</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-1">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                  { key: "C", label: "Need training" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q5HandlingObjections", opt.label)}
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q5HandlingObjections === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q5HandlingObjections === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q5HandlingObjections === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Languages Multi-Select */}
          {currentStep === 6 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                  <Languages size={14} />
                  <span>Question 6 of 11</span>
                </div>
                <span className="text-[11px] text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 px-3 py-1 rounded-full font-semibold">
                  Multi-select
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug mb-1">
                  Comfortable speaking in:
                </h2>
                <p className="text-xs text-text-body">Select all languages and dialects you are comfortable conducting calls in.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
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
                      className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                        isChecked
                          ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)]"
                          : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{lang}</span>
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-accent-cyan border-accent-cyan text-bg-deep shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                          : "border-white/20 bg-white/5"
                      }`}>
                        {isChecked && <Check size={16} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: Regular Calling */}
          {currentStep === 7 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <Volume2 size={14} />
                <span>Question 7 of 11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Willing to make cold calls regularly as part of MR Devs responsibilities?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q7RegularCallsWillingness", opt.label)}
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q7RegularCallsWillingness === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q7RegularCallsWillingness === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q7RegularCallsWillingness === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Phone & SIM */}
          {currentStep === 8 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <Smartphone size={14} />
                <span>Question 8 of 11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Do you have a phone and SIM you can make business calls with?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q8PhoneSimAvailable", opt.label)}
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q8PhoneSimAvailable === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q8PhoneSimAvailable === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q8PhoneSimAvailable === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: Calling Package */}
          {currentStep === 9 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <CreditCard size={14} />
                <span>Question 9 of 11</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Comfortable using a company-provided calling package on your existing number initially?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q9CompanyCallingPackage", opt.label)}
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q9CompanyCallingPackage === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q9CompanyCallingPackage === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q9CompanyCallingPackage === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: Confidence Scale 1-10 */}
          {currentStep === 10 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <Gauge size={14} />
                <span>Question 10 of 11</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug mb-2">
                  Confidence making a cold call to a potential client?
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
                  <span>Rating: {formData.q10ConfidenceScale || "—"} / 10</span>
                  <span className="text-text-body font-normal">• {getScaleFeedback(formData.q10ConfidenceScale)}</span>
                </div>
              </div>

              {/* 1-10 Glowing Number Tiles */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleScaleSelect(num)}
                      className={`tilt-button spotlight-card h-14 rounded-2xl border font-bold text-base flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                        formData.q10ConfidenceScale === num
                          ? "bg-accent-cyan border-accent-cyan text-bg-deep shadow-[0_0_25px_rgba(0,212,255,0.6)] scale-110 z-10"
                          : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.08] hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span>{num}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-text-body px-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                    1 - Very Uncomfortable
                  </span>
                  <span className="flex items-center gap-1.5">
                    10 - Very Confident
                    <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 11: Training and Script */}
          {currentStep === 11 && (
            <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-6 animate-fade-up relative z-10">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider">
                <GraduationCap size={14} />
                <span>Question 11 of 11 (Final)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Would you like training and a cold-calling script before starting?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {[
                  { key: "A", label: "Yes" },
                  { key: "B", label: "No" },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSingleSelect("q11TrainingScriptWanted", opt.label, false)}
                    className={`tilt-button spotlight-card flex items-center justify-between p-5 rounded-2xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      formData.q11TrainingScriptWanted === opt.label
                        ? "bg-accent-primary/20 border-accent-cyan text-white shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-white/10 text-text-body hover:bg-white/[0.07] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        formData.q11TrainingScriptWanted === opt.label
                          ? "bg-accent-cyan text-bg-deep shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                          : "bg-white/10 text-text-body border border-white/10"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base">{opt.label}</span>
                    </div>
                    {formData.q11TrainingScriptWanted === opt.label && <Check size={18} className="text-accent-cyan" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation Alert */}
          {validationError && (
            <div className="mt-6 flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-fade-up">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div className="mt-6 flex flex-col gap-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-fade-up">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400 shrink-0" />
                <span className="font-semibold">Submission Notice</span>
              </div>
              <p className="text-text-body">{submitError}</p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="self-start mt-1 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-xs flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={13} className={isSubmitting ? "animate-spin" : ""} />
                Retry Submission
              </button>
            </div>
          )}

          {/* Navigation Controls Dock */}
          <div style={{ transform: "translateZ(30px)" }} className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5 relative z-10">
            {/* Back Button */}
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="tilt-button px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-text-body hover:text-white text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft size={16} />
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
              className="tilt-button px-7 py-3.5 rounded-2xl bg-accent-primary hover:bg-accent-cyan text-bg-deep font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-glow hover:shadow-glow-cyan hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Recording Response...
                </>
              ) : currentStep === TOTAL_STEPS - 1 ? (
                <>
                  Submit Assessment
                  <Check size={16} />
                </>
              ) : currentStep === 0 ? (
                <>
                  Begin Assessment
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <footer className="w-full max-w-3xl mx-auto pb-2 text-center text-xs text-text-body/60 select-none z-10 flex flex-wrap items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          Press <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px] border border-white/10">Enter ↵</kbd> or click to advance
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          Use keys <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px] border border-white/10">A</kbd>-<kbd className="px-1.5 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px] border border-white/10">E</kbd> for quick choice
        </span>
      </footer>
    </main>
  );
}
