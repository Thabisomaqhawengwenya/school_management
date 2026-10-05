import { Resend } from "resend";

export interface RecipientInfo {
  email?: string;
  phone?: string;
  name: string;
}

export interface NotificationPayload {
  recipient: RecipientInfo;
  subject: string;
  message: string;
  htmlContent?: string;
  channels: ("EMAIL" | "SMS")[];
  metadata?: Record<string, any>;
}

export interface NotificationResult {
  emailSent: boolean;
  smsSent: boolean;
  errors?: string[];
}

export class NotificationService {
  private static resendClient = new Resend(process.env.RESEND_API_KEY || "mock-resend-key");

  /**
   * Dispatches notifications across configured channels (Email via Resend, SMS via abstract provider)
   */
  static async send(payload: NotificationPayload): Promise<NotificationResult> {
    const { recipient, subject, message, htmlContent, channels } = payload;
    const errors: string[] = [];
    let emailSent = false;
    let smsSent = false;

    // 1. Email via Resend
    if (channels.includes("EMAIL") && recipient.email) {
      try {
        if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("mock")) {
          await this.resendClient.emails.send({
            from: process.env.SYSTEM_EMAIL_SENDER || "School Portal <notifications@schoolportal.com>",
            to: recipient.email,
            subject,
            text: message,
            html: htmlContent || `<p>${message.replace(/\n/g, "<br/>")}</p>`,
          });
        } else {
          // Dev mock log
          console.log(`[Email Dispatched to ${recipient.email}]: Subject: "${subject}"`);
        }
        emailSent = true;
      } catch (err: any) {
        errors.push(`Email error: ${err.message}`);
      }
    }

    // 2. SMS via Abstract Adapter (Twilio / Africa's Talking)
    if (channels.includes("SMS") && recipient.phone) {
      try {
        await this.dispatchSms(recipient.phone, message);
        smsSent = true;
      } catch (err: any) {
        errors.push(`SMS error: ${err.message}`);
      }
    }

    return {
      emailSent,
      smsSent,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Modular SMS adapter: can switch between Twilio, Africa's Talking, or mock
   */
  private static async dispatchSms(phone: string, text: string): Promise<void> {
    const provider = process.env.SMS_PROVIDER || "twilio";

    if (process.env.NODE_ENV === "development" || process.env.SMS_API_KEY?.includes("mock")) {
      console.log(`[SMS via ${provider} to ${phone}]: ${text}`);
      return;
    }

    // Production provider integration:
    if (provider === "twilio") {
      const accountSid = process.env.SMS_ACCOUNT_SID;
      const authToken = process.env.SMS_API_KEY;
      const fromNumber = process.env.SMS_SENDER_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        throw new Error("Twilio credentials missing in environment.");
      }

      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const body = new URLSearchParams({
        To: phone,
        From: fromNumber,
        Body: text,
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Twilio dispatch failed: ${errorText}`);
      }
    } else if (provider === "africastalking") {
      // Africa's Talking API integration
      const apiKey = process.env.SMS_API_KEY;
      const username = process.env.SMS_ACCOUNT_SID || "sandbox";

      const response = await fetch("https://api.africastalking.com/version1/messaging", {
        method: "POST",
        headers: {
          apiKey: apiKey || "",
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          username,
          to: phone,
          message: text,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error("Africa's Talking dispatch failed.");
      }
    }
  }
}
