// src/components/PaymentForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config'; // Add this import

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    amount: '',
    merchantId: '' // Add merchantId to formData
  });

  const [merchants, setMerchants] = useState([]); // To store list of merchants
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const { cardNumber, cardExpiry, cardCvv, amount, merchantId } = formData;

  // Fetch merchants on component mount
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/merchants`);
        setMerchants(res.data);
      } catch (err) {
        console.error('Error fetching merchants:', err);
        setErrors(prev => ({ ...prev, merchantId: 'Failed to load merchants' }));
      }
    };
    fetchMerchants();
  }, []);

  const onChange = e => {
    const { name, value } = e.target;
    
    // Simple validation during input
    let newErrors = { ...errors };
    delete newErrors[name];
    
    if (name === 'cardNumber') {
      // Remove spaces for validation but keep them in display
      const cleaned = value.replace(/\s/g, '');
      if (cleaned && !/^\d+$/.test(cleaned)) {
        newErrors.cardNumber = 'Card number must contain only digits';
      } else if (cleaned && cleaned.length > 16) {
        newErrors.cardNumber = 'Card number cannot exceed 16 digits';
      }
      
      // Format with spaces for readability
      setFormData({
        ...formData,
        [name]: cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
      });
    } else if (name === 'cardExpiry') {
      // Format as MM/YY
      const cleaned = value.replace(/[^\d]/g, '');
      if (cleaned.length <= 2) {
        setFormData({ ...formData, [name]: cleaned });
      } else {
        setFormData({
          ...formData,
          [name]: `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
        });
      }
    } else if (name === 'cardCvv') {
      if (value && !/^\d+$/.test(value)) {
        newErrors.cardCvv = 'CVV must contain only digits';
      } else if (value && value.length > 4) {
        newErrors.cardCvv = 'CVV cannot exceed 4 digits';
      }
      setFormData({ ...formData, [name]: value });
    } else if (name === 'amount') {
      if (value && !/^\d*\.?\d*$/.test(value)) {
        newErrors.amount = 'Amount must be a valid number';
      }
      setFormData({ ...formData, [name]: value });
    } else if (name === 'merchantId') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Card number must be at least 13 digits';
    }
    
    if (!cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiration date is required';
    } else {
      const [month, year] = cardExpiry.split('/');
      if (!month || !year || month > 12 || month < 1) {
        newErrors.cardExpiry = 'Invalid expiration date';
      }
    }
    
    if (!cardCvv.trim()) {
      newErrors.cardCvv = 'CVV is required';
    } else if (cardCvv.length < 3) {
      newErrors.cardCvv = 'CVV must be at least 3 digits';
    }
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!merchantId) {
      newErrors.merchantId = 'Please select a merchant';
    }

    return newErrors;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setResponse(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const paymentData = {
        cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces
        expiry: cardExpiry, // Rename to match backend
        cvv: cardCvv, // Rename to match backend
        amount: parseFloat(amount),
        merchantId // Add merchantId
      };
      
      const res = await axios.post(
        `${API_BASE_URL}/api/payment/process`, // Use API_BASE_URL
        paymentData,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      
      setResponse(res.data);
      setLoading(false);
      
      // Clear form if success
      if (res.data.success) {
        setFormData({
          cardNumber: '',
          cardExpiry: '',
          cardCvv: '',
          amount: '',
          merchantId: ''
        });
      }
    } catch (err) {
      setResponse({
        success: false,
        message: err.response?.data?.msg || 'Payment processing failed'
      });
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Process Payment</h4>
          </div>
          <div className="card-body">
            {response && (
              <div className={`alert ${response.success ? 'alert-success' : 'alert-danger'}`}>
                <h5>
                  {response.success ? 'Payment Successful!' : 'Payment Failed'}
                  {response.fraudDetected && ' (Flagged for Review)'}
                </h5>
                <p>{response.message}</p>
                {response.fraudDetected && (
                  <p>
                    <strong>Reason:</strong> {response.fraudReason}
                  </p>
                )}
                {response.transactionId && (
                  <p>
                    <strong>Transaction ID:</strong> {response.transactionId}
                  </p>
                )}
                {response.success && (
                  <button 
                    className="btn btn-info mt-2"
                    onClick={() => navigate('/transactions')}
                  >
                    View Transaction History
                  </button>
                )}
              </div>
            )}
            
            <form onSubmit={onSubmit}>
              <div className="form-group mb-3">
                <label>Select Merchant</label>
                <select
                  className={`form-control ${errors.merchantId ? 'is-invalid' : ''}`}
                  name="merchantId"
                  value={merchantId}
                  onChange={onChange}
                >
                  <option value="">Select a merchant</option>
                  {merchants.map(merchant => (
                    <option key={merchant.id} value={merchant.id}>
                      {merchant.username}
                    </option>
                  ))}
                </select>
                {errors.merchantId && (
                  <div className="invalid-feedback">{errors.merchantId}</div>
                )}
              </div>

              <div className="form-group mb-3">
                <label>Card Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                  name="cardNumber"
                  value={cardNumber}
                  onChange={onChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19" // 16 digits + 3 spaces
                />
                {errors.cardNumber && (
                  <div className="invalid-feedback">{errors.cardNumber}</div>
                )}
                <small className="form-text text-muted">
                  For testing: Use any 16-digit number. Try 4111 1111 1111 1111
                </small>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Expiration Date (MM/YY)</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardExpiry ? 'is-invalid' : ''}`}
                      name="cardExpiry"
                      value={cardExpiry}
                      onChange={onChange}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.cardExpiry && (
                      <div className="invalid-feedback">{errors.cardExpiry}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardCvv ? 'is-invalid' : ''}`}
                      name="cardCvv"
                      value={cardCvv}
                      onChange={onChange}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cardCvv && (
                      <div className="invalid-feedback">{errors.cardCvv}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-group mb-3">
                <label>Amount ($)</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">$</span>
                  </div>
                  <input
                    type="text"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    name="amount"
                    value={amount}
                    onChange={onChange}
                    placeholder="100.00"
                  />
                </div>
                {errors.amount && (
                  <div className="invalid-feedback d-block">{errors.amount}</div>
                )}
                <small className="form-text text-muted">
                  Fraud detection will flag amounts over $1000
                </small>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Process Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;