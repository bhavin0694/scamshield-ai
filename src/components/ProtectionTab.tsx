import React, { useState } from 'react';

export const ProtectionTab: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const emergencyChecklist = [
    {
      title: '1. If you clicked a suspicious link',
      desc: 'Close the browser tab immediately. Do NOT enter passwords, phone numbers, or credit card CVV codes.',
      action: 'Disconnect Wi-Fi or Cellular temporarily to abort background payload scripts.'
    },
    {
      title: '2. If you typed banking credentials',
      desc: 'Open your bank official mobile app directly (not via browser link) or call the number on your card.',
      action: 'Request immediate freeze of online access and password change with bank fraud desk.'
    },
    {
      title: '3. If you shared a One-Time Code (OTP)',
      desc: 'An attacker is attempting real-time account takeover or wire transfer.',
      action: 'Contact the service (Google, Chase, Apple, WhatsApp) to revoke active sessions and reset 2FA.'
    },
    {
      title: '4. Report smishing to carrier (7726)',
      desc: 'Most major US/UK/global carriers monitor smishing networks via 7726 (spells SPAM).',
      action: 'Forward the full message to 7726. Carrier will reply asking for the sender number.'
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-6 pt-2 pb-10">
      {/* Header */}
      <div className="pb-4">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#e5eeff] text-[#00476e] mb-1">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider font-semibold">
            DEFENSE PROTOCOLS
          </span>
        </div>
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#000922]">
          Scam Defense &amp; Triage Center
        </h2>
        <p className="font-['Geist'] text-xs sm:text-sm text-[#45464e]">
          Immediate countermeasures, carrier reporting procedures, and anti-fraud protocols.
        </p>
      </div>

      {/* Carrier Forwarding Banner */}
      <div className="bg-[#0f2042] text-white rounded-xl p-4 sm:p-5 mb-5 shadow-sm border border-[#5bb8fe]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#5bb8fe]">cell_tower</span>
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#5bb8fe] font-bold">
              FREE GLOBAL CARRIER SHORTCODE
            </span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-lg font-bold">
            Forward spam &amp; smishing to 7726
          </h3>
          <p className="font-['Geist'] text-xs text-[#d3e4fe] max-w-lg mt-1">
            Forward suspicious texts to 7726 (SPAM). Carriers analyze domain headers and coordinate with federal authorities to take down malicious hosts.
          </p>
        </div>
        <div className="bg-[#ffffff]/10 px-4 py-2.5 rounded-lg border border-white/20 text-center flex-shrink-0">
          <div className="font-['Space_Grotesk'] text-2xl font-bold tracking-widest text-[#5bb8fe]">
            7726
          </div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#d3e4fe]">
            (S - P - A - M)
          </div>
        </div>
      </div>

      {/* Emergency Incident Checklist */}
      <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#000922] mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">emergency</span>
        Emergency Incident Response Checklist
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {emergencyChecklist.map((step, idx) => (
          <div
            key={idx}
            onClick={() => setActiveStep(activeStep === idx ? null : idx)}
            className="bg-[#ffffff] border border-[#e5eeff] rounded-xl p-3.5 shadow-xs cursor-pointer hover:border-[#006398] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#000922]">
                {step.title}
              </span>
              <span className="material-symbols-outlined text-[#75777f] text-[18px]">
                {activeStep === idx ? 'expand_less' : 'expand_more'}
              </span>
            </div>
            <p className="font-['Geist'] text-xs text-[#45464e] mt-1">{step.desc}</p>
            {activeStep === idx && (
              <div className="mt-2.5 pt-2 border-t border-[#eff4ff] bg-[#eff4ff] p-2.5 rounded-lg">
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-[#006398] uppercase block mb-0.5">
                  RECOMMENDED IMMEDIATE ACTION:
                </span>
                <span className="font-['Geist'] text-xs text-[#0b1c30]">
                  {step.action}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4 Golden Smishing Rules */}
      <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#000922] mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#006398] text-[20px]">gavel</span>
        4 Golden Anti-Smishing Rules
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="bg-[#ffffff] border border-[#e5eeff] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">do_not_disturb</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold text-[#000922]">Never Tap Shortened Links</span>
          </div>
          <p className="font-['Geist'] text-xs text-[#45464e]">
            bit.ly, tinyurl, or odd TLDs (.top, .xyz, .cc) mask malicious proxy collectors designed to harvest bank cookies.
          </p>
        </div>

        <div className="bg-[#ffffff] border border-[#e5eeff] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">lock_reset</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold text-[#000922]">Banks Don't Request OTPs</span>
          </div>
          <p className="font-['Geist'] text-xs text-[#45464e]">
            A legitimate bank fraud representative will NEVER ask you to read back a verification code sent to your phone.
          </p>
        </div>

        <div className="bg-[#ffffff] border border-[#e5eeff] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#cf7000] text-[18px]">hourglass_empty</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold text-[#000922]">Urgency is the Attack Vector</span>
          </div>
          <p className="font-['Geist'] text-xs text-[#45464e]">
            "Immediate action required in 15 minutes or your account will be deleted" is engineered psychological panic.
          </p>
        </div>

        <div className="bg-[#ffffff] border border-[#e5eeff] p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#006398] text-[18px]">contact_phone</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold text-[#000922]">Use Official Inbound Channels</span>
          </div>
          <p className="font-['Geist'] text-xs text-[#45464e]">
            Always open your bookmarked banking app or type www.usps.com manually into your browser address bar.
          </p>
        </div>
      </div>
    </div>
  );
};
