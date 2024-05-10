"use client";
import NavBar from "@/components/Header";
import Footer from "@/components/Footer";
import PosterDetails from "@/components/Poster-Details/poster-details";

interface PosterSlugPageProps {
  params: { posterSlug: any };
}
const PosterSlugPage: React.FC<PosterSlugPageProps> = ({
  params,
}): JSX.Element => {
  const id = params.posterSlug[0];

  return (
    <main className="overflow-auto">
      <NavBar />
      <PosterDetails id={id} />

      <Footer />
    </main>
  );
};
export default PosterSlugPage;
