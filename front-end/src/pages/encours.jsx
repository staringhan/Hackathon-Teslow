
import { Card } from 'antd';
import "./encours.css";
import "../index.css";
import imgPartieEnCours from "../img/partieEnCours.jpg";
const { Meta } = Card;

const testData = [
    { reservationId:1, heureFin:"14:00", tableId:1},
    { reservationId:2, heureFin:"8:00", tableId:2},
    { reservationId:3, heureFin:"4:00", tableId:3},
    { reservationId:4, heureFin:"16:00", tableId:4}
];

function EnCours(){
    return(
        <div>
            <h1 className="title-page">⏳ Parties en cours⏳</h1>
            <div className="cards-container">
                {testData.map((item) => (
                    <Card className="card-en-cours"
                        key={item.reservationId}
                        cover={
                            <img
                                draggable={false}
                                alt={`Table ${item.tableId}`}
                                src={imgPartieEnCours}
                            />
                        }
                    >
                        <Meta
                            title={`Table ${item.tableId} - Fin à ${item.heureFin}`}
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default EnCours;