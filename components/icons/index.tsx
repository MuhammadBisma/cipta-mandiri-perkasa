import type React from "react"

export const KubahIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Kubah utama */}
    <path d="M4 14a8 8 0 0 1 16 0v4H4v-4z" />
    {/* Puncak kubah */}
    <path d="M12 4c2 2 2 3 2 5h-4c0-2 0-3 2-5z" />
    {/* Pintu masjid */}
    <rect x="9" y="14" width="6" height="6" rx="1" />
  </svg>
);


export const MimbarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Mimbar utama */}
    <rect x="6" y="10" width="12" height="8" rx="1" />
    {/* Tangga mimbar */}
    <path d="M6 18h12" />
    <path d="M8 16h8" />
    <path d="M10 14h4" />
    {/* Tiang dan podium */}
    <path d="M12 10V6" />
    <circle cx="12" cy="4" r="2" />
  </svg>
);

export const MenaraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Menara utama */}
    <path d="M10 22V10l2-6 2 6v12" />
    {/* Puncak menara */}
    <path d="M12 2l3 3h-6l3-3z" />
    {/* Jendela menara */}
    <path d="M12 14v4" />
  </svg>
);

export const KerawanganIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Pola utama kerawangan */}
    <circle cx="12" cy="12" r="4" />
    <path d="M4 4l4 4" />
    <path d="M16 4l4 4" />
    <path d="M4 20l4-4" />
    <path d="M16 20l4-4" />
    {/* Detail tambahan */}
    <path d="M2 12h4" />
    <path d="M18 12h4" />
  </svg>
);

export const OrnamentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Ornamen utama berbentuk bintang atau pola islami */}
    <path d="M12 2l3 5h5l-4 4 2 5-5-2-5 2 2-5-4-4h5z" />
    {/* Detail tambahan */}
    <circle cx="12" cy="12" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="16" cy="8" r="1" />
    <circle cx="8" cy="16" r="1" />
    <circle cx="16" cy="16" r="1" />
  </svg>
);

export const KaligrafiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Bentuk utama awan kaligrafi */}
    <path d="M4 15c0-4 3-6 7-6s7 2 7 6-3 6-7 6-7-2-7-6z" />
    {/* Pola ornamen di dalam awan */}
    <path d="M9 15a3 3 0 0 1 6 0" />
    <path d="M12 12v6" />
  </svg>
);

export const MasjidIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Kubah utama masjid */}
    <path d="M12 2c3 2 4 5 4 7v1h-8v-1c0-2 1-5 4-7z" />
    {/* Menara kiri dan kanan */}
    <path d="M4 10h3v10H4z" />
    <path d="M17 10h3v10h-3z" />
    {/* Pintu masjid */}
    <path d="M9 20v-6h6v6" />
    {/* Garis dasar */}
    <path d="M2 22h20" />
  </svg>
);

