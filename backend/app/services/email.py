import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        # For development - just log emails instead of sending
        self.dev_mode = os.getenv("EMAIL_DEV_MODE", "true").lower() == "true"
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@via-forum.dk")
        self.frontend_url = os.getenv("FRONTEND_URL", "https://via-paedagoger.vercel.app")
    
    async def send_verification_email(self, to_email: str, username: str, token: str) -> bool:
        """Send verification email to user"""
        subject = "Bekræft din email - VIA Pædagoger Forum"
        
        verification_link = f"{self.frontend_url}/verify-email?token={token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #ffb69e;">Velkommen til VIA Pædagoger Forum! 🌸</h2>
                    
                    <p>Hej {username},</p>
                    
                    <p>Tak for din tilmelding! For at færdiggøre din registrering og få adgang til forummet, 
                    skal du bekræfte din email-adresse.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" 
                           style="background-color: #ffb69e; color: #1f2937; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;
                                  font-weight: bold;">
                            Bekræft min email
                        </a>
                    </div>
                    
                    <p>Eller kopier dette link ind i din browser:</p>
                    <p style="word-break: break-all; color: #666;">
                        {verification_link}
                    </p>
                    
                    <p>Linket udløber om 24 timer.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #666; font-size: 14px;">
                        Hvis du ikke har oprettet en konto på VIA Pædagoger Forum, 
                        kan du trygt ignorere denne email.
                    </p>
                    
                    <p style="color: #666; font-size: 14px;">
                        Venlig hilsen,<br>
                        VIA Pædagoger Forum teamet
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = f"""
        Velkommen til VIA Pædagoger Forum!
        
        Hej {username},
        
        Tak for din tilmelding! For at færdiggøre din registrering, skal du bekræfte din email-adresse.
        
        Klik på linket nedenfor eller kopier det ind i din browser:
        {verification_link}
        
        Linket udløber om 24 timer.
        
        Hvis du ikke har oprettet en konto på VIA Pædagoger Forum, kan du trygt ignorere denne email.
        
        Venlig hilsen,
        VIA Pædagoger Forum teamet
        """
        
        if self.dev_mode:
            # In development, just log the email
            logger.info(f"""
            === EMAIL VERIFICATION (DEV MODE) ===
            To: {to_email}
            Username: {username}
            Token: {token}
            Link: {verification_link}
            =====================================
            """)
            return True
        
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"VIA Forum <{self.from_email}>"
            msg['To'] = to_email
            
            # Add parts
            text_part = MIMEText(text_content, 'plain')
            html_part = MIMEText(html_content, 'html')
            msg.attach(text_part)
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Verification email sent to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

# Global instance
email_service = EmailService()