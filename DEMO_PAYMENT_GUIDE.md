# Demo Payment System Guide

This guide explains how to use the demo payment system implemented in the Goomye e-commerce platform.

## 🎯 Overview

The demo payment system simulates real payment processing without requiring actual payment gateway integration. It's perfect for development, testing, and demonstrations.

## 💳 Test Card Numbers

### Success Cards
These cards will result in successful payments:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Visa - Success |
| `4000 0566 5566 5556` | Visa Debit - Success |
| `5555 5555 5555 4444` | Mastercard - Success |

### Failure Cards
These cards will result in payment failures:

| Card Number | Error Type | Description |
|-------------|------------|-------------|
| `4000 0000 0000 0002` | Card Declined | Generic decline |
| `4000 0000 0000 9995` | Insufficient Funds | Not enough money |
| `4000 0000 0000 0069` | Expired Card | Card has expired |

### Other Valid Cards
Any other valid card number (passing Luhn algorithm) will default to success.

## 🔧 How It Works

### 1. Card Validation
- **Luhn Algorithm**: Validates card number format
- **Expiry Date**: Checks if card is not expired
- **CVV**: Validates 3-4 digit CVV format

### 2. Payment Processing
- **Simulated Delay**: 1.5 second processing delay
- **Result Logic**: Returns success/failure based on card number
- **Transaction ID**: Generates unique transaction ID for successful payments

### 3. Error Handling
- **Specific Errors**: Returns detailed error messages
- **Error Codes**: Includes error codes for programmatic handling
- **Logging**: Logs all payment attempts for debugging

## 🚀 Usage Instructions

### For Testing
1. **Add items to cart**
2. **Proceed to checkout**
3. **Fill in shipping information**
4. **Go to payment page**
5. **Use test card numbers**:
   - Card Number: Use any of the test numbers above
   - Expiry Date: Any future date (e.g., `12/25`)
   - CVV: Any 3-digit number (e.g., `123`)
   - Name: Any name

### For Development
```javascript
// Example API call
const paymentData = {
  cardDetails: {
    cardNumber: '4242424242424242',
    expiryDate: '12/25',
    cvv: '123',
    cardName: 'John Doe'
  },
  amount: 100.00,
  currency: 'usd',
  orderId: 'ORD-123456'
};

const result = await processDemoPayment(paymentData);
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "transactionId": "TXN_1234567890_ABC123",
  "status": "succeeded",
  "message": "Payment processed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Your card was declined",
  "errorCode": "CARD_DECLINED"
}
```

## 🔍 Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_CARD_NUMBER` | Card number format is invalid |
| `EXPIRED_CARD` | Card has expired |
| `INVALID_CVV` | CVV format is invalid |
| `CARD_DECLINED` | Card was declined |
| `INSUFFICIENT_FUNDS` | Not enough funds |
| `PROCESSING_ERROR` | General processing error |

## 🛠️ Customization

### Adding New Test Cards
Edit the `DEMO_CARDS` object in `services/main/payment.js`:

```javascript
const DEMO_CARDS = {
  SUCCESS: ['4242424242424242', '4000056655665556', '5555555555554444'],
  DECLINE: ['4000000000000002', '4000000000009995'],
  INSUFFICIENT_FUNDS: ['4000000000009995'],
  EXPIRED: ['4000000000000069'],
  // Add your custom cards here
  CUSTOM_ERROR: ['4000000000001234']
};
```

### Modifying Processing Delay
Change the delay in the `simulateDelay` function:

```javascript
const simulateDelay = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
```

## 🔒 Security Notes

- **No Real Money**: This system never processes real payments
- **No Sensitive Data**: No real card data is stored or transmitted
- **Validation Only**: Only validates format, not actual card validity
- **Demo Purpose**: Intended for development and testing only

## 🚀 Production Migration

To migrate to a real payment system:

1. **Replace Payment Service**: Swap `processDemoPayment` with real payment gateway
2. **Update API Endpoints**: Modify payment processing endpoints
3. **Add Webhooks**: Implement payment confirmation webhooks
4. **Security Review**: Ensure PCI compliance and security measures
5. **Testing**: Thoroughly test with real payment scenarios

## 📞 Support

For questions about the demo payment system:
- Check the console logs for detailed payment processing information
- Review the error codes for specific failure reasons
- Ensure test card numbers are entered correctly
- Verify expiry dates are in the future

## 🎯 Best Practices

1. **Always use test cards** in development
2. **Test all error scenarios** before going live
3. **Log payment attempts** for debugging
4. **Validate inputs** on both client and server
5. **Handle errors gracefully** with user-friendly messages
