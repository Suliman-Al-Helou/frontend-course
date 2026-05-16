// components/Logo.tsx
// الخلفية تتكيف تلقائياً مع light/dark mode عبر CSS variables

interface LogoProps {
  size?: number;        // حجم الأيقونة (default: 40)
  className?: string;
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 680 680"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Future House"
      role="img"
    >
      {/* خلفية تتكيف مع الثيم */}
      <rect width="680" height="680" fill="transparent" />

      {/* ══ ROOF ══ */}
      <polygon points="340,95  128,310  163,325  340,147" fill="#0d1f4e"/>
      <polygon points="340,147 163,325  210,318  340,165" fill="#1a3a8a"/>
      <polygon points="340,147 340,95  315,140" fill="#2a5cb8"/>
      <polygon points="340,95  315,140  325,160  340,147" fill="#3a8fd4"/>
      <polygon points="340,95  552,310  517,325  340,147" fill="#0d2258"/>
      <polygon points="340,147 517,325  470,315  340,165" fill="#1e4a9a"/>
      <polygon points="340,95  365,140  355,160  340,147" fill="#4ab0e0"/>
      <polygon points="340,95  552,310  510,295  365,140" fill="#2870c0"/>
      <polygon points="470,315 510,295  520,310  517,325" fill="#5ac0e8"/>
      <polygon points="365,140  470,260  470,315  340,165" fill="#1e5ab0"/>
      <polygon points="470,260  510,295  470,315" fill="#3898d8"/>
      <polygon points="163,325  210,318  220,340  155,340" fill="#0a1840"/>
      <polygon points="210,318  255,310  255,340  220,340" fill="#152e70"/>
      <polygon points="517,325  470,315  465,340  525,340" fill="#0a1840"/>
      <polygon points="470,315  425,310  425,340  465,340" fill="#152e70"/>

      {/* ══ LEFT WALL ══ */}
      <polygon points="128,310  183,310  183,560  128,560" fill="#0d1f4e"/>
      <polygon points="155,310  183,310  183,420  155,420" fill="#152e70"/>
      <polygon points="128,420  155,420  155,560  128,560" fill="#0a1840"/>

      {/* ══ RIGHT WALL ══ */}
      <polygon points="497,310  552,310  552,560  497,560" fill="#0d2258"/>
      <polygon points="497,310  525,310  525,420  497,420" fill="#1e4a9a"/>
      <polygon points="525,420  552,420  552,560  525,560" fill="#3898d8"/>
      <polygon points="497,420  525,420  525,560  497,560" fill="#2060b0"/>

      {/* ══ F LETTER ══ */}
      <polygon points="175,365  225,365  225,545  175,545" fill="#1a3a8a"/>
      <polygon points="190,365  225,365  225,460  190,460" fill="#2a5cb8"/>
      <polygon points="175,460  210,460  210,545  175,545" fill="#0d2258"/>
      <polygon points="175,365  340,365  340,410  175,410" fill="#1e4a9a"/>
      <polygon points="210,365  340,365  310,395  200,395" fill="#2a5cb8"/>
      <polygon points="310,395  340,365  340,410  320,410" fill="#3a7fd4"/>
      <polygon points="175,450  300,450  300,490  175,490" fill="#1a3a8a"/>
      <polygon points="200,450  300,450  280,480  190,480" fill="#2a60c0"/>

      {/* ══ H LETTER ══ */}
      <polygon points="365,365  415,365  415,545  365,545" fill="#1e7ab8"/>
      <polygon points="375,365  415,365  415,460  380,460" fill="#3a9ed8"/>
      <polygon points="365,460  405,460  405,545  365,545" fill="#1a6aaa"/>
      <polygon points="460,365  510,365  510,545  460,545" fill="#2a8cd0"/>
      <polygon points="460,365  510,365  510,455  475,455" fill="#5ac0e8"/>
      <polygon points="460,455  500,455  510,545  460,545" fill="#1e70b8"/>
      <polygon points="365,450  510,450  510,490  365,490" fill="#2880c8"/>
      <polygon points="390,450  510,450  490,480  375,480" fill="#4aaee0"/>
    </svg>
  );
}