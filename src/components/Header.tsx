import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
  threatCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#f8f9ff]/85 backdrop-blur-xl border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-4xl mx-auto h-16 px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="ScamShield AI Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WmWqVPpj8tjiCBuOJ6ZA3XZTe_ttJabIbK_QF78xFG5CmOiNcfAH_wJZ6Y1IQe_RRMF2S72bNEIbx_xVYlEVhvMZ5af9Uu0bByqbhrR08xLWlFY5eC5ir_wlJt7_HBWcILxnkaPZP1KjNam0MSevLZpp85blJuizyZIHw0jYEDbMccP5H7V3g1ztDClbB7BcCY6f6i5S7lY_p1DtJKB7n8mBQACP4F6lNR8mN_LEL-w9Ff8fYZE9aDG4wO"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-['Space_Grotesk'] text-lg sm:text-xl font-semibold text-[#000922] tracking-tight truncate leading-tight">
                ScamShield AI
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] bg-[#e5eeff] text-[#00476e] font-['JetBrains_Mono'] text-[10px] uppercase font-semibold tracking-wider">
                SECURE SCAN
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#45464e] uppercase tracking-wider truncate">
              Analyzer
            </span>
          </div>
        </div>

        {/* Live system state & Profile avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#eff4ff] border border-[#dce9ff]"
            title="Security Status: Real-time Heuristics Active"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5bb8fe] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006398]"></span>
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#00476e] font-medium tracking-wide">
              ACTIVE
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            className="w-10 h-10 flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-[#006398]/30 transition-all focus:outline-none"
            aria-label="Account and Engine Settings"
            title="Forensic Engine Settings"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#c5c6cf]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBRZmS_e1FIsxgA_pJzmjWaNv-1m6929Gc1n-1mjbML7j44Rjq_FJ67YDBJ9vXlETC_AayNPz98LRXpoCwrUubq5F6rdvk9Hy2eizo_26KjrTPQLoIN4L0plnariTAxZN_rLM7Djr7kPDA_cUi_EWaRISYHzoBuZ5mJmD8xk3x4aY_qpC2BoiE_gJcO607bKhVtofjV8LDEaIQ9xzl__fmbcthakI61qLbybfDmuIq7M5iI4EMluMJlA"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
