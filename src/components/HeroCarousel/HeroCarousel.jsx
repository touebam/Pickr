import MovieCard from "../MovieCard/MovieCard";
import "./HeroCarousel.css";

export default function HeroCarousel({ trends }) {
    return (
        <div className="cards-carousel">
            <div className="cards-container">
                {trends.map((trend) => (
                    <MovieCard 
                        key={trend.id} 
                        movie={trend}
                    />
                ))}
                {trends.map((trend) => (
                    <MovieCard 
                        key={'clone-'+trend.id} 
                        movie={trend}
                    />
                ))}
            </div>
        </div>
    );
}
