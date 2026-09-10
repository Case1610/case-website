// プロフィール表示制御の実体。
// ビルド時（scripts/generate-profile.mjs / Node）とブラウザ側の両方から同じものを使う。
// 設定やロジックを2箇所に持つと片方だけ更新されて実名が漏れるため、ここを唯一の出所とする。

export const PROFILE_DISPLAY_CONFIG = {
  // 基本情報の表示制御
  basicInfo: {
    showFullBirthday: false,        // 完全な誕生日を表示するか（falseなら年のみ）
    showGender: false,              // 性別を表示するか
    showNationality: false,         // 国籍を表示するか
  },

  // 経歴の表示制御
  career: {
    showSpecificOrganization: false, // 具体的な組織名を表示するか
    showSpecificDepartment: false,   // 具体的な部署名を表示するか
    showFullDates: true,            // 完全な日付を表示するか
  },

  // 学歴の表示制御
  education: {
    showSpecificSchool: false,      // 具体的な学校名を表示するか
    showResearchLab: false,         // 研究室名を表示するか
  },

  // ソーシャルリンクの表示制御
  socialLinks: {
    showTwitter: true,              // Twitterリンクを表示するか
    showWantedly: false,            // Wantedlyリンクを表示するか
  },

  // 資格の表示制御
  certifications: {
    showPersonalAchievements: false, // 個人を特定しやすい実績を表示するか
    showUrls: false,                // 資格のURLを表示するか
  }
};

// 隠すと決めた項目に表示用の値が用意されているかを先に検査する。
// 未設定を実名へのフォールバックで埋めると、書き忘れが静かに露出になるため、
// ここで停止させて書き忘れをビルドエラーとして表面化させる。
const collectMissingDisplayFields = (profileData) => {
  const missing = [];

  if (!PROFILE_DISPLAY_CONFIG.basicInfo.showFullBirthday && !profileData.basicInfo?.birthdayDisplay) {
    missing.push('basicInfo.birthdayDisplay（showFullBirthday=false のため必須）');
  }

  if (!PROFILE_DISPLAY_CONFIG.career.showSpecificOrganization) {
    profileData.career?.forEach((job, i) => {
      if (!job.organizationDisplay) {
        missing.push(`career[${i}].organizationDisplay（showSpecificOrganization=false のため必須）`);
      }
    });
  }

  if (!PROFILE_DISPLAY_CONFIG.career.showSpecificDepartment) {
    profileData.career?.forEach((job, i) => {
      if (!job.departmentDisplay) {
        missing.push(`career[${i}].departmentDisplay（showSpecificDepartment=false のため必須）`);
      }
    });
  }

  if (!PROFILE_DISPLAY_CONFIG.education.showSpecificSchool) {
    profileData.education?.forEach((edu, i) => {
      if (!edu.organizationDisplay) {
        missing.push(`education[${i}].organizationDisplay（showSpecificSchool=false のため必須）`);
      }
    });
  }

  if (!PROFILE_DISPLAY_CONFIG.education.showResearchLab) {
    profileData.education?.forEach((edu, i) => {
      if (!edu.departmentDisplay) {
        missing.push(`education[${i}].departmentDisplay（showResearchLab=false のため必須）`);
      }
    });
  }

  return missing;
};

// プロフィールデータを表示用に変換する。
// 表示用の値へ置き換えたあとも *Display フィールドは残すため、二重に通しても結果は変わらない。
export const transformProfileForDisplay = (profileData) => {
  const missing = collectMissingDisplayFields(profileData);
  if (missing.length > 0) {
    throw new Error(
      'プロフィールの表示用フィールドが未設定です。実名へフォールバックせず処理を中止しました。\n' +
      missing.map((m) => `  - ${m}`).join('\n') +
      '\nPROFILE_DISPLAY_CONFIG で false にした項目には、対応する *Display を必ず指定してください。'
    );
  }

  const transformed = JSON.parse(JSON.stringify(profileData));

  if (!PROFILE_DISPLAY_CONFIG.basicInfo.showFullBirthday) {
    transformed.basicInfo.birthday = transformed.basicInfo.birthdayDisplay;
  }

  if (!PROFILE_DISPLAY_CONFIG.basicInfo.showGender) {
    delete transformed.basicInfo.gender;
  }

  if (!PROFILE_DISPLAY_CONFIG.basicInfo.showNationality) {
    delete transformed.basicInfo.nationality;
  }

  if (!PROFILE_DISPLAY_CONFIG.career.showSpecificOrganization) {
    transformed.career = transformed.career.map((job) => ({
      ...job,
      organization: job.organizationDisplay
    }));
  }

  if (!PROFILE_DISPLAY_CONFIG.career.showSpecificDepartment) {
    transformed.career = transformed.career.map((job) => ({
      ...job,
      department: job.departmentDisplay
    }));
  }

  if (!PROFILE_DISPLAY_CONFIG.education.showSpecificSchool) {
    transformed.education = transformed.education.map((edu) => ({
      ...edu,
      organization: edu.organizationDisplay
    }));
  }

  if (!PROFILE_DISPLAY_CONFIG.education.showResearchLab) {
    transformed.education = transformed.education.map((edu) => ({
      ...edu,
      department: edu.departmentDisplay
    }));
  }

  transformed.social_links = transformed.social_links.filter((link) => {
    if (link.platform === 'Twitter' && !PROFILE_DISPLAY_CONFIG.socialLinks.showTwitter) {
      return false;
    }
    if (link.platform === 'Wantedly' && !PROFILE_DISPLAY_CONFIG.socialLinks.showWantedly) {
      return false;
    }
    return true;
  });

  if (!PROFILE_DISPLAY_CONFIG.certifications.showPersonalAchievements) {
    transformed.certifications = transformed.certifications.filter(
      (cert) => !cert.isPersonalAchievement
    );
  }

  if (!PROFILE_DISPLAY_CONFIG.certifications.showUrls) {
    transformed.certifications = transformed.certifications.map((cert) => ({
      ...cert,
      description: cert.description ? { ...cert.description, url: null } : cert.description
    }));
  }

  // 全順位リストは画面のどこにも出さないと決めたフィールド。上流から供給しない方針だが、
  // 混ざったまま配信されると「表示されないのに届く」状態に戻るため、ここでも落とす。
  delete transformed.strengths_finder.all_ranking;

  return transformed;
};
