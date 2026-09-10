export interface ProfileName {
  ja: { first: string; last: string };
  en: { first: string; last: string };
}

export interface ProfileBasicInfo {
  name: ProfileName;
  gender?: string;
  birthday: string;
  birthdayDisplay?: string;
  nationality?: string;
}

export interface ProfileBiography {
  'short-values': string;
  short: string;
  long: string;
}

export interface ProfileSocialLink {
  platform: string;
  url: string;
}

export interface ProfileCareerEducation {
  organization: string;
  organizationDisplay?: string;
  department: string;
  departmentDisplay?: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

export interface ProfileCertificationDescription {
  title: string;
  description: string;
  url?: string | null;
}

export interface ProfileCertification {
  name: string;
  date: string;
  isPersonalAchievement?: boolean;
  description?: ProfileCertificationDescription | null;
}

export interface ProfileSkill {
  name: string;
}

export interface ProfileStrengthsFinder {
  top_5: string[];
}

export interface ProfileData {
  basicInfo: ProfileBasicInfo;
  biography: ProfileBiography;
  interests: string[];
  strengths_finder: ProfileStrengthsFinder;
  social_links: ProfileSocialLink[];
  values: string[];
  goals: string[];
  career: ProfileCareerEducation[];
  education: ProfileCareerEducation[];
  certifications: ProfileCertification[];
  skills: ProfileSkill[];
}

export declare const PROFILE_DISPLAY_CONFIG: {
  basicInfo: {
    showFullBirthday: boolean;
    showGender: boolean;
    showNationality: boolean;
  };
  career: {
    showSpecificOrganization: boolean;
    showSpecificDepartment: boolean;
    showFullDates: boolean;
  };
  education: {
    showSpecificSchool: boolean;
    showResearchLab: boolean;
  };
  socialLinks: {
    showTwitter: boolean;
    showWantedly: boolean;
  };
  certifications: {
    showPersonalAchievements: boolean;
    showUrls: boolean;
  };
};

/**
 * 表示用フィールドが未設定の場合は実名へフォールバックせず throw する。
 */
export declare const transformProfileForDisplay: (profileData: ProfileData) => ProfileData;
