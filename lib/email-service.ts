export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // Base64
  contentType: string;
}

export interface SendEmailParams {
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
  isHtml?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

// תבניות מייל מוכנות
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'send-document',
    name: 'שליחת מסמך',
    subject: 'מסמך משפטי - {{documentTitle}}',
    body: `שלום {{recipientName}},

מצורף מסמך משפטי: {{documentTitle}}

{{additionalMessage}}

בברכה,
{{senderName}}`,
  },
  {
    id: 'send-draft',
    name: 'שליחת טיוטה לאישור',
    subject: 'טיוטה לאישור - {{documentTitle}}',
    body: `שלום {{recipientName}},

מצורפת טיוטה של המסמך "{{documentTitle}}" לעיון ואישור.

אנא עיין/עייני במסמך ושלח/שלחי הערות או אישור.

{{additionalMessage}}

בברכה,
{{senderName}}`,
  },
  {
    id: 'send-final',
    name: 'שליחת מסמך חתום',
    subject: 'מסמך סופי חתום - {{documentTitle}}',
    body: `שלום {{recipientName}},

מצורף המסמך הסופי החתום: {{documentTitle}}

המסמך נחתם ביום {{signatureDate}} ונשלח אליך לשמירה.

{{additionalMessage}}

בברכה,
{{senderName}}`,
  },
];

/**
 * שירות לשליחת מיילים
 */
export class EmailService {
  /**
   * שליחת מייל
   */
  static async sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
    try {
      // בפרודקשן, כאן נשלח בקשה לשרת שישלח את המייל
      // לדוגמה, דרך API של SendGrid, AWS SES, או שירות אחר
      
      console.log('Sending email:', params);

      // סימולציה של שליחה
      await new Promise(resolve => setTimeout(resolve, 1000));

      // שמירת היסטוריית מיילים
      this.saveToHistory(params);

      return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      return { 
        success: false, 
        error: 'שגיאה בשליחת המייל. אנא נסה שוב מאוחר יותר.' 
      };
    }
  }

  /**
   * יצירת מייל מתבנית
   */
  static createFromTemplate(
    templateId: string,
    variables: Record<string, string>
  ): { subject: string; body: string } {
    const template = emailTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return { subject: '', body: '' };
    }

    let subject = template.subject;
    let body = template.body;

    // החלפת משתנים
    Object.keys(variables).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(placeholder, variables[key] || '');
      body = body.replace(placeholder, variables[key] || '');
    });

    return { subject, body };
  }

  /**
   * המרת מסמך ל-PDF לצורך שליחה
   */
  static async convertToPDF(htmlContent: string, filename: string): Promise<EmailAttachment> {
    // בפרודקשן, כאן נשתמש בספרייה להמרה ל-PDF
    // לדוגמה: puppeteer, html-pdf, jsPDF
    
    // כרגע מחזיר את ה-HTML כמצורף
    const base64Content = btoa(unescape(encodeURIComponent(htmlContent)));
    
    return {
      filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
      content: base64Content,
      contentType: 'application/pdf',
    };
  }

  /**
   * שמירת היסטוריית מיילים
   */
  private static saveToHistory(params: SendEmailParams): void {
    try {
      const history = this.getHistory();
      
      history.unshift({
        id: `email-${Date.now()}`,
        ...params,
        sentAt: new Date().toISOString(),
      });

      // שמור רק 50 מיילים אחרונים
      const trimmedHistory = history.slice(0, 50);
      
      localStorage.setItem('emailHistory', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error saving email history:', error);
    }
  }

  /**
   * קבלת היסטוריית מיילים
   */
  static getHistory(): any[] {
    try {
      const historyStr = localStorage.getItem('emailHistory');
      return historyStr ? JSON.parse(historyStr) : [];
    } catch {
      return [];
    }
  }

  /**
   * וולידציה של כתובת מייל
   */
  static validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

