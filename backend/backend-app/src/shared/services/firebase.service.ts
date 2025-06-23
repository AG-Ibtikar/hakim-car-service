import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: this.configService.get('FIREBASE_PROJECT_ID'),
      storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
    });
  }

  async sendNotification(token: string, title: string, body: string, data?: any) {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendMulticastNotification(tokens: string[], title: string, body: string, data?: any) {
    const messages = tokens.map(token => ({
      notification: {
        title,
        body,
      },
      data,
      token,
    }));

    try {
      const response = await Promise.all(messages.map(message => admin.messaging().send(message)));
      return response;
    } catch (error) {
      console.error('Error sending multicast notification:', error);
      throw error;
    }
  }
} 