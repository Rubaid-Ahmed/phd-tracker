import { useState } from 'react';

const COLORS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-indigo-600',
];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return COLORS[Math.abs(hash) % COLORS.length];
}

function initials(name) {
  const words = name.replace(/[()]/g, '').trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + (words[1][0] || '')).toUpperCase();
}

export default function UniversityLogo({ name, domain, size = 56, className = '' }) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        onError={() => setImgError(true)}
        className={`object-contain rounded-lg bg-white ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const color = colorFor(name);
  return (
    <div
      className={`rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials(name)}
    </div>
  );
}
