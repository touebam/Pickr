import HeroCarousel from "../HeroCarousel/HeroCarousel";
import { useTranslation, Trans } from "react-i18next";
import "./HeroSection.css";

export default function HeroSection({ trends }) {
  const { t } = useTranslation("common");
  const year = new Date().getFullYear();
  return (
    <section className="hero-section">
        <h1>
          <Trans i18nKey="hero.slogan">
            <b>{t("hero.title")}</b>
          </Trans>
        </h1>
        <HeroCarousel trends={trends} />
        <footer>
            <p>{t("hero.copyright", { year })}</p>
            <p>{t("hero.disclaimer")}</p>
        </footer>
    </section>
  );
}
