import ImgAccueilBabyfoot from '../img/imgAccueilBabyfoot.jpg';
import "./accueil.css";
import "../index.css";

function Accueil(){
  return(
      <div>
        <div align="center">
          <h1 className="title-page">⚽🎮 Babyfoot Arena ⚽🎮</h1>

          <div className="div-accueil">
            <h2>RÉSERVEZ, JOUEZ ET GRIMPEZ DANS LE CLASSEMENT DU CAMPUS</h2>
            <img src={ImgAccueilBabyfoot} alt="babyfoot-accueil" className="image-accueil" />
          </div>
        </div>
        <div className="section-below">
          <h2>Pourquoi Babyfoot Arena ?</h2>
          <p>
            Une plateforme pensée pour les étudiants : réservez vos tables en ligne,
            suivez vos performances et participez à des tournois amicaux.
          </p>
        </div>
      </div>
  );
}

export default Accueil;