'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/i18n';
import { useClickSound } from '@/utils/useClickSound';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const playClick = useClickSound();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    playClick(); // toca o som
    router.push(newPath);
  };

  return (
    <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 100 }}>
      <label htmlFor="locale-select" style={{ marginRight: 8 }}>🌐</label>
      <select
        id="locale-select"
        value={currentLocale}
        onChange={handleChange}
        aria-label="Trocar idioma"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
