'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/i18n';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <select value={currentLocale} onChange={handleChange} style={{ position: 'fixed', top: 10, right: 10, zIndex: 100 }}>
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
