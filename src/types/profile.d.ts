/**
 * 層2（R2）から受け取るプロフィールの形。
 *
 * 正本は層2 の `schema.json`（実行時にも取りに行き、受け取ったデータを照合する）。
 * ここにあるのはその TypeScript 版で、**契約そのものではなく写し**。
 * 食い違ったときに正しいのは schema.json のほう。
 *
 * `gender` / `nationality` のような、公開しないと決めた項目は**型にも置かない。**
 * 型に残しておくと「いつか来るかもしれない」という顔をするが、
 * schema.json の `x-forbiddenKeys` はそれが来たら止めると言っている。
 * 片方が「来るかも」、もう片方が「来たら止める」では、読む人が判断できない。
 */

export interface ProfileName {
  ja: { first: string; last: string };
  en: { first: string; last: string };
}

export interface ProfileBasicInfo {
  name: ProfileName;
  /** 年だけ。schema.json が `^[0-9]{4}$` で縛っている */
  birthday: string;
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
  department?: string;
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
