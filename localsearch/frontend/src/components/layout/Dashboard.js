import React from "react";
import styles from "./Dashboard.css";
import Card from "../cards/Card.js";
import restaurantImage from "../../../photos/restaurant.jpg";
import restaurantImage2 from "../../../photos/restaurant2.jpg";

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <div className={styles.leftCard}><Card name="Casa Ferlin" address="Stampfenbachstrasse 38, 8006 Zürich" restaurantImage={restaurantImage} id="GXvPAor1ifNfpF0U5PTG0w" /></div>
            <div className={styles.rightCard}><Card name="Le Café du Marché" address="Rue de Conthey 17, 1950 Sion" restaurantImage={restaurantImage2} id="ohGSnJtMIC5nPfYRi_HTAg" /></div>
        </div>
    )
}