import BgImage from "../components/Bg-header-Image";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PosterGrid from "../components/Poster/poster-grid";
import SearchBar from "../components/SearchBar";
import { fetchAllPosters } from "../utils/http";
import { useEffect, useState } from "react";

export default function Home() {
  const [totalPosters, setTotalPosters] = useState(0);
  useEffect(() => {
    const totaldata = async () => {
      const response = await fetchAllPosters();
      setTotalPosters(response.length);
    };
    totaldata();
  }, []);
  return (
    <main className="overflow-auto">
      <Header />
      <BgImage />
      <SearchBar />
      <PosterGrid totalLength={totalPosters} />
      <Footer />
    </main>
  );
}
