import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/payment';


function App() {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');

  const handleReceive = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE_URL}/generate-receive-qr`
      console.log(`Sending request to: ${url}`);
      console.log(`Receiving from upi: ${upiId} amount: ${amount}`)
      
      const res = await axios.post(url, { upiId, amount });
      if(res?.error) throw new Error(res?.error)
      let data = res?.data
      console.log('Received data:', data);
      setQrCode(data.qrCode);
      setError('');
    } catch (err) {
      console.error('Error details:', err);
      setError(`Failed: ${err.message}`);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE_URL}/generate-send-qr`
      console.log(`Sending request to: ${url}`);
      console.log(`Receiving form upi: ${upiId} amount: ${amount}`)

      const { data } = await axios.post(url, { amount });
      console.log('Received data:', data);
      setQrCode(data.qrCode);
      setError('');
    } catch (err) {
      console.error('Error details:', err);
      setError(`Failed: ${err.message}`);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>UPI Payment Gateway</Card.Title>
          <Form onSubmit={handleReceive}>
            <Form.Group>
              <Form.Label>UPI ID (for receiving)</Form.Label>
              <Form.Control
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter UPI ID"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 me-2">
              Receive Payment
            </Button>
            <Button variant="secondary" onClick={handleSend} className="mt-3">
              Send Payment
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {qrCode && (
            <div className="mt-3">
              <h5>Scan this QR code:</h5>
              <img src={qrCode} alt="Payment QR Code" />
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;