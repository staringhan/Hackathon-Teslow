import "../index.css";
import { Button, DatePicker, Row, Col, TimePicker, Select,  Form, Card } from "antd";
import "./reserver.css";
import { useState } from "react";

// Voir les réservations disponibles
const testReservationAvailable = [
  { date: "2025-10-17", time: "09:00" },
  { date: "2025-10-17", time: "10:30" },
  { date: "2025-10-17", time: "12:00" },
  { date: "2025-10-18", time: "14:30" },
  { date: "2025-10-18", time: "16:00" },
];

const users = [
    { id: 2, pseudo: "Alice" },
    { id: 3, pseudo: "Bob" },
    { id: 4, pseudo: "Charlie" },
    { id: 5, pseudo: "David" },
    { id: 6, pseudo: "Emma" },
];

const currentUser = [{pseudo:'John', id:1}]
const { Option } = Select;

// Désactiver les heures et minutes non disponibles avant 8h30 et après 16h
function disabledTime(){
    return {
        disabledHours: () => {
            const hours = [];
            for (let i = 0; i < 24; i++) {
                if (i < 8 || i > 16) hours.push(i);
            }
            return hours;
        },
        disabledMinutes: (selectedHour) => {
            if (selectedHour === 8) return [0];
            if (selectedHour === 16) return [30];
            return [];
        },
    };
};

// Désactive la sélection de dates passées et les week-ends
function disabledDate(current){
    if (!current) return false;
    
    const today = new Date();
    if (current.toDate().setHours(0,0,0,0) < today.setHours(0,0,0,0)) {
        return true;
    }
    
    const day = current.day();
    return day === 0 || day === 6;
};



function Reserver() {
    const [mode, setMode] = useState(null);

    const onFinish = (values) => {
        console.log("Réservation soumise :", values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Erreur :", errorInfo);
    };

    const [selected, setSelected] = useState({ally: null, enemy1: null, enemy2: null});

    const handleChange = (field, value) => {
        setSelected(prev => ({ ...prev, [field]: value }));
    };

    // Update les select si un joueur est déjà sélectionné dans un autre select
    const getNewOptions = (currentField) => {
        return users.filter(u => !Object.keys(selected)
            .some(j => j !== currentField && selected[j] === u.id));
    };

    return (
        <div>
            <h1 className="title-page">📅 Réserver une partie 📅</h1>
            <div className="reservation-container">
                <Card className="card-reservation">
                    <div style={{ marginBottom: 20, textAlign: "center" }}>
                        
                        <Button type={mode === "solo" ? "primary" : "default"} onClick={() => setMode("solo")} style={{ marginRight: 10 }}>
                            Solo
                        </Button>
                        <Button type={mode === "duo" ? "primary" : "default"} onClick={() => setMode("duo")}>
                            Duo
                        </Button>
                    </div>
                    <Form
                        name="reservationForm"
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
              
                        {mode === "solo" && (
                            <Form.Item
                                label="Sélectionnez votre adversaire"
                                name="enemy"
                                rules={[{ required: true, message: "Veuillez sélectionner un adversaire !" }]}
                            >
                            
                            <Select placeholder="Choisir un adversaire">
                                {users.map((u) => (
                                <Option key={u.id} value={u.id}>{u.pseudo}</Option>
                                ))}
                            </Select>

                            </Form.Item>
                        )}

                        {mode === "duo" && (
                            <>
                                <Form.Item
                                    label="Votre allié"
                                    name="ally"
                                    rules={[{ required: true, message: "Veuillez sélectionner un allié !"}]
                                }
                                >
                                    {/* Update les select si un user est déjà pris */}
                                    <Select placeholder="Allié" value={selected.ally} onChange={(v) => handleChange("ally", v)}>
                                        {getNewOptions("ally").map(u => (
                                            <Option key={u.id} value={u.id}>{u.pseudo}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Row gutter={10}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Adversaire 1"
                                            name="enemy1"
                                            rules={[{ required: true, message: "Veuillez sélectionner l’adversaire 1 !" }]}>
                                        <Select placeholder="Adversaire 1" value={selected.enemy1} onChange={(v) => handleChange("enemy1", v)}>
                                            {getNewOptions("enemy1").map(u => (
                                                <Option key={u.id} value={u.id}>{u.pseudo}</Option>
                                            ))}
                                        </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            label="Adversaire 2"
                                            name="enemy2"
                                            rules={[{ required: true, message: "Veuillez sélectionner l’adversaire 2 !" }]}
                                        >
                                            <Select placeholder="Adversaire 2" value={selected.enemy2} onChange={(v) => handleChange("enemy2", v)}>
                                                {getNewOptions("enemy2").map(u => (
                                                    <Option key={u.id} value={u.id}>{u.pseudo}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        )}

                        <Form.Item
                            label="Date de réservation"
                            name="date"
                            rules={[{ required: true, message: "Veuillez choisir une date !" }]}
                        >
                            <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
                        </Form.Item>

                        <Form.Item
                            label="Heure de réservation"
                            name="time"
                            rules={[{ required: true, message: "Veuillez choisir une heure !" }]}
                        >
                            {/* Saut de minutes par 30 */}
                            <TimePicker
                                style={{ width: "100%" }}
                                format="HH:mm"
                                disabledTime={disabledTime}
                                inputReadOnly={true}
                                minuteStep={30}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                Réserver
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
}

export default Reserver;



