import "../index.css";
import { Button, DatePicker, Form, Input, Card } from 'antd';
import "./reserver.css";
import { useAuth } from "../auth/useAuth.js"; 

// Voir les réservations disponibles
const testReservationAvailable = []

const users = []

function Reserver(){

    const currentUser = useAuth();
    console.log(currentUser);

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <div>
            <h1 className="title-page">📅 Réserver une partie 📅</h1>
            <div className="reservation-container">
                <Card className="card-reservation">
                    <Form name="basic" labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} initialValues={{ remember: true, }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                        <Form.Item label="Date" name="date" rules={[ { required: true, message: '', }, ]}>
                            <DatePicker onChange={onChange} />
                        </Form.Item>

                        <Form.Item label="Heure" name="hour" rules={[ { required: true, message: '', }, ]}>
                            <Input.Hour />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                            <Button type="primary" htmlType="submit">Réserver</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
  );
}


export default Reserver;



