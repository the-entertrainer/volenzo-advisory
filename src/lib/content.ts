/**
 * SINGLE SOURCE OF TRUTH — All original Volenzo Advisory copy preserved verbatim.
 * Only visuals, interactions, and structure modernized to 3D + React.
 * DO NOT CHANGE STRINGS HERE without explicit stakeholder approval.
 */

export const content = {
  meta: {
    title: "Volenzo Advisory — Stop the Revenue Leak",
    description: "Volenzo Advisory — India's only agency-side aviation advisor. We recover the ₹25L a year your agency loses to ADMs, NDC blindspots and GDS erosion. Built by IndiGo & Accelya alumni.",
  },

  nav: {
    logoAlt: "Volenzo Advisory",
    links: [
      { label: "The Problem", href: "#problem" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
    cta: "Stop the Leak",
  },

  hero: {
    badge: "IndiGo × Accelya alumni · Agency-side only",
    h1: "Your agency is\nbleeding ₹25L.",
    subPrefix: "Right now it's ",
    // The rotating/typed lines from original (we can animate via GSAP or simple React cycle)
    subLines: [
      "losing to ADM surprises.",
      "blind to NDC revenue.",
      "leaving GDS incentives on the table.",
      "bleeding ₹25L a year.",
    ],
    ctaPrimary: "Stop the Leak",
    ctaSecondary: "How it works ↓",
    trust: "No retainer · 24h response · 100% confidential",
    visualAlt: "Commercial aircraft",
    // Original floating value tags (will become 3D holographics)
    tags: [
      { label: "ADM challenged", value: "+₹8.4L", key: "adm" },
      { label: "NDC recovered", value: "+₹6.1L", key: "ndc" },
    ],
  },

  marquee: [
    "ADM Defence",
    "NDC Navigation",
    "GDS Optimisation",
    "₹25L Average Leak",
    "IndiGo Alumni",
    "Revenue Recovery",
  ],

  metrics: [
    { value: 1, suffix: " Cr+", label: "Recovered for agencies", id: "recovered" },
    { value: 30, suffix: " days", label: "ADM challenge window", id: "window" },
    { value: 25, prefix: "₹", suffix: "L avg", label: "Average annual leak", id: "leak" },
  ],

  problem: {
    title: "Three leaks.\nOne bleeding agency.",
    leaks: [
      {
        idx: "01",
        name: "ADM Deductions",
        desc: "Airlines raise debit memos without warning. You have 30 days. Most agencies miss every one.",
        loss: "₹5–12L",
        lossWord: "gone",
      },
      {
        idx: "02",
        name: "NDC Blindspot",
        desc: "40% of IndiGo is now NDC-only. On GDS you're missing fares and losing override income on every booking.",
        loss: "₹4–10L",
        lossWord: "gone",
      },
      {
        idx: "03",
        name: "GDS Erosion",
        desc: "Incentive contracts get renegotiated every 3–5 years. Without data and leverage, agencies always leave money behind.",
        loss: "₹3–8L",
        lossWord: "gone",
      },
    ],
  },

  services: {
    title: "Three fixes.\nOne call.",
    note: "Built by IndiGo and Accelya alumni — we know the airline playbook because we helped write it. Now we use it to fight for agencies.",
    items: [
      {
        idx: "01",
        name: "NDC Navigation",
        desc: "Close inventory gaps and protect override income as GDS share contracts.",
        featured: false,
      },
      {
        idx: "02",
        name: "ADM Defence",
        desc: "Audit BSP data, flag invalid charges, challenge inside the 30-day window before the money is permanently gone.",
        featured: true,
      },
      {
        idx: "03",
        name: "GDS Optimisation",
        desc: "Restructure PLB incentives, benchmark contracts, capture every basis point of available income.",
        featured: false,
      },
    ],
  },

  contact: {
    title: "The first call\ncosts nothing.",
    sub: "ADM windows close at 30 days. Every day you wait is money gone.",
    form: {
      name: { label: "Your name", placeholder: "Rajesh Sharma" },
      agency: { label: "Agency name", placeholder: "Sharma Travel Pvt Ltd" },
      email: { label: "Work email", placeholder: "rajesh@sharmatravel.in" },
      challenge: {
        label: "Biggest challenge right now",
        placeholder: "e.g. An IndiGo ADM from March we couldn't challenge, plus the NDC migration…",
      },
      submit: "Recover My Revenue",
    },
    note: "No sales pitch. Just an honest conversation about your numbers.",
    chips: ["24h response", "No retainer", "100% confidential"],
  },

  footer: {
    copyright: "© 2026 Volenzo Advisory. All rights reserved.",
    credits: 'Photo: <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a>',
    links: [
      { label: "The Problem", href: "#problem" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
  },

  // Preserved rich data pool from the original Bloomberg-style terminal (for 3D DataCard3D usage)
  terminalDataPool: [
    { label: 'ADM RAISED', range: [3.2, 14.5], dec: 1, prefix: '-₹', suffix: 'L', metas: ['6E-2847 · BOM-DEL', '6E-1124 · DEL-CCU', 'AI-302 · BOM-HYD'], statuses: ['PENDING', 'OVERDUE', 'ESCALATED'], type: 'danger' },
    { label: 'FARE MISSED', range: [820, 2100], dec: 0, prefix: '₹', suffix: '/pax', metas: ['NDC vs GDS · 6E', 'NDC gap · AI', 'NDC vs BSP · SG'], statuses: ['NDC ONLY', 'MISSED', 'GAP OPEN'], type: 'warning' },
    { label: 'BSP VARIANCE', range: [1.4, 6.8], dec: 1, prefix: '-₹', suffix: 'L', metas: ['Q2 FY26 · Monthly', 'Q3 FY26 · YTD', 'Oct FY26 · BSP'], statuses: ['UNRECOVERED', 'PARTIAL', 'AUDIT DUE'], type: 'danger' },
    { label: 'OVERRIDE AT RISK', range: [2.0, 7.5], dec: 1, prefix: '+₹', suffix: 'L', metas: ['GDS Incentive · 1A', 'PLB Q3 · 1W', 'Override · Sabre'], statuses: ['RENEWAL DUE', 'EXPIRING', 'CRITICAL'], type: 'warning' },
    { label: 'ADM WINDOW', range: [5, 28], dec: 0, prefix: '', suffix: ' days', metas: ['ADM #4471 · IndiGo', 'ADM #6612 · AI', 'ADM #2291 · 6E'], statuses: ['EXPIRING', 'CRITICAL', 'FINAL'], type: 'warning' },
    { label: 'RECOVERABLE', range: [18, 38], dec: 0, prefix: '₹', suffix: 'L/yr', metas: ['3 active leaks', '4 open ADMs', '2 NDC gaps'], statuses: ['ACT NOW', 'URGENT', 'OPEN'], type: 'blue' },
    { label: 'GDS INCENTIVE', range: [1.2, 5.5], dec: 1, prefix: '+₹', suffix: 'L', metas: ['Q3 Target · 1A', 'PLB FY26 · 1W', 'Override · GDS'], statuses: ['ON TRACK', 'Q3 TARGET', 'CLOSE'], type: 'blue' },
    { label: 'NDC SAVINGS', range: [380, 1850], dec: 0, prefix: '₹', suffix: '/bkg', metas: ['IndiGo NDC · Avg', 'SpiceJet NDC', 'Air India NDC'], statuses: ['ACTIVE', 'ENABLED', 'LIVE'], type: 'blue' },
    { label: 'PLB SHORTFALL', range: [0.5, 4.2], dec: 1, prefix: '-₹', suffix: 'L', metas: ['Q3 FY26 · Target', 'H2 FY26 · PLB', 'Annual · PLB'], statuses: ['MISSED', 'AT RISK', 'FLAGGED'], type: 'danger' },
    { label: 'DEBIT MEMOS', range: [3, 17], dec: 0, prefix: '', suffix: ' open', metas: ['IndiGo · FY26', 'Air India · Q3', 'All airlines'], statuses: ['PENDING', 'CRITICAL', 'OVERDUE'], type: 'danger' },
    { label: 'YIELD LOSS', range: [1.1, 5.8], dec: 1, prefix: '-₹', suffix: 'L/mo', metas: ['NDC miss · 6E', 'Fare gap · SG', 'GDS drift · 1A'], statuses: ['ONGOING', 'FLAGGED', 'MONITORED'], type: 'warning' },
    { label: 'COMMISSION GAP', range: [0.8, 3.5], dec: 1, prefix: '-₹', suffix: 'L', metas: ['6E Agency · Q3', 'AI Group · FY26', 'BSP audit · Q2'], statuses: ['AUDIT DUE', 'OPEN', 'UNRESOLVED'], type: 'danger' },
  ],
} as const;

export type Content = typeof content;
