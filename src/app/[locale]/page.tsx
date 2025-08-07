"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

// Removemos a importação do CSS Module, pois o estilo será aplicado via globals.css
// import styles from "./page.module.css"; 

export default function HomePage() {
  const t = useTranslations("homePage");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/characters?name=${searchTerm}`);
  };

  return (
    <div className="home-container">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="header"
      >
        <Image
          src="/logo.png"
          alt="Rick and Morty Logo"
          width={250}
          height={100}
          priority
        />
        <h1 className="title">{t("title")}</h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="searchForm"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchInput"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="searchButton"
        >
          {t("searchButton")}
        </motion.button>
      </motion.form>
    </div>
  );
}