import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailNotificationService:
    """
    Transactional email service for KamStore SaaS.
    Dispatches booking confirmations, payment receipts, and lead reports.
    """

    def __init__(self):
        self.smtp_host = settings.smtp_host
        self.smtp_port = settings.smtp_port
        self.smtp_user = settings.smtp_user
        self.smtp_pass = settings.smtp_password
        self.from_email = settings.email_from

    def send_payment_receipt(self, recipient_email: str, payment_data: Dict[str, Any]) -> bool:
        subject = f"Reçu de Paiement KamStore - {payment_data.get('transaction_ref')}"
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #059669;">Confirmation de Paiement 🇨🇲</h2>
            <p>Bonjour,</p>
            <p>Votre paiement a été traité avec succès via <strong>{payment_data.get('provider', '').upper()}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Référence :</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{payment_data.get('transaction_ref')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Montant :</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{payment_data.get('amount')} {payment_data.get('currency', 'XAF')}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Statut :</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; color: green;">COMPLÉTÉ</td></tr>
            </table>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">Merci de votre confiance sur KamStore SaaS.</p>
        </div>
        """
        return self._send_email(recipient_email, subject, html)

    def send_booking_confirmation(self, recipient_email: str, booking_data: Dict[str, Any]) -> bool:
        subject = "Confirmation de votre réservation KamStore"
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2563eb;">Réservation Confirmée 🌴</h2>
            <p>Votre réservation pour <strong>{booking_data.get('listing_title', 'Activité / Logement')}</strong> est confirmée.</p>
            <p>Montant total : <strong>{booking_data.get('total_price')} XAF</strong></p>
            <p style="color: #666;">Dates : {booking_data.get('start_date')} au {booking_data.get('end_date')}</p>
        </div>
        """
        return self._send_email(recipient_email, subject, html)

    def _send_email(self, to_email: str, subject: str, html_body: str) -> bool:
        if not self.smtp_user or not self.smtp_pass:
            logger.info(f"SMTP credentials not set. Simulated sending email to {to_email} with subject: {subject}")
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to_email
            msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.sendmail(self.from_email, to_email, msg.as_string())
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False

email_service = EmailNotificationService()
