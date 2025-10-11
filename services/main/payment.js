// Demo Payment Service - Simulates payment processing without real payment gateway

// Demo card numbers for testing
const DEMO_CARDS = {
  SUCCESS: ['4242424242424242', '4000056655665556', '5555555555554444'],
  DECLINE: ['4000000000000002', '4000000000009995'],
  INSUFFICIENT_FUNDS: ['4000000000009995'],
  EXPIRED: ['4000000000000069']
};

// Simulate payment processing delay
const simulateDelay = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

export const processDemoPayment = async (paymentData) => {
  try {
    const { cardDetails, amount, currency = 'usd', orderId } = paymentData;
    
    // Simulate processing delay
    await simulateDelay(1500);
    
    // Clean card number (remove spaces and dashes)
    const cleanCardNumber = cardDetails.cardNumber.replace(/\s+/g, '').replace(/-/g, '');
    
    // Validate card number format (basic Luhn algorithm check)
    if (!isValidCardNumber(cleanCardNumber)) {
      return {
        success: false,
        error: 'Invalid card number format',
        errorCode: 'INVALID_CARD_NUMBER'
      };
    }
    
    // Check expiry date
    if (!isValidExpiryDate(cardDetails.expiryDate)) {
      return {
        success: false,
        error: 'Card has expired',
        errorCode: 'EXPIRED_CARD'
      };
    }
    
    // Check CVV
    if (!isValidCVV(cardDetails.cvv)) {
      return {
        success: false,
        error: 'Invalid CVV',
        errorCode: 'INVALID_CVV'
      };
    }
    
    // Simulate different payment outcomes based on card number
    let paymentResult;
    
    if (DEMO_CARDS.SUCCESS.includes(cleanCardNumber)) {
      paymentResult = {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'succeeded',
        message: 'Payment processed successfully'
      };
    } else if (DEMO_CARDS.DECLINE.includes(cleanCardNumber)) {
      paymentResult = {
        success: false,
        error: 'Your card was declined',
        errorCode: 'CARD_DECLINED'
      };
    } else if (DEMO_CARDS.INSUFFICIENT_FUNDS.includes(cleanCardNumber)) {
      paymentResult = {
        success: false,
        error: 'Insufficient funds',
        errorCode: 'INSUFFICIENT_FUNDS'
      };
    } else if (DEMO_CARDS.EXPIRED.includes(cleanCardNumber)) {
      paymentResult = {
        success: false,
        error: 'Your card has expired',
        errorCode: 'EXPIRED_CARD'
      };
    } else {
      // Default to success for any other card number
      paymentResult = {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'succeeded',
        message: 'Payment processed successfully'
      };
    }
    
    console.log(`Demo Payment Result for Order ${orderId}:`, paymentResult);
    
    return paymentResult;
    
  } catch (error) {
    console.error('Demo payment error:', error);
    return {
      success: false,
      error: 'Payment processing failed. Please try again.',
      errorCode: 'PROCESSING_ERROR'
    };
  }
};

// Helper function to validate card number using Luhn algorithm
function isValidCardNumber(cardNumber) {
  if (!/^\d{13,19}$/.test(cardNumber)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Helper function to validate expiry date
function isValidExpiryDate(expiryDate) {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
  
  const [month, year] = expiryDate.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  
  return expiry > now;
}

// Helper function to validate CVV
function isValidCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Demo payment intent creation (for consistency with Stripe API)
export const createDemoPaymentIntent = async (amount, currency = 'usd', orderId) => {
  try {
    await simulateDelay(500);
    
    return {
      success: true,
      clientSecret: `pi_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentIntentId: `pi_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      currency: currency
    };
  } catch (error) {
    console.error('Demo payment intent error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Demo payment confirmation
export const confirmDemoPayment = async (paymentIntentId) => {
  try {
    await simulateDelay(1000);
    
    return {
      success: true,
      status: 'succeeded',
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
  } catch (error) {
    console.error('Demo payment confirmation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
