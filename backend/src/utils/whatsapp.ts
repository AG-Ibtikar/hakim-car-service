import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.error('WhatsApp configuration missing');
      return;
    }

    // Format phone number (remove any non-digit characters)
    const formattedPhone = to.replace(/\D/g, '');

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}; 