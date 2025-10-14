'use client';

import { useState } from 'react';
import { EmailService, emailTemplates, EmailRecipient } from '@/lib/email-service';
import { AuthService } from '@/lib/auth';
import { X, Mail, Plus, Trash2, Send, FileText } from 'lucide-react';

interface SendEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentContent: string;
}

export default function SendEmailDialog({
  isOpen,
  onClose,
  documentTitle,
  documentContent,
}: SendEmailDialogProps) {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([{ email: '', name: '' }]);
  const [cc, setCc] = useState<EmailRecipient[]>([]);
  const [subject, setSubject] = useState(`מסמך משפטי - ${documentTitle}`);
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleAddRecipient = () => {
    setRecipients([...recipients, { email: '', name: '' }]);
  };

  const handleRemoveRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const handleRecipientChange = (index: number, field: 'email' | 'name', value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const handleAddCc = () => {
    setCc([...cc, { email: '', name: '' }]);
    setShowCc(true);
  };

  const handleRemoveCc = (index: number) => {
    const updated = cc.filter((_, i) => i !== index);
    setCc(updated);
    if (updated.length === 0) {
      setShowCc(false);
    }
  };

  const handleCcChange = (index: number, field: 'email' | 'name', value: string) => {
    const updated = [...cc];
    updated[index][field] = value;
    setCc(updated);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = EmailService.createFromTemplate(templateId, {
        documentTitle,
        recipientName: recipients[0]?.name || 'הנמען',
        senderName: currentUser?.name || 'השולח',
        signatureDate: new Date().toLocaleDateString('he-IL'),
        additionalMessage: additionalMessage,
      });
      
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleSend = async () => {
    // וולידציה
    const validRecipients = recipients.filter(r => r.email && EmailService.validateEmail(r.email));
    
    if (validRecipients.length === 0) {
      alert('נא להזין לפחות כתובת מייל אחת תקינה');
      return;
    }

    if (!subject.trim()) {
      alert('נא להזין נושא למייל');
      return;
    }

    setIsLoading(true);

    try {
      // המרת המסמך ל-PDF (או HTML)
      const attachment = await EmailService.convertToPDF(
        documentContent,
        `${documentTitle}.pdf`
      );

      // שליחת המייל
      const result = await EmailService.sendEmail({
        to: validRecipients,
        cc: cc.filter(c => c.email && EmailService.validateEmail(c.email)),
        subject,
        body,
        attachments: [attachment],
        isHtml: false,
      });

      if (result.success) {
        alert('המייל נשלח בהצלחה!');
        onClose();
      } else {
        alert(result.error || 'שגיאה בשליחת המייל');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('שגיאה בשליחת המייל');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">שליחת מסמך במייל</h2>
              <p className="text-sm text-blue-100">{documentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* תבנית מייל */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תבנית מייל (אופציונלי)
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">בחר תבנית...</option>
              {emailTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* נמענים */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                נמענים <span className="text-red-500">*</span>
              </label>
              <button
                onClick={handleAddRecipient}
                className="text-sm text-primary hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                הוסף נמען
              </button>
            </div>
            <div className="space-y-2">
              {recipients.map((recipient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="כתובת מייל"
                    value={recipient.email}
                    onChange={(e) => handleRecipientChange(index, 'email', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="ltr"
                  />
                  <input
                    type="text"
                    placeholder="שם (אופציונלי)"
                    value={recipient.name}
                    onChange={(e) => handleRecipientChange(index, 'name', e.target.value)}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="rtl"
                  />
                  {recipients.length > 1 && (
                    <button
                      onClick={() => handleRemoveRecipient(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CC */}
          {!showCc ? (
            <button
              onClick={handleAddCc}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              + הוסף עותק (CC)
            </button>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                עותק (CC)
              </label>
              <div className="space-y-2">
                {cc.map((recipient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="כתובת מייל"
                      value={recipient.email}
                      onChange={(e) => handleCcChange(index, 'email', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      dir="ltr"
                    />
                    <input
                      type="text"
                      placeholder="שם (אופציונלי)"
                      value={recipient.name}
                      onChange={(e) => handleCcChange(index, 'name', e.target.value)}
                      className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      dir="rtl"
                    />
                    <button
                      onClick={() => handleRemoveCc(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddCc}
                  className="text-sm text-primary hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  הוסף עותק נוסף
                </button>
              </div>
            </div>
          )}

          {/* נושא */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נושא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              dir="rtl"
            />
          </div>

          {/* הודעה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תוכן המייל
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              dir="rtl"
              placeholder="כתוב את תוכן המייל כאן..."
            />
          </div>

          {/* קובץ מצורף */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <FileText className="w-5 h-5" />
              <span className="font-medium">קובץ מצורף:</span>
              <span>{documentTitle}.pdf</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex gap-3">
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>שולח...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>שלח מייל</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

