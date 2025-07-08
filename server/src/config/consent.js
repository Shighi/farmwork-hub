const consentConfig = {
  // Data retention policies
  dataRetention: {
    // How long to keep consent records (in days)
    consentRecords: 2555, // ~7 years (legal requirement)
    // How long to keep audit logs (in days)
    auditLogs: 1095, // 3 years
    // How long to keep user data after consent withdrawal (in days)
    withdrawnUserData: 30, // 30 days for legal/operational needs
    // How long to keep anonymous analytics (in days)
    anonymousAnalytics: 730, // 2 years
  },

  // Consent types and their requirements
  consentTypes: {
    ESSENTIAL: {
      name: 'Essential Cookies',
      description: 'Necessary for the website to function properly',
      required: true,
      category: 'essential',
      purposes: ['authentication', 'security', 'session_management'],
      retention: '1 year',
      canWithdraw: false,
    },
    ANALYTICS: {
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website',
      required: false,
      category: 'analytics',
      purposes: ['usage_analytics', 'performance_monitoring'],
      retention: '2 years',
      canWithdraw: true,
    },
    MARKETING: {
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites for advertising purposes',
      required: false,
      category: 'marketing',
      purposes: ['advertising', 'personalization', 'remarketing'],
      retention: '1 year',
      canWithdraw: true,
    },
    FUNCTIONAL: {
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization',
      required: false,
      category: 'functional',
      purposes: ['user_preferences', 'language_settings', 'region_settings'],
      retention: '1 year',
      canWithdraw: true,
    },
    DATA_PROCESSING: {
      name: 'Data Processing',
      description: 'Processing of personal data for platform operations',
      required: true,
      category: 'data_processing',
      purposes: ['job_matching', 'user_communication', 'platform_operations'],
      retention: '5 years',
      canWithdraw: true,
    },
  },

  // Legal basis for processing
  legalBasis: {
    CONSENT: 'consent',
    CONTRACT: 'contract',
    LEGAL_OBLIGATION: 'legal_obligation',
    VITAL_INTERESTS: 'vital_interests',
    PUBLIC_TASK: 'public_task',
    LEGITIMATE_INTERESTS: 'legitimate_interests',
  },

  // Consent banner configuration
  banner: {
    // Show consent banner for these regions
    enabledRegions: ['EU', 'UK', 'CA', 'AU', 'KE', 'ZA', 'NG', 'GH'], // Include African countries
    // Default consent state for new users
    defaultConsent: {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      dataProcessing: false, // User must explicitly consent
    },
    // Consent banner text
    text: {
      title: 'We value your privacy',
      message: 'We use cookies and similar technologies to enhance your experience, analyze usage, and assist with our promotional efforts. By continuing to use our platform, you consent to our data processing practices.',
      acceptAll: 'Accept All',
      acceptEssential: 'Accept Essential Only',
      customize: 'Customize Settings',
      learnMore: 'Learn More',
    },
    // Cookie expiration (in days)
    cookieExpiration: 365,
  },

  // Data processing purposes
  processingPurposes: {
    job_matching: {
      name: 'Job Matching',
      description: 'Matching workers with suitable job opportunities',
      legalBasis: 'consent',
      dataTypes: ['profile_data', 'skills', 'location', 'job_preferences'],
      recipients: ['internal_staff', 'employers'],
      retention: '5 years',
    },
    user_communication: {
      name: 'User Communication',
      description: 'Sending notifications, updates, and platform communications',
      legalBasis: 'consent',
      dataTypes: ['contact_information', 'communication_preferences'],
      recipients: ['internal_staff', 'email_service_providers'],
      retention: '2 years',
    },
    platform_operations: {
      name: 'Platform Operations',
      description: 'Operating and maintaining the platform',
      legalBasis: 'contract',
      dataTypes: ['usage_data', 'technical_data', 'account_data'],
      recipients: ['internal_staff', 'technical_service_providers'],
      retention: '3 years',
    },
    authentication: {
      name: 'Authentication',
      description: 'User login and session management',
      legalBasis: 'contract',
      dataTypes: ['credentials', 'session_data'],
      recipients: ['internal_staff'],
      retention: '1 year',
    },
    security: {
      name: 'Security',
      description: 'Protecting against fraud and security threats',
      legalBasis: 'legitimate_interests',
      dataTypes: ['ip_address', 'device_information', 'access_logs'],
      recipients: ['internal_staff', 'security_service_providers'],
      retention: '2 years',
    },
    usage_analytics: {
      name: 'Usage Analytics',
      description: 'Understanding how users interact with the platform',
      legalBasis: 'consent',
      dataTypes: ['usage_patterns', 'feature_usage', 'performance_metrics'],
      recipients: ['internal_staff', 'analytics_service_providers'],
      retention: '2 years',
    },
    advertising: {
      name: 'Advertising',
      description: 'Delivering targeted advertisements',
      legalBasis: 'consent',
      dataTypes: ['interests', 'demographics', 'browsing_behavior'],
      recipients: ['advertising_partners', 'social_media_platforms'],
      retention: '1 year',
    },
  },

  // Compliance settings
  compliance: {
    // Enable GDPR compliance features
    gdprEnabled: true,
    // Enable CCPA compliance features
    ccpaEnabled: true,
    // Enable POPIA compliance (South Africa)
    popiaEnabled: true,
    // Enable Kenya DPA compliance
    kenyaDpaEnabled: true,
    // Automatically delete data after withdrawal
    autoDeleteOnWithdrawal: true,
    // Days to wait before deletion (for operational needs)
    deletionGracePeriod: 30,
    // Enable consent audit logging
    auditLogging: true,
    // Enable data portability
    dataPortability: true,
    // Enable right to be forgotten
    rightToBeForgotten: true,
  },

  // Notification settings
  notifications: {
    // Notify users when consent is about to expire
    consentExpiry: {
      enabled: true,
      daysBeforeExpiry: 30,
      reminderFrequency: 'weekly',
    },
    // Notify users of privacy policy changes
    policyChanges: {
      enabled: true,
      requireReConsent: true,
      notificationMethod: 'email',
    },
    // Notify users of data breaches
    dataBreaches: {
      enabled: true,
      notificationDelay: 72, // hours
      requireReConsent: false,
    },
  },

  // Audit trail settings
  audit: {
    // Events to log
    logEvents: [
      'consent_given',
      'consent_withdrawn',
      'consent_updated',
      'data_exported',
      'data_deleted',
      'policy_updated',
      'user_rights_exercised',
    ],
    // Retention period for audit logs
    retentionPeriod: 1095, // 3 years
    // Enable real-time audit alerts
    realTimeAlerts: true,
    // Admin notification thresholds
    alertThresholds: {
      withdrawalRate: 0.05, // 5% withdrawal rate
      dataRequests: 10, // 10 data requests per day
    },
  },

  // Integration settings
  integrations: {
    // Cookie consent management platform
    cookieConsentPlatform: {
      enabled: true,
      provider: 'custom', // or 'cookiebot', 'onetrust', etc.
      apiKey: process.env.COOKIE_CONSENT_API_KEY,
    },
    // Email service for notifications
    emailService: {
      provider: 'sendgrid', // or 'mailgun', 'ses', etc.
      apiKey: process.env.EMAIL_SERVICE_API_KEY,
      templateIds: {
        consentExpiry: 'consent_expiry_template',
        policyUpdate: 'policy_update_template',
        dataExport: 'data_export_template',
        dataDeleted: 'data_deleted_template',
      },
    },
    // Analytics integration
    analytics: {
      googleAnalytics: {
        enabled: true,
        trackingId: process.env.GA_TRACKING_ID,
        anonymizeIp: true,
        respectConsent: true,
      },
      mixpanel: {
        enabled: false,
        projectToken: process.env.MIXPANEL_TOKEN,
        respectConsent: true,
      },
    },
  },

  // User rights configuration
  userRights: {
    // Right to access
    dataAccess: {
      enabled: true,
      responseTime: 30, // days
      format: 'json', // or 'csv', 'xml'
      includeAuditTrail: true,
    },
    // Right to portability
    dataPortability: {
      enabled: true,
      responseTime: 30, // days
      format: 'json',
      includeMetadata: true,
    },
    // Right to rectification
    dataRectification: {
      enabled: true,
      selfService: true,
      requireVerification: true,
    },
    // Right to erasure
    dataErasure: {
      enabled: true,
      responseTime: 30, // days
      confirmationRequired: true,
      gracePeriod: 30, // days
    },
    // Right to object
    dataObjection: {
      enabled: true,
      categories: ['marketing', 'analytics', 'profiling'],
      immediateEffect: true,
    },
  },

  // Regional settings
  regional: {
    // European Union
    eu: {
      enabled: true,
      lawfulBasis: 'GDPR',
      consentAge: 16,
      rightToBeForgotten: true,
      dataPortability: true,
      dpoRequired: true,
    },
    // United Kingdom
    uk: {
      enabled: true,
      lawfulBasis: 'UK_GDPR',
      consentAge: 13,
      rightToBeForgotten: true,
      dataPortability: true,
      dpoRequired: true,
    },
    // Kenya
    kenya: {
      enabled: true,
      lawfulBasis: 'KENYA_DPA',
      consentAge: 18,
      rightToBeForgotten: true,
      dataPortability: true,
      dpoRequired: false,
    },
    // South Africa
    southAfrica: {
      enabled: true,
      lawfulBasis: 'POPIA',
      consentAge: 18,
      rightToBeForgotten: true,
      dataPortability: true,
      dpoRequired: false,
    },
  },

  // Development and testing settings
  development: {
    // Skip consent in development
    skipConsent: process.env.NODE_ENV === 'development',
    // Mock consent responses
    mockConsent: process.env.NODE_ENV === 'test',
    // Enable debug logging
    debugLogging: process.env.NODE_ENV !== 'production',
    // Test consent scenarios
    testScenarios: {
      consentGiven: true,
      consentWithdrawn: true,
      consentExpired: true,
      minorUser: true,
    },
  },
};

module.exports = consentConfig;