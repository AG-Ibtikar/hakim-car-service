import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendWhatsAppMessage } from '../utils/whatsapp';

const prisma = new PrismaClient();

export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    const { name, phone, location, carType, make, model, service, notes } = req.body;

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        name,
        phone,
        location,
        vehicleType: carType.toUpperCase(),
        make,
        model,
        service,
        notes,
      },
    });

    // Send WhatsApp notification
    const message = `New Service Request!\n\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\nVehicle: ${make} ${model}\nService: ${service}\nNotes: ${notes || 'None'}`;
    await sendWhatsAppMessage(phone, message);

    res.status(201).json({
      success: true,
      data: serviceRequest,
      message: 'Service request created successfully'
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service request'
    });
  }
}; 