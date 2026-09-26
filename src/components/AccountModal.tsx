import React from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onClearAll }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-[#e5eeff] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2.5">
            <img
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-[#c5c6cf]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBRZmS_e1FIsxgA_pJzmjWaNv-1m6929Gc1n-1mjbML7j44Rjq_FJ67YDBJ9vXlETC_AayNPz98LRXpoCwrUubq5F6rdvk9Hy2eizo_26KjrTPQLoIN4L0plnariTAxZN_rLM7Djr7kPDA_cUi_EWaRISYHzoBuZ5mJmD8xk3x4aY_qpC2BoiE_gJcO607bKhVtofjV8LDEaIQ9xzl__fmbcthakI61qLbybfDmuIq7M5iI4EMluMJlA"
            />
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#000922]">
                Security Officer Workspace
              </h3>
              <p className="font-['JetBrains_Mono'] text-xs text-[#006398]">
                Forensic Node ID: SCAM-NODE-9482
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#75777f] hover:text-black p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 py-4 text-xs font-['Geist']">
          <div className="bg-[#eff4ff] p-3 rounded-lg border border-[#dce9ff] flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="font-['JetBrains_Mono'] font-bold text-[#000922]">Zero-Log Privacy Engine</span>
              <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#00476e] font-['JetBrains_Mono'] text-[10px] font-bold">
                ENFORCED
              </span>
            </div>
            <p className="text-[#45464e] leading-relaxed">
              Texts and screenshots analyzed inside ScamShield are processed in memory and never logged to permanent public databases or ad trackers.
            </p>
          </div>

          <div className="border border-[#e5eeff] p-3 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[#75777f]">Heuristic Model:</span>
              <span className="font-['JetBrains_Mono'] font-semibold text-[#000922]">Gemini 3.8 Flash + Local Sandbox</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75777f]">Active Feed:</span>
              <span className="font-['JetBrains_Mono'] text-[#006398] font-semibold">14,290+ weekly intercepts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#75777f]">Engine Telemetry:</span>
              <span className="font-['JetBrains_Mono'] text-[#059669] font-semibold">Online &amp; Calibrated</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClearAll();
                onClose();
              }}
              type="button"
              className="w-full py-2 px-3 rounded-lg border border-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]/20 font-['JetBrains_Mono'] text-xs font-semibold transition-colors"
            >
              Reset Local Vault &amp; History
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-[#e5eeff] text-center">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-2 bg-[#000922] text-white rounded-lg font-['JetBrains_Mono'] text-xs font-semibold hover:bg-[#0f2042]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
