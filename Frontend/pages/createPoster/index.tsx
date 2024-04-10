import PosterForm from "../../components/CreatePoster/posterForm";
import Footer from "../../components/Footer";
import NavBar from "../../components/Header";

export default function CreatePoster() {
  return (
    <main className="overflow-auto">
      <NavBar />
      <PosterForm />
      <Footer />
    </main>
  );
}
