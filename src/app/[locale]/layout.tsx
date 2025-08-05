import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import i18n, { locales } from "@/i18n";
import type { Metadata } from "next";
import "../globals.css";

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export const metadata: Metadata = {
  title: "Rick and Morty App",
  description: "A challenge to build a Rick and Morty app.",
};

export default async function LocaleLayout({ children, params }: Props) {
  // A próxima linha vai carregar o arquivo de tradução.
  // Use a função `getRequestConfig` diretamente, que já faz a validação da locale.
  const config = await i18n({ locale: params.locale }).catch(() => null);

  // Se a configuração não for encontrada, significa que a locale é inválida.
  if (!config) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider
          locale={params.locale}
          messages={config.messages}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
