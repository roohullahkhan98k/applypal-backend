"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendAmbassadorInvitation(invitationData, universityEmail, universityName) {
        try {
            const signupUrl = `${process.env.FRONTEND_URL}/auth/signup?invitedBy=${universityName}&email=${encodeURIComponent(invitationData.ambassadorEmail)}`;
            const mailOptions = {
                from: `"${universityName}" <${process.env.SMTP_USER}>`,
                replyTo: universityEmail,
                to: invitationData.ambassadorEmail,
                subject: `🎓 Ambassador Invitation from ${universityName}`,
                html: this.getInvitationEmailTemplate(invitationData.ambassadorName, invitationData.ambassadorEmail, universityName, universityEmail, signupUrl)
            };
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`📧 Invitation sent from ${universityName} to ${invitationData.ambassadorEmail}`);
            this.logger.log(`🔗 Signup link: ${signupUrl}`);
            return {
                success: true,
                message: `Invitation sent successfully to ${invitationData.ambassadorEmail}`
            };
        }
        catch (error) {
            this.logger.error(`❌ Failed to send invitation: ${error.message}`);
            return {
                success: false,
                message: `Failed to send invitation: ${error.message}`
            };
        }
    }
    getInvitationEmailTemplate(ambassadorName, ambassadorEmail, universityName, universityEmail, signupUrl) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ambassador Invitation</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold;
        }
        .header p { 
            margin: 10px 0 0 0; 
            font-size: 16px; 
            opacity: 0.9;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting {
            font-size: 24px;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            line-height: 1.8;
            color: #4B5563;
            margin-bottom: 25px;
        }
        .benefits {
            background: #F8FAFC;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .benefits h3 {
            color: #1F2937;
            margin-top: 0;
            font-size: 18px;
        }
        .benefits ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        .benefits li {
            margin: 8px 0;
            color: #4B5563;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(79, 70, 229, 0.4);
        }
        .cta-container {
            text-align: center;
            margin: 30px 0;
        }
        .footer { 
            background: #F8FAFC;
            padding: 25px 30px; 
            text-align: center; 
            color: #6B7280; 
            font-size: 14px;
            border-top: 1px solid #E5E7EB;
        }
        .footer p {
            margin: 5px 0;
        }
        .university-info {
            background: #EFF6FF;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4F46E5;
        }
        .university-info h4 {
            margin: 0 0 10px 0;
            color: #1E40AF;
            font-size: 16px;
        }
        .university-info p {
            margin: 5px 0;
            color: #4B5563;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Ambassador Invitation</h1>
            <p>You're invited to join ${universityName}</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${ambassadorName}!</div>
            
            <div class="message">
                We're excited to invite you to become an official ambassador for <strong>${universityName}</strong>! 
                This is a unique opportunity to represent our institution and make a meaningful impact in your community.
            </div>
            
            <div class="benefits">
                <h3>🌟 What You'll Get as an Ambassador:</h3>
                <ul>
                    <li><strong>Represent our university</strong> in your community and network</li>
                    <li><strong>Connect with prospective students</strong> and share your experiences</li>
                    <li><strong>Build valuable relationships</strong> with university staff and other ambassadors</li>
                    <li><strong>Develop leadership skills</strong> and enhance your resume</li>
                    <li><strong>Access exclusive events</strong> and networking opportunities</li>
                    <li><strong>Make a positive impact</strong> on students' educational journeys</li>
                </ul>
            </div>
            
            <div class="cta-container">
                <a href="${process.env.FRONTEND_URL}/invitation/accept?token=${ambassadorEmail}" class="cta-button" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); margin-right: 10px;">
                    ✅ Accept Invitation & Sign Up
                </a>
                <a href="${process.env.FRONTEND_URL}/invitation/decline?token=${ambassadorEmail}" class="cta-button" style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);">
                    ❌ Decline Invitation
                </a>
            </div>
            
            <div class="university-info">
                <h4>📧 Questions or Need Help?</h4>
                <p>If you have any questions about this opportunity, feel free to reach out to us:</p>
                <p><strong>Email:</strong> <a href="mailto:${universityEmail}" style="color: #4F46E5;">${universityEmail}</a></p>
                <p><strong>University:</strong> ${universityName}</p>
            </div>
            
            <div class="message">
                <strong>Ready to get started?</strong> Click the button above to create your ambassador account and begin your journey with us!
            </div>
        </div>
        
        <div class="footer">
            <p><strong>This invitation was sent by ${universityName}</strong></p>
            <p>If you didn't expect this email, please ignore it or contact us at ${universityEmail}</p>
            <p style="margin-top: 15px; font-size: 12px; color: #9CA3AF;">
                This email was sent through ApplyPal Ambassador System
            </p>
        </div>
    </div>
</body>
</html>`;
    }
    async testEmailConfiguration() {
        try {
            await this.transporter.verify();
            this.logger.log('✅ Email configuration is valid');
            return { success: true, message: 'Email configuration is valid' };
        }
        catch (error) {
            this.logger.error(`❌ Email configuration error: ${error.message}`);
            return { success: false, message: `Email configuration error: ${error.message}` };
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map