"use client";
import NavBar from "@/components/Header";
import Footer from "@/components/Footer";
import PosterDetails from "@/components/Poster-Details/poster-details";
import CartPosterDetails from "@/components/cartEditPoster/cartPosterDetails";

interface PosterSlugPageProps {
  params: { posterId: any };
}
const PosterSlugPage: React.FC<PosterSlugPageProps> = ({
  params,
}): JSX.Element => {
  const id = params.posterId[0];

  return (
    <main className="overflow-auto">
      <NavBar />
      <CartPosterDetails id={id} />
      <Footer />
    </main>
  );
};
export default PosterSlugPage;
