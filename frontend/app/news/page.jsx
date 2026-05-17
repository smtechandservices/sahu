"use client";

import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import NewsHero from "../../components/News/NewsHero";
import NewsList from "../../components/News/NewsList";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header />
      <main>
        <NewsHero searchQuery={searchQuery} onSearch={setSearchQuery} />
        <NewsList searchQuery={searchQuery} />
      </main>
      <Footer />
    </>
  );
}
