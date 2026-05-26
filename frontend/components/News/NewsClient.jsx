"use client";

import { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import NewsHero from "./NewsHero";
import NewsList from "./NewsList";

export default function NewsClient() {
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
