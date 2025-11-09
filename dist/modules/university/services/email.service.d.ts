import { SendInvitationDto } from '../dto/email.dto';
export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendAmbassadorInvitation(invitationData: SendInvitationDto, universityEmail: string, universityName: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private getInvitationEmailTemplate;
    testEmailConfiguration(): Promise<{
        success: boolean;
        message: string;
    }>;
}
