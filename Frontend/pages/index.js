import BgImage from "@/components/Bg-header-Image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PosterGrid from "@/components/Poster/poster-grid";
import SearchBar from "@/components/SearchBar";
import { dummyData } from "@/dummy-data";

export default function Home() {
  return (
    <>
      <Header />
      <BgImage />
      <SearchBar />
      <PosterGrid meals={dummyData} />
      <Footer />
    </>
  );
}
