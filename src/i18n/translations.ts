import { SupportedLanguage } from '../types/index.ts';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    howItWorks: string;
    categories: string;
    mapView: string;
    solvedIssues: string;
    reportIssue: string;
    trackComplaint: string;
    dashboard: string;
    adminPanel: string;
    signIn: string;
    signUp: string;
    signOut: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    reportBtn: string;
    trackBtn: string;
    statsTotal: string;
    statsInProgress: string;
    statsResolved: string;
    statsAvgTime: string;
  };
  categories: {
    title: string;
    subtitle: string;
    roads_potholes: string;
    streetlights: string;
    water_supply: string;
    drainage_sewage: string;
    garbage_sanitation: string;
    public_infra: string;
    other: string;
  };
  status: {
    submitted: string;
    under_review: string;
    in_progress: string;
    resolved: string;
    closed: string;
    reopened: string;
  };
  severity: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  reportModal: {
    heading: string;
    subheading: string;
    titleLabel: string;
    titlePlaceholder: string;
    categoryLabel: string;
    severityLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    wardLabel: string;
    photoLabel: string;
    photoHelp: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    refNoLabel: string;
    viewComplaint: string;
  };
  auth: {
    signInTitle: string;
    signUpTitle: string;
    usernameLabel: string;
    passwordLabel: string;
    fullNameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    confirmPasswordLabel: string;
    signInBtn: string;
    signUpBtn: string;
    twoFactorTitle: string;
    twoFactorSubtitle: string;
    twoFactorPlaceholder: string;
    verifyBtn: string;
    noAccount: string;
    alreadyAccount: string;
    rememberMe: string;
    privacyConsent: string;
    adminNotice: string;
  };
  dashboard: {
    welcome: string;
    citizenTitle: string;
    adminTitle: string;
    myComplaints: string;
    newComplaint: string;
    inventory: string;
    logs: string;
    users: string;
    regionalImpact: string;
    notifications: string;
    emptyComplaints: string;
    emptyComplaintsDesc: string;
    respondBtn: string;
    updateStatusBtn: string;
    officialResponse: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    suggest1: string;
    suggest2: string;
    suggest3: string;
  };
  map: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterActive: string;
    filterResolved: string;
    zoomIn: string;
    zoomOut: string;
    selectedLocation: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  // Telugu (most importantly highlighted in prompt)
  te: {
    appName: 'సివిక్‌ఫిక్స్',
    tagline: 'మీ గళం • మా బాధ్యత • మెరుగైన సమాజం',
    nav: {
      home: 'హోమ్',
      howItWorks: 'ఎలా పనిచేస్తుంది',
      categories: 'సమస్యల విభాగాలు',
      mapView: 'నగర పటం (మ్యాప్)',
      solvedIssues: 'పరిష్కరించబడిన సమస్యలు',
      reportIssue: 'సమస్యను నివేదించండి',
      trackComplaint: 'ఫిర్యాదు స్థితిని తనిఖీ చేయండి',
      dashboard: 'డ్యాష్‌బోర్డ్',
      adminPanel: 'అధికారిక ప్యానెల్',
      signIn: 'లాగిన్',
      signUp: 'నమోదు (సైన్ అప్)',
      signOut: 'లాగ్ అవుట్',
    },
    hero: {
      badge: 'డిజిటల్ పౌర సేవ మరియు పరిష్కార వేదిక',
      title: 'మన సమాజాన్ని కలిసి మెరుగుపరుచుకుందాం.',
      subtitle:
        'గుంతలు పడ్డ రోడ్డు, వీధి దీపాల సమస్య, చెత్త పేరుకుపోవడం లేదా తాగునీటి సరఫరా లోపాలను ఫోటోతో సులభంగా నివేదించండి. అధికారుల తక్షణ చర్యలను ట్రాక్ చేయండి.',
      reportBtn: 'సమస్యను నివేదించండి',
      trackBtn: 'ఫిర్యాదును ట్రాక్ చేయండి',
      statsTotal: 'మొత్తం ఫిర్యాదులు',
      statsInProgress: 'పురోగతిలో ఉన్నవి',
      statsResolved: 'పరిష్కరించబడినవి',
      statsAvgTime: 'సగటు పరిష్కార సమయం',
    },
    categories: {
      title: 'సమస్యల విభాగాలు',
      subtitle: 'ఏ రకమైన పౌర మౌలిక సదుపాయాల సమస్యను నివేదించాలనుకుంటున్నారు?',
      roads_potholes: 'రోడ్లు మరియు గుంతలు',
      streetlights: 'వీధి దీపాలు & విద్యుత్ లైట్లు',
      water_supply: 'మంచినీటి లీకేజ్ & నీటి సరఫరా',
      drainage_sewage: 'డ్రైనేజీ మరియు మురుగు కాలువలు',
      garbage_sanitation: 'చెత్త సేకరణ & పారిశుధ్యం',
      public_infra: 'ప్రజా మౌలిక సదుపాయాలు',
      other: 'ఇతర పౌర సమస్యలు',
    },
    status: {
      submitted: 'సమర్పించబడింది',
      under_review: 'సమీక్షలో ఉంది',
      in_progress: 'పని జరుగుతోంది',
      resolved: 'పరిష్కరించబడింది',
      closed: 'ముగిసింది',
      reopened: 'తిరిగి తెరవబడింది',
    },
    severity: {
      low: 'సాధారణం',
      medium: 'మధ్యస్థం',
      high: 'తీవ్రమైనది',
      critical: 'అత్యవసరం',
    },
    reportModal: {
      heading: 'పౌర సమస్యను నివేదించండి',
      subheading: 'బాధ్యతాయుత అధికారులకు స్పష్టమైన వివరాలు మరియు ఫోటో అందించండి.',
      titleLabel: 'ఫిర్యాదు శీర్షిక',
      titlePlaceholder: 'ఉదాహరణ: ప్రధాన రహదారిపై పెద్ద గుంత',
      categoryLabel: 'సమస్య విభాగం',
      severityLabel: 'తీవ్రత స్థాయి',
      descriptionLabel: 'పూర్తి వివరణ',
      descriptionPlaceholder: 'సమస్య వివరాలు, ఎక్కడ ఉంది, ప్రజలకు ఎలాంటి ఇబ్బంది కలుగుతుందో వివరించండి...',
      locationLabel: 'స్థలం / చిరునామా',
      locationPlaceholder: 'వీధి పేరు, ప్రాంతం, ల్యాండ్‌మార్క్',
      wardLabel: 'వార్డు / డివిజన్',
      photoLabel: 'ఫోటో సాక్ష్యం (రుజువు)',
      photoHelp: 'మొబైల్ కెమెరా లేదా గ్యాలరీ నుండి ఫోటో ఎంచుకోండి (గరిష్టంగా 10MB)',
      submitBtn: 'ఫిర్యాదును సమర్పించండి',
      submitting: 'దాఖలు చేస్తోంది...',
      successTitle: 'మీ ఫిర్యాదు విజయవంతంగా నమోదు చేయబడింది!',
      successMessage: 'సంబంధిత మున్సిపల్ ఇంజనీరింగ్ విభాగానికి సమాచారం పంపబడింది.',
      refNoLabel: 'ఫిర్యాదు గుర్తింపు సంఖ్య',
      viewComplaint: 'వివరాలు చూడండి',
    },
    auth: {
      signInTitle: 'ఖాతాలోకి ప్రవేశించండి',
      signUpTitle: 'కొత్త ఖాతాను సృష్టించండి',
      usernameLabel: 'వాడుకరి పేరు లేదా ఈమెయిల్',
      passwordLabel: 'రహస్య పదం (పాస్‌వర్డ్)',
      fullNameLabel: 'పూర్తి పేరు',
      emailLabel: 'ఈమెయిల్ చిరునామా',
      phoneLabel: 'మొబైల్ సంఖ్య',
      confirmPasswordLabel: 'పాస్‌వర్డ్‌ను ధృవీకరించండి',
      signInBtn: 'ప్రవేశించండి (సైన్ ఇన్)',
      signUpBtn: 'ఖాతాను సృష్టించండి',
      twoFactorTitle: 'రెండు అంచెల భద్రత (2FA)',
      twoFactorSubtitle: 'మీ మొబైల్ లేదా అథెంటికేటర్‌కు పంపిన 6-అంకెల కోడ్ నమోదు చేయండి.',
      twoFactorPlaceholder: '6-అంకెల కోడ్ (ఉదా: 123456)',
      verifyBtn: 'ధృవీకరించండి',
      noAccount: 'ఖాతా లేదా? ఇక్కడ నమోదు చేసుకోండి.',
      alreadyAccount: 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి.',
      rememberMe: 'నన్ను గుర్తుంచుకో',
      privacyConsent: 'నేను పౌర సేవా గోప్యతా విధానాన్ని అంగీకరిస్తున్నాను',
      adminNotice: 'రక్షిత వ్యవస్థ నిర్వహణ అధికారిక పోర్టల్.',
    },
    dashboard: {
      welcome: 'స్వాగతం',
      citizenTitle: 'పౌర సేవా డ్యాష్‌బోర్డ్',
      adminTitle: 'మున్సిపల్ అడ్మినిస్ట్రేటివ్ కంట్రోల్ సెంటర్',
      myComplaints: 'నా ఫిర్యాదులు',
      newComplaint: 'కొత్త ఫిర్యాదు సమర్పించండి',
      inventory: 'పౌర వనరుల ఇన్వెంటరీ నిర్వహణ',
      logs: 'సిస్టమ్ & ఆడిట్ లాగ్‌లు',
      users: 'నమోదైన పౌరుల నిర్వహణ',
      regionalImpact: 'ప్రాంతీయ పురోగతి మరియు ప్రభావం',
      notifications: 'నోటిఫికేషన్‌లు',
      emptyComplaints: 'మీరు ఇంకా ఎటువంటి సమస్యలను నివేదించలేదు.',
      emptyComplaintsDesc: 'మీ కాలనీ లేదా వార్డులో సమస్య కనిపిస్తే వెంటనే ఇక్కడ నివేదించండి.',
      respondBtn: 'అధికారిక స్పందన పంపండి',
      updateStatusBtn: 'స్థితిని మార్చండి',
      officialResponse: 'అధికారిక ప్రతిస్పందన',
    },
    chatbot: {
      title: 'సివిక్ అసిస్టెంట్ (AI)',
      subtitle: '24/7 పౌర సమస్యల పరిష్కార సహాయకుడు',
      placeholder: 'మీ ప్రశ్నను ఇక్కడ అడగండి (ఉదా: గుంతను ఎలా నివేదించాలి?)...',
      send: 'పంపు',
      suggest1: 'గుంతను ఎలా నివేదించాలి?',
      suggest2: 'నా ఫిర్యాదు స్థితి ఎలా తెలుసుకోవాలి?',
      suggest3: 'రాత్రి వేళ వీధి దీపాల మరమ్మత్తు నియమాలు',
    },
    map: {
      title: 'ప్రాంతీయ జియో-మ్యాప్',
      subtitle: 'నగరంలోని సమస్యాత్మక ప్రాంతాలు మరియు పరిష్కారాల ప్రత్యక్ష పటం',
      filterAll: 'అన్నీ',
      filterActive: 'పరిష్కారం కావాల్సినవి',
      filterResolved: 'పరిష్కరించబడినవి',
      zoomIn: 'జూమ్ ఇన్',
      zoomOut: 'జూమ్ అవుట్',
      selectedLocation: 'ఎంపిక చేసిన ప్రదేశం',
    },
  },

  // English
  en: {
    appName: 'CivicFix',
    tagline: 'Your Voice • Our Responsibility • A Better Community',
    nav: {
      home: 'Home',
      howItWorks: 'How It Works',
      categories: 'Categories',
      mapView: 'City Map',
      solvedIssues: 'Solved Cases',
      reportIssue: 'Report an Issue',
      trackComplaint: 'Track Complaint',
      dashboard: 'Dashboard',
      adminPanel: 'Admin Panel',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
    },
    hero: {
      badge: 'Digital Civic Infrastructure & Resolution Portal',
      title: "Let's Make Our Community Better, Together.",
      subtitle:
        'Notice a pothole, broken streetlight, overflowing garbage bin, or damaged public works? Report it through CivicFix, track progress live, and receive official updates directly from the authorities.',
      reportBtn: 'Report an Issue',
      trackBtn: 'Track a Complaint',
      statsTotal: 'Total Reports',
      statsInProgress: 'Under Resolution',
      statsResolved: 'Successfully Fixed',
      statsAvgTime: 'Avg Resolution Time',
    },
    categories: {
      title: 'Public Issue Categories',
      subtitle: 'Select the infrastructure domain requiring immediate municipal attention',
      roads_potholes: 'Roads & Potholes',
      streetlights: 'Streetlights & Electrical',
      water_supply: 'Water Leakage & Supply',
      drainage_sewage: 'Drainage & Sewage',
      garbage_sanitation: 'Garbage & Sanitation',
      public_infra: 'Damaged Public Works',
      other: 'Other Civic Grievances',
    },
    status: {
      submitted: 'Submitted',
      under_review: 'Under Review',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
      reopened: 'Reopened',
    },
    severity: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    },
    reportModal: {
      heading: 'Report a Civic Infrastructure Issue',
      subheading: 'Submit factual details and photo evidence to municipal authorities.',
      titleLabel: 'Complaint Title',
      titlePlaceholder: 'e.g., Deep pothole endangering two-wheelers near Main Junction',
      categoryLabel: 'Issue Category',
      severityLabel: 'Urgency / Severity',
      descriptionLabel: 'Detailed Description',
      descriptionPlaceholder: 'Describe the problem, hazard to commuters, and exact location markers...',
      locationLabel: 'Street Address & Locality',
      locationPlaceholder: 'Road name, landmark, area',
      wardLabel: 'Ward / Division',
      photoLabel: 'Photo Evidence',
      photoHelp: 'Upload or capture clear photo evidence (JPEG/PNG up to 10MB)',
      submitBtn: 'Submit Complaint',
      submitting: 'Submitting Report...',
      successTitle: 'Complaint Submitted Successfully!',
      successMessage: 'Your issue has been logged with the municipal engineering team.',
      refNoLabel: 'Reference Tracking Number',
      viewComplaint: 'View Complaint',
    },
    auth: {
      signInTitle: 'Sign In to Your Account',
      signUpTitle: 'Create a Citizen Account',
      usernameLabel: 'Username or Email',
      passwordLabel: 'Password',
      fullNameLabel: 'Full Legal Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Mobile Phone Number',
      confirmPasswordLabel: 'Confirm Password',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      twoFactorTitle: 'Two-Factor Authentication (2FA)',
      twoFactorSubtitle: 'Enter the 6-digit verification code from your authenticator or SMS.',
      twoFactorPlaceholder: '6-digit OTP code',
      verifyBtn: 'Verify & Proceed',
      noAccount: "New to CivicFix? Sign up.",
      alreadyAccount: 'Already have an account? Sign in.',
      rememberMe: 'Remember this device',
      privacyConsent: 'I consent to the civic privacy policy and terms of service',
      adminNotice: 'Authorized municipal personnel portal with audit logging.',
    },
    dashboard: {
      welcome: 'Welcome back',
      citizenTitle: 'Citizen Services Dashboard',
      adminTitle: 'Municipal Administration Operations Desk',
      myComplaints: 'My Reported Complaints',
      newComplaint: 'File New Complaint',
      inventory: 'Civic Assets & Inventory',
      logs: 'System Logs & Audit Trail',
      users: 'Citizen User Registry',
      regionalImpact: 'Regional Impact & Performance',
      notifications: 'Notifications',
      emptyComplaints: 'You have not reported any complaints yet.',
      emptyComplaintsDesc: 'See an infrastructure issue? Report it to make your neighborhood safer.',
      respondBtn: 'Send Official Response',
      updateStatusBtn: 'Update Status',
      officialResponse: 'Official Response from Authority',
    },
    chatbot: {
      title: 'Civic Assistant (AI)',
      subtitle: 'Real-time guidance and reporting helper',
      placeholder: 'Ask anything about civic reporting or municipal rules...',
      send: 'Send',
      suggest1: 'How do I report a pothole?',
      suggest2: 'What is the standard resolution timeline?',
      suggest3: 'How to appeal an unresolved complaint?',
    },
    map: {
      title: 'Geographic Ward Map',
      subtitle: 'Live visual pins of active issues and verified resolutions',
      filterAll: 'All Markers',
      filterActive: 'Pending Action',
      filterResolved: 'Resolved',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      selectedLocation: 'Selected Coordinates',
    },
  },

  // Hindi
  hi: {
    appName: 'सिविकफिक्स',
    tagline: 'आपकी आवाज • हमारा कर्तव्य • बेहतर समाज',
    nav: {
      home: 'होम',
      howItWorks: 'यह कैसे काम करता है',
      categories: 'समस्या श्रेणियां',
      mapView: 'शहर का नक्शा',
      solvedIssues: 'सुलझाए गए मामले',
      reportIssue: 'समस्या दर्ज करें',
      trackComplaint: 'शिकायत ट्रैक करें',
      dashboard: 'डैशबोर्ड',
      adminPanel: 'प्रशासनिक पैनल',
      signIn: 'लॉग इन',
      signUp: 'साइन अप',
      signOut: 'लॉग आउट',
    },
    hero: {
      badge: 'डिजिटल नागरिक सेवा और समस्या निवारण पोर्टल',
      title: 'आइए मिलकर अपने समुदाय को बेहतर बनाएं।',
      subtitle:
        'सड़क पर गड्ढा, टूटी स्ट्रीट लाइट, कचरे का ढेर या जल आपूर्ति की समस्या? सिविकफिक्स पर फोटो के साथ रिपोर्ट करें और सीधे प्रशासन से अपडेट प्राप्त करें।',
      reportBtn: 'समस्या दर्ज करें',
      trackBtn: 'शिकायत ट्रैक करें',
      statsTotal: 'कुल शिकायतें',
      statsInProgress: 'प्रगति पर',
      statsResolved: 'हल की गई समस्याएं',
      statsAvgTime: 'औसत समाधान समय',
    },
    categories: {
      title: 'समस्या श्रेणियां',
      subtitle: 'वह श्रेणी चुनें जिसमें तत्काल ध्यान देने की आवश्यकता है',
      roads_potholes: 'सड़कें और गड्ढे',
      streetlights: 'स्ट्रीट लाइट और बिजली',
      water_supply: 'पानी का रिसाव और आपूर्ति',
      drainage_sewage: 'नाली और सीवेज',
      garbage_sanitation: 'कचरा और स्वच्छता',
      public_infra: 'सार्वजनिक बुनियादी ढांचा',
      other: 'अन्य नागरिक शिकायतें',
    },
    status: {
      submitted: 'दर्ज किया गया',
      under_review: 'समीक्षाधीन',
      in_progress: 'कार्य प्रगति पर',
      resolved: 'समाधान हुआ',
      closed: 'बंद किया गया',
      reopened: 'पुनः खोला गया',
    },
    severity: {
      low: 'निम्न',
      medium: 'मध्यम',
      high: 'उच्च',
      critical: 'अति गंभीर',
    },
    reportModal: {
      heading: 'नागरिक समस्या की रिपोर्ट करें',
      subheading: 'प्रशासन को सटीक विवरण और फोटो साक्ष्य प्रदान करें।',
      titleLabel: 'शिकायत का शीर्षक',
      titlePlaceholder: 'उदा. मुख्य चौराहे के पास खतरनाक गड्ढा',
      categoryLabel: 'श्रेणी',
      severityLabel: 'गंभीरता',
      descriptionLabel: 'विस्तृत विवरण',
      descriptionPlaceholder: 'समस्या, स्थान और जनता को हो रही परेशानी का विवरण दें...',
      locationLabel: 'सड़क व क्षेत्र का पता',
      locationPlaceholder: 'मार्ग का नाम, लैंडमार्क, क्षेत्र',
      wardLabel: 'वार्ड / प्रभाग',
      photoLabel: 'फोटो साक्ष्य',
      photoHelp: 'कैमरा या गैलरी से फोटो अपलोड करें (अधिकतम 10MB)',
      submitBtn: 'शिकायत दर्ज करें',
      submitting: 'दर्ज किया जा रहा है...',
      successTitle: 'शिकायत सफलतापूर्वक दर्ज!',
      successMessage: 'आपकी शिकायत संबंधित नगर पालिका विभाग को भेज दी गई है।',
      refNoLabel: 'शिकायत संदर्भ संख्या',
      viewComplaint: 'विवरण देखें',
    },
    auth: {
      signInTitle: 'अपने खाते में प्रवेश करें',
      signUpTitle: 'नागरिक खाता बनाएं',
      usernameLabel: 'उपयोगकर्ता नाम या ईमेल',
      passwordLabel: 'पासवर्ड',
      fullNameLabel: 'पूरा नाम',
      emailLabel: 'ईमेल पता',
      phoneLabel: 'मोबाइल नंबर',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      signInBtn: 'प्रवेश करें',
      signUpBtn: 'खाता बनाएं',
      twoFactorTitle: 'दो-चरणीय प्रमाणीकरण (2FA)',
      twoFactorSubtitle: 'अपने फोन पर भेजा गया 6-अंकीय कोड दर्ज करें।',
      twoFactorPlaceholder: '6-अंकीय ओटीपी कोड',
      verifyBtn: 'सत्यापित करें',
      noAccount: 'क्या आपका खाता नहीं है? साइन अप करें।',
      alreadyAccount: 'पहले से खाता है? लॉग इन करें।',
      rememberMe: 'मुझे याद रखें',
      privacyConsent: 'मैं नागरिक गोपनीयता नीति से सहमत हूं',
      adminNotice: 'सुरक्षित प्रशासनिक प्रबंधन पोर्टल।',
    },
    dashboard: {
      welcome: 'स्वागत है',
      citizenTitle: 'नागरिक सेवा डैशबोर्ड',
      adminTitle: 'नगर निगम प्रशासन डेस्क',
      myComplaints: 'मेरी शिकायतें',
      newComplaint: 'नई शिकायत दर्ज करें',
      inventory: 'सार्वजनिक संपत्ति सूची (इन्वेंटरी)',
      logs: 'सिस्टम ऑडिट लॉग्स',
      users: 'पंजीकृत नागरिक सूची',
      regionalImpact: 'क्षेत्रीय प्रदर्शन व प्रभाव',
      notifications: 'सूचनाएं',
      emptyComplaints: 'आपने अभी तक कोई शिकायत दर्ज नहीं की है।',
      emptyComplaintsDesc: 'यदि आपके आस-पास कोई समस्या है तो तुरंत रिपोर्ट करें।',
      respondBtn: 'आधिकारिक उत्तर भेजें',
      updateStatusBtn: 'स्थिति अपडेट करें',
      officialResponse: 'प्रशासन की आधिकारिक प्रतिक्रिया',
    },
    chatbot: {
      title: 'सिविक सहायक (AI)',
      subtitle: '24/7 नागरिक सहायता व मार्गदर्शन',
      placeholder: 'नागरिक समस्या रिपोर्टिंग से संबंधित कुछ भी पूछें...',
      send: 'भेजें',
      suggest1: 'सड़क के गड्ढे की शिकायत कैसे करें?',
      suggest2: 'शिकायत की स्थिति कैसे जांचें?',
      suggest3: 'स्ट्रीट लाइट कब ठीक होगी?',
    },
    map: {
      title: 'भौगोलिक वार्ड मानचित्र',
      subtitle: 'सक्रिय समस्याओं और समाधानों का लाइव नक्शा',
      filterAll: 'सभी',
      filterActive: 'लंबित समस्याएं',
      filterResolved: 'हल की गई समस्याएं',
      zoomIn: 'ज़ूम इन',
      zoomOut: 'ज़ूम आउट',
      selectedLocation: 'चयनित स्थान',
    },
  },

  // Marathi
  mr: {
    appName: 'सिव्हिकफिक्स',
    tagline: 'तुमचा आवाज • आमची जबाबदारी • उत्तम समाज',
    nav: {
      home: 'मुख्यपृष्ठ',
      howItWorks: 'कसे कार्य करते',
      categories: 'समस्या प्रवर्ग',
      mapView: 'शहराचा नकाशा',
      solvedIssues: 'सोडवलेल्या समस्या',
      reportIssue: 'तक्रार नोंदवा',
      trackComplaint: 'तक्रार स्थिती तपासा',
      dashboard: 'डॅशबोर्ड',
      adminPanel: 'प्रशासक कक्ष',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      signOut: 'बाहेर पडा',
    },
    hero: {
      badge: 'डिजिटल नागरी पायाभूत सुविधा व तक्रार निवारण व्यासपीठ',
      title: 'आपला परिसर एकत्र येऊन सुंदर व सुरक्षित बनवूया.',
      subtitle:
        'खड्डे, बंद पथदिवे, कचरा किंवा पाण्याची गळती यासारख्या नागरी समस्या फोटोसह थेट महानगरपालिकेकडे नोंदवा आणि तत्काळ अपडेट्स मिळवा.',
      reportBtn: 'तक्रार नोंदवा',
      trackBtn: 'तक्रार तपासा',
      statsTotal: 'एकूण तक्रारी',
      statsInProgress: 'प्रगतीपथावर',
      statsResolved: 'सोडवलेल्या तक्रारी',
      statsAvgTime: 'सरासरी निवारण वेळ',
    },
    categories: {
      title: 'समस्या प्रवर्ग',
      subtitle: 'कोणत्या नागरी समस्येचे निवारण हवे आहे ते निवडा',
      roads_potholes: 'रस्ते आणि खड्डे',
      streetlights: 'पथदिवे आणि वीज',
      water_supply: 'पाणी गळती आणि पुरवठा',
      drainage_sewage: 'गटारे आणि सांडपाणी',
      garbage_sanitation: 'कचरा आणि स्वच्छता',
      public_infra: 'सार्वजनिक सुविधा',
      other: 'इतर नागरी तक्रारी',
    },
    status: {
      submitted: 'नोंदवले',
      under_review: 'पुनरावलोकनात',
      in_progress: 'काम चालू आहे',
      resolved: 'निवारण झाले',
      closed: 'बंद',
      reopened: 'पुन्हा उघडले',
    },
    severity: {
      low: 'कमी',
      medium: 'मध्यम',
      high: 'तीव्र',
      critical: 'अत्यंत गंभीर',
    },
    reportModal: {
      heading: 'नागरी समस्येची नोंद करा',
      subheading: 'प्रशासनाला योग्य माहिती आणि फोटो पुरावा सादर करा.',
      titleLabel: 'तक्रारीचे शीर्षक',
      titlePlaceholder: 'उदा. मुख्य रस्त्यावरील खोल खड्डा',
      categoryLabel: 'प्रवर्ग',
      severityLabel: 'गंभीरता पातळी',
      descriptionLabel: 'सविस्तर माहिती',
      descriptionPlaceholder: 'समस्या आणि नागरिकांना होणारा त्रास स्पष्ट करा...',
      locationLabel: 'पत्ता / परिसर',
      locationPlaceholder: 'रस्त्याचे नाव, खूण, परिसर',
      wardLabel: 'प्रभाग / वॉर्ड',
      photoLabel: 'फोटो पुरावा',
      photoHelp: 'मोबाईलवरून फोटो अपलोड करा (कमाल 10MB)',
      submitBtn: 'तक्रार सबमिट करा',
      submitting: 'नोंदवत आहे...',
      successTitle: 'तक्रार यशस्वीरित्या नोंदवली गेली!',
      successMessage: 'आपली तक्रार पालिका विभागाकडे पाठवण्यात आली आहे.',
      refNoLabel: 'तक्रार संदर्भ क्रमांक',
      viewComplaint: 'तपशील पहा',
    },
    auth: {
      signInTitle: 'खात्यात प्रवेश करा',
      signUpTitle: 'नवीन खाते तयार करा',
      usernameLabel: 'वापरकर्ता नाव किंवा ईमेल',
      passwordLabel: 'पासवर्ड',
      fullNameLabel: 'पूर्ण नाव',
      emailLabel: 'ईमेल पत्ता',
      phoneLabel: 'मोबाईल क्रमांक',
      confirmPasswordLabel: 'पासवर्डची खात्री करा',
      signInBtn: 'प्रवेश करा',
      signUpBtn: 'खाते तयार करा',
      twoFactorTitle: 'दुहेरी प्रमाणीकरण (2FA)',
      twoFactorSubtitle: 'आपल्या फोनवर आलेला 6-अंकी कोड प्रविष्ट करा.',
      twoFactorPlaceholder: '6-अंकी कोड',
      verifyBtn: 'सत्यापित करा',
      noAccount: 'नवीन आहात? नोंदणी करा.',
      alreadyAccount: 'आधीच खाते आहे? लॉगिन करा.',
      rememberMe: 'लक्षात ठेवा',
      privacyConsent: 'मी गोपनीयता अटी मान्य करतो',
      adminNotice: 'सुरक्षित प्रशासकीय व्यवस्थापन प्रणाली.',
    },
    dashboard: {
      welcome: 'स्वागत आहे',
      citizenTitle: 'नागरी सेवा डॅशबोर्ड',
      adminTitle: 'महानगरपालिका प्रशासकीय नियंत्रण कक्ष',
      myComplaints: 'माझ्या तक्रारी',
      newComplaint: 'नवीन तक्रार नोंदवा',
      inventory: 'नागरी मालमत्ता सूची',
      logs: 'प्रणाली ऑडिट नोंदी',
      users: 'नागरिक नोंदणी सूची',
      regionalImpact: 'विभागीय कामगिरी व प्रगती',
      notifications: 'सूचना',
      emptyComplaints: 'तुम्ही अद्याप कोणतीही तक्रार नोंदवलेली नाही.',
      emptyComplaintsDesc: 'परिसरातील समस्या सोडवण्यासाठी आजच तक्रार नोंदवा.',
      respondBtn: 'अधिकृत उत्तर पाठवा',
      updateStatusBtn: 'स्थिती बदला',
      officialResponse: 'प्रशासनाचा अधिकृत प्रतिसाद',
    },
    chatbot: {
      title: 'सिव्हिक सहाय्यक (AI)',
      subtitle: 'नागरी समस्या मार्गदर्शक',
      placeholder: 'नागरी समस्यांविषयी विचारा...',
      send: 'पाठवा',
      suggest1: 'खड्ड्याची तक्रार कशी करावी?',
      suggest2: 'तक्रारीची स्थिती कशी पाहावी?',
      suggest3: 'पाणीपुरवठा वेळेचे नियम',
    },
    map: {
      title: 'भौगोलिक प्रभाग नकाशा',
      subtitle: 'थेट तक्रारी आणि निवारण झालेल्या कामांचा नकाशा',
      filterAll: 'सर्व',
      filterActive: 'प्रलंबित कामे',
      filterResolved: 'पूर्ण झालेली कामे',
      zoomIn: 'झूम इन',
      zoomOut: 'झूम आउट',
      selectedLocation: 'निवडलेले ठिकाण',
    },
  },

  // Tamil
  ta: {
    appName: 'சிவிக்பிக்ஸ்',
    tagline: 'உங்கள் குரல் • எங்கள் கடமை • சிறந்த சமுதாயம்',
    nav: {
      home: 'முகப்பு',
      howItWorks: 'எவ்வாறு செயல்படுகிறது',
      categories: 'பிரச்சனை பிரிவுகள்',
      mapView: 'நகர வரைபடம்',
      solvedIssues: 'தீர்க்கப்பட்ட புகார்கள்',
      reportIssue: 'புகார் அளிக்கவும்',
      trackComplaint: 'நிலையை அறிய',
      dashboard: 'டாஷ்போர்டு',
      adminPanel: 'நிர்வாகப் பிரிவு',
      signIn: 'உள்நுழைக',
      signUp: 'பதிவு செய்க',
      signOut: 'வெளியேறுக',
    },
    hero: {
      badge: 'டிஜிட்டல் குடிமை கட்டமைப்பு & தீர்வு தளம்',
      title: 'நமது சமுதாயத்தை ஒன்றிணைந்து மேம்படுத்துவோம்.',
      subtitle:
        'சாலை பள்ளங்கள், தெருவிளக்கு பழுது, குப்பை தேக்கம் அல்லது குடிநீர் பிரச்சனைகளை புகைப்படத்துடன் உடனே புகார் அளியுங்கள். அதிகாரிகளின் நடவடிக்கைகளை கண்காணிக்கவும்.',
      reportBtn: 'புகார் அளிக்கவும்',
      trackBtn: 'புகாரை கண்காணிக்கவும்',
      statsTotal: 'மொத்த புகார்கள்',
      statsInProgress: 'நடவடிக்கையில்',
      statsResolved: 'தீர்க்கப்பட்டவை',
      statsAvgTime: 'சராசரி தீர்வு நேரம்',
    },
    categories: {
      title: 'பிரச்சனை பிரிவுகள்',
      subtitle: 'உடனடி கவனம் தேவைப்படும் பொதுக் கட்டமைப்பு துறையை தேர்ந்தெடுக்கவும்',
      roads_potholes: 'சாலைகள் & பள்ளங்கள்',
      streetlights: 'தெருவிளக்குகள் & மின்சாரம்',
      water_supply: 'குடிநீர் கசிவு & விநியோகம்',
      drainage_sewage: 'சாக்கடை & கழிவுநீர்',
      garbage_sanitation: 'குப்பை & தூய்மைப்பணி',
      public_infra: 'பொதுக் கட்டமைப்பு',
      other: 'பிற குடிமை குறைகள்',
    },
    status: {
      submitted: 'சமர்ப்பிக்கப்பட்டது',
      under_review: 'ஆய்வில் உள்ளது',
      in_progress: 'பணி நடக்கிறது',
      resolved: 'தீர்க்கப்பட்டது',
      closed: 'முடிக்கப்பட்டது',
      reopened: 'மீண்டும் திறக்கப்பட்டது',
    },
    severity: {
      low: 'குறைவு',
      medium: 'நடுத்தரம்',
      high: 'அதிகம்',
      critical: 'அவசரம்',
    },
    reportModal: {
      heading: 'பொதுப் பிரச்சனையை பதிவு செய்யவும்',
      subheading: 'அதிகாரிகளுக்கு தெளிவான விவரங்கள் மற்றும் புகைப்பட சான்றை வழங்கவும்.',
      titleLabel: 'புகார் தலைப்பு',
      titlePlaceholder: 'எ.கா: பிரதான சாலையில் உள்ள ஆபத்தான பள்ளம்',
      categoryLabel: 'பிரிவு',
      severityLabel: 'தீவிரம்',
      descriptionLabel: 'முழு விவரம்',
      descriptionPlaceholder: 'பிரச்சனை மற்றும் பொதுமக்களுக்கு ஏற்படும் சிரமத்தை விளக்குக...',
      locationLabel: 'இடம் / முகவரி',
      locationPlaceholder: 'தெரு பெயர், அடையாளம், பகுதி',
      wardLabel: 'வார்டு / பிரிவு',
      photoLabel: 'புகைப்பட சான்று',
      photoHelp: 'தெளிவான புகைப்படத்தை பதிவேற்றவும் (அதிகபட்சம் 10MB)',
      submitBtn: 'புகாரை சமர்ப்பிக்கவும்',
      submitting: 'பதிவாகிறது...',
      successTitle: 'புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
      successMessage: 'உங்கள் புகார் நகராட்சி பொறியியல் துறைக்கு அனுப்பப்பட்டுள்ளது.',
      refNoLabel: 'புகார் குறிப்பு எண்',
      viewComplaint: 'விவரங்களை பார்க்க',
    },
    auth: {
      signInTitle: 'கணக்கில் உள்நுழைக',
      signUpTitle: 'புதிய கணக்கை உருவாக்கவும்',
      usernameLabel: 'பயனர் பெயர் அல்லது மின்னஞ்சல்',
      passwordLabel: 'கடவுச்சொல்',
      fullNameLabel: 'முழு பெயர்',
      emailLabel: 'மின்னஞ்சல் முகவரி',
      phoneLabel: 'கைபேசி எண்',
      confirmPasswordLabel: 'கடவுச்சொல்லை உறுதிப்படுத்துக',
      signInBtn: 'உள்நுழைக',
      signUpBtn: 'கணக்கை உருவாக்கு',
      twoFactorTitle: 'இரண்டடுக்கு பாதுகாப்பு (2FA)',
      twoFactorSubtitle: 'உங்கள் கைபேசிக்கு அனுப்பப்பட்ட 6 இலக்க குறியீட்டை உள்ளிடவும்.',
      twoFactorPlaceholder: '6 இலக்க OTP',
      verifyBtn: 'சரிபார்க்கவும்',
      noAccount: 'புதியவரா? பதிவு செய்யவும்.',
      alreadyAccount: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்.',
      rememberMe: 'என்னை நினைவில் கொள்',
      privacyConsent: 'தனியுரிமை கொள்கையை ஏற்கிறேன்',
      adminNotice: 'பாதுகாக்கப்பட்ட நகராட்சி நிர்வாக தளம்.',
    },
    dashboard: {
      welcome: 'நல்வரவு',
      citizenTitle: 'குடிமக்கள் சேவை டாஷ்போர்டு',
      adminTitle: 'நகராட்சி நிர்வாக கட்டுப்பாட்டு மையம்',
      myComplaints: 'எனது புகார்கள்',
      newComplaint: 'புதிய புகார் பதிவு',
      inventory: 'நகராட்சி உபகரண பட்டியல்',
      logs: 'கணினி தணிக்கை பதிவுகள்',
      users: 'பதிவுசெய்த குடிமக்கள் பட்டியல்',
      regionalImpact: 'மண்டல செயல்திறன் மற்றும் வளர்ச்சி',
      notifications: 'அறிவிப்புகள்',
      emptyComplaints: 'நீங்கள் இன்னும் எந்த புகாரையும் அளிக்கவில்லை.',
      emptyComplaintsDesc: 'உங்கள் பகுதியில் உள்ள குறைகளை உடனடியாக பதிவு செய்யவும்.',
      respondBtn: 'அதிகாரப்பூர்வ பதில் அனுப்புக',
      updateStatusBtn: 'நிலையை மாற்றுக',
      officialResponse: 'அதிகாரிகளின் அதிகாரப்பூர்வ பதில்',
    },
    chatbot: {
      title: 'சிவிக் உதவியாளர் (AI)',
      subtitle: 'குடிமக்கள் உதவி மற்றும் வழிகாட்டி',
      placeholder: 'பொதுப் பிரச்சனைகள் குறித்து கேளுங்கள்...',
      send: 'அனுப்பு',
      suggest1: 'பள்ளம் குறித்து எவ்வாறு புகார் அளிப்பது?',
      suggest2: 'புகாரின் நிலையை எவ்வாறு அறிவது?',
      suggest3: 'தெருவிளக்கு பழுது சரிசெய்யும் நேரம்',
    },
    map: {
      title: 'புவியியல் வார்டு வரைபடம்',
      subtitle: 'செயலில் உள்ள பிரச்சனைகள் மற்றும் தீர்க்கப்பட்ட பணிகள்',
      filterAll: 'அனைத்தும்',
      filterActive: 'நிலுவையில் உள்ளவை',
      filterResolved: 'தீர்க்கப்பட்டவை',
      zoomIn: 'பெரிதாக்கு',
      zoomOut: 'சிறிதாக்கு',
      selectedLocation: 'தேர்ந்தெடுத்த இடம்',
    },
  },

  // Bengali
  bn: {
    appName: 'সিভিকফিক্স',
    tagline: 'আপনার কণ্ঠস্বর • আমাদের দায়িত্ব • উন্নত সমাজ',
    nav: {
      home: 'হোম',
      howItWorks: 'কীভাবে কাজ করে',
      categories: 'সমস্যার বিভাগসমূহ',
      mapView: 'শহরের মানচিত্র',
      solvedIssues: 'সমাধানকৃত বিষয়',
      reportIssue: 'অভিযোগ দায়ের করুন',
      trackComplaint: 'অভিযোগের অবস্থা জানুন',
      dashboard: 'ড্যাশবোর্ড',
      adminPanel: 'প্রশাসনিক প্যানেল',
      signIn: 'সাইন ইন',
      signUp: 'নিবন্ধন করুন',
      signOut: 'লগ আউট',
    },
    hero: {
      badge: 'ডিজিটাল নাগরিক পরিষেবা ও পরিকাঠামো সমাধান পোর্টাল',
      title: 'আসুন একসাথে আমাদের সমাজকে আরও সুন্দর করি।',
      subtitle:
        'রাস্তার গর্ত, নষ্ট স্ট্রিট লাইট, জঞ্জাল অথবা পানীয় জলের সমস্যা? সিভিকফিক্সে ছবির সাথে অভিযোগ জানান এবং সরাসরি কর্তৃপক্ষের অগ্রগতি পর্যবেক্ষণ করুন।',
      reportBtn: 'সমস্যার রিপোর্ট করুন',
      trackBtn: 'অভিযোগ ট্র্যাক করুন',
      statsTotal: 'মোট অভিযোগ',
      statsInProgress: 'চলমান কাজ',
      statsResolved: 'সমাধানকৃত সমস্যা',
      statsAvgTime: 'গড় সমাধানের সময়',
    },
    categories: {
      title: 'নাগরিক সমস্যার বিভাগ',
      subtitle: 'কোন ধরনের পরিকাঠামো সমস্যার সমাধান প্রয়োজন তা নির্বাচন করুন',
      roads_potholes: 'রাস্তাঘাট ও গর্ত',
      streetlights: 'স্ট্রিট লাইট ও বিদ্যুৎ',
      water_supply: 'জল সরবরাহ ও ফুটো',
      drainage_sewage: 'নিকাশী ও ড্রেনেজ',
      garbage_sanitation: 'আবর্জনা ও পরিচ্ছন্নতা',
      public_infra: 'সরকারি পরিকাঠামো',
      other: 'অন্যান্য নাগরিক সমস্যা',
    },
    status: {
      submitted: 'জমা দেওয়া হয়েছে',
      under_review: 'পর্যালোচনাধীন',
      in_progress: 'কাজ চলছে',
      resolved: 'সমাধান হয়েছে',
      closed: 'বন্ধ করা হয়েছে',
      reopened: 'পুনরায় খোলা হয়েছে',
    },
    severity: {
      low: 'সাধারণ',
      medium: 'মাঝারি',
      high: 'গুরুতর',
      critical: 'জরুরি',
    },
    reportModal: {
      heading: 'নাগরিক সমস্যার বিবরণ দিন',
      subheading: 'কর্তৃপক্ষের কাছে স্পষ্ট বিবরণ এবং ছবির প্রমাণ দিন।',
      titleLabel: 'অভিযোগের শিরোনাম',
      titlePlaceholder: 'যেমন: প্রধান রাস্তার বিপজ্জনক গর্ত',
      categoryLabel: 'বিভাগ',
      severityLabel: 'জরুরিতা',
      descriptionLabel: 'বিস্তারিত বিবরণ',
      descriptionPlaceholder: 'সমস্যা ও সাধারণ মানুষের অসুবিধার কথা বিস্তারিত লিখুন...',
      locationLabel: 'ঠিকানা ও এলাকা',
      locationPlaceholder: 'রাস্তার নাম, ল্যান্ডমার্ক, এলাকা',
      wardLabel: 'ওয়ার্ড / ডিভিশন',
      photoLabel: 'ছবির প্রমাণ',
      photoHelp: 'ক্যামেরা বা গ্যালারি থেকে ছবি আপলোড করুন (সর্বোচ্চ 10MB)',
      submitBtn: 'অভিযোগ জমা দিন',
      submitting: 'জমা হচ্ছে...',
      successTitle: 'অভিযোগ সফলভাবে গৃহীত হয়েছে!',
      successMessage: 'আপনার অভিযোগ পৌরসভা ইঞ্জিনিয়ারিং বিভাগে পাঠানো হয়েছে।',
      refNoLabel: 'অভিযোগ রেফারেন্স নম্বর',
      viewComplaint: 'বিবরণ দেখুন',
    },
    auth: {
      signInTitle: 'অ্যাকাউন্টে প্রবেশ করুন',
      signUpTitle: 'নতুন নাগরিক অ্যাকাউন্ট তৈরি করুন',
      usernameLabel: 'ব্যবহারকারীর নাম বা ইমেল',
      passwordLabel: 'পাসওয়ার্ড',
      fullNameLabel: 'পুরো নাম',
      emailLabel: 'ইমেল ঠিকানা',
      phoneLabel: 'মোবাইল নম্বর',
      confirmPasswordLabel: 'পাসওয়ার্ড নিশ্চিত করুন',
      signInBtn: 'প্রবেশ করুন',
      signUpBtn: 'অ্যাকাউন্ট তৈরি করুন',
      twoFactorTitle: 'দ্বি-পদক্ষেপ যাচাইকরণ (2FA)',
      twoFactorSubtitle: 'আপনার ফোনে প্রেরিত ৬-সংখ্যার কোডটি লিখুন।',
      twoFactorPlaceholder: '৬-সংখ্যার ওটিপি',
      verifyBtn: 'যাচাই করুন',
      noAccount: 'অ্যাকাউন্ট নেই? নিবন্ধন করুন।',
      alreadyAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে? প্রবেশ করুন।',
      rememberMe: 'স্মরণে রাখুন',
      privacyConsent: 'আমি গোপনীয়তা নীতি মেনে নিচ্ছি',
      adminNotice: 'নিরাপদ পৌর প্রশাসনিক পোর্টাল।',
    },
    dashboard: {
      welcome: 'স্বাগতম',
      citizenTitle: 'নাগরিক পরিষেবা ড্যাশবোর্ড',
      adminTitle: 'পৌর প্রশাসন নিয়ন্ত্রণ কক্ষ',
      myComplaints: 'আমার দায়ের করা অভিযোগ',
      newComplaint: 'নতুন অভিযোগ দায়ের করুন',
      inventory: 'পৌর পরিকাঠামো সরঞ্জাম তালিকা',
      logs: 'সিস্টেম নিরীক্ষা লগ',
      users: 'নিবন্ধিত নাগরিক তালিকা',
      regionalImpact: 'আঞ্চলিক অগ্রগতি ও কর্মক্ষমতা',
      notifications: 'বিজ্ঞপ্তি',
      emptyComplaints: 'আপনি এখনও কোন অভিযোগ জমা দেননি।',
      emptyComplaintsDesc: 'আপনার এলাকার কোনো সমস্যা থাকলে আজই জানান।',
      respondBtn: 'সরকারি উত্তর পাঠান',
      updateStatusBtn: 'অবস্থা পরিবর্তন করুন',
      officialResponse: 'কর্তৃপক্ষের সরকারি প্রতিক্রিয়া',
    },
    chatbot: {
      title: 'সিভিক সহকারী (AI)',
      subtitle: 'নাগরিক সহায়তা এবং গাইড',
      placeholder: 'নাগরিক সমস্যা সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করুন...',
      send: 'পাঠান',
      suggest1: 'রাস্তার গর্তের অভিযোগ কীভাবে করব?',
      suggest2: 'অভিযোগের অবস্থা কীভাবে জানব?',
      suggest3: 'স্ট্রিট লাইট মেরামতের সময়সীমা',
    },
    map: {
      title: 'ভৌগোলিক ওয়ার্ড মানচিত্র',
      subtitle: 'চলমান সমস্যা ও সমাধানকৃত কাজের সরাসরি মানচিত্র',
      filterAll: 'সকল',
      filterActive: 'চলমান সমস্যা',
      filterResolved: 'সমাধানকৃত কাজ',
      zoomIn: 'জুম ইন',
      zoomOut: 'জুম আউট',
      selectedLocation: 'নির্বাচিত স্থান',
    },
  },
};
