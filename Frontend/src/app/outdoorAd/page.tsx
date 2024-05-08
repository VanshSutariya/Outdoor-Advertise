"use client";
import Categories from "@/components/filter/categarious";
import Header from "../../components/Header";
import SearchBar from "@/components/searchBar/SearchBar";
import Footer from "@/components/Footer";
export default function OutdoorAd() {
  return (
    <>
      <main className="bg-white">
        <div className="bg-white sticky w-full z-50 top-0 shadow-sm">
          <Header />
          <Categories />
        </div>
        <SearchBar />

        <Footer />
      </main>
    </>
  );
}