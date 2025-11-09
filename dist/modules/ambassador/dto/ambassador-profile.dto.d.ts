export declare class SocialLinksDto {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    linkedin?: string;
    youtube?: string;
    following?: string[];
}
export declare class CreateAmbassadorProfileDto {
    fullName?: string;
    email?: string;
    subject?: string;
    university?: string;
    countryOriginal?: string;
    countryCurrent?: string;
    social?: SocialLinksDto;
    calendlyLink?: string;
    writtenContent?: string;
    writtenDetails?: string;
    dob?: string;
    gender?: string;
    languages?: string[];
    currentlyLivingCountry?: string;
    phoneNumber?: string;
    leaveAPYear?: number;
    previousSchoolName?: string;
    currentlyUniversityStudent?: string;
    currentUniversityName?: string;
    services?: string[];
    whyStudyingCourse?: string;
    skilsExperience?: string;
    hobbiesInterests?: string;
    caringCauses?: string;
    accomplishmentsProudOf?: string;
    answerQ1?: string;
    answerQ2?: string;
    answerQ3?: string;
    answerQ4?: string;
    question1?: string;
    question2?: string;
    question3?: string;
    isRegisteredAmbassador?: string;
    profileImage?: string;
}
export declare class UpdateAmbassadorProfileDto extends CreateAmbassadorProfileDto {
}
