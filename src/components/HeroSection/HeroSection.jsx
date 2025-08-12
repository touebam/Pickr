import HeroCarousel from "../HeroCarousel/HeroCarousel";
import "./HeroSection.css";

export default function HeroSection({ trends }) {
  return (
    <section className="hero-section">
        <h1 className="hero-title"><b>Pickr</b>, plus la peine de chercher.</h1>
        <HeroCarousel trends={trends} />
        <footer>
            <p>© {new Date().getFullYear()} Morgan Toueba. Tous droits réservés.</p>
            <p>Les affiches et données proviennent de l'API TMDb.</p>
        </footer>
    </section>
  );
}
