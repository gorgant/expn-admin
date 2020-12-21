import { LegalBusinessNames, ShorthandBusinessNames } from '../../shared-models/forms-and-components/legal-vars.model';
import { PublicIconPaths } from '../../shared-models/routes-and-paths/icon-paths.model';
import { PublicImagePaths } from '../../shared-models/routes-and-paths/image-paths.model';

export const metaTagDefaults = {
  explearningPublic: {
    metaTagDefaultTitle: 'Explearning - Build Stronger Social Connections',
    // tslint:disable-next-line:max-line-length
    metaTagDefaultDescription: 'A richer life begins with stronger social connections. Our job is to supercharge your social interactions with your friends, colleagues, and clients using our research-backed techniques.',
    metaTagAuthor: LegalBusinessNames.EXPLEARNING,
    // tslint:disable-next-line:max-line-length
    metaTagDefaultKeywords: 'social connections, social skills, mental fortitude, be more confident, make friends, build trust, be authentic, effective communication',
    metaTagSiteName: ShorthandBusinessNames.EXPLEARNING,
    metaTagFbAppId: '2401296806861214',
    metaTagTwitterHandle: '@ExplearningCo',
    metaTagTwitterCardType: 'summary_large_image',
    metaTagDefaultImage: PublicImagePaths.LINK_SHARE_IMAGE,
    metaTagCachedHtml: 'cachedHtml',
    metaTagIsBot: 'isBot',
  },
  maryDaphnePublic: {
    metaTagDefaultTitle: 'Mary Daphne - Equip Yourself For Opportunity',
    // tslint:disable-next-line:max-line-length
    metaTagDefaultDescription: 'Welcome to my blog where we discuss health, fitness, travel, and personal growth. This is a place for me to share what I love and hopefully inspire people along the way.',
    metaTagAuthor: LegalBusinessNames.MARY_DAPHNE,
    metaTagDefaultKeywords: 'mary daphne, health, cooking, lifestyle, self improvement, fitness, travel, personal growth',
    metaTagSiteName: ShorthandBusinessNames.MARY_DAPHNE,
    metaTagFbAppId: '2361383644073374',
    metaTagTwitterHandle: '@MaryDaphne',
    metaTagTwitterCardType: 'summary_large_image',
    metaTagDefaultImage: PublicImagePaths.LINK_SHARE_IMAGE,
    metaTagCachedHtml: 'cachedHtml',
    metaTagIsBot: 'isBot'
  },
  sywPublic: {
    metaTagDefaultTitle: 'Stake Your Wealth - Seize Control of Your Finances and Start Building Wealth',
    // tslint:disable-next-line:max-line-length
    metaTagDefaultDescription: 'Simple, common sense strategies for building your wealth. We dig into topics ranging from personal finance, to financial independence, to investing in, and building, profitable businesses.',
    metaTagAuthor: LegalBusinessNames.SYW,
    // tslint:disable-next-line: max-line-length
    metaTagDefaultKeywords: 'wealth building, build wealth, personal finance, investing, financial independence, save money, how to invest, early retirement, stake your wealth, greg charles',
    metaTagSiteName: ShorthandBusinessNames.SYW,
    metaTagFbAppId: '1662210007287036',
    metaTagTwitterHandle: '@StakeYourWealth',
    metaTagTwitterCardType: 'summary_large_image',
    metaTagDefaultImage: PublicImagePaths.LINK_SHARE_IMAGE,
    metaTagCachedHtml: 'cachedHtml',
    metaTagIsBot: 'isBot'
  },
  advePublic: {
    metaTagDefaultTitle: 'Advanced English - Speak English Fluently and Confidently',
    // tslint:disable-next-line:max-line-length
    metaTagDefaultDescription: 'Learn to speak English fluently and confidently. At Advanced English, we teach English fluency by immersing our students in real-world English conversations and scenarios. Alongside the language, we teach American English culture and norms.',
    metaTagAuthor: LegalBusinessNames.ADVE,
    // tslint:disable-next-line: max-line-length
    metaTagDefaultKeywords: 'speak fluent english, english fluency, speak confident english, speak english fluently, speak english confidently, advanced english',
    metaTagSiteName: ShorthandBusinessNames.ADVE,
    metaTagFbAppId: '1273297499707553',
    metaTagTwitterHandle: '@Advanc3dEnglish',
    metaTagTwitterCardType: 'summary_large_image',
    metaTagDefaultImage: PublicImagePaths.LINK_SHARE_IMAGE,
    metaTagCachedHtml: 'cachedHtml',
    metaTagIsBot: 'isBot'
  },
};

export const metaTagsContentPages = {
  explearningPublic: {
    aboutMetaTitle: `About Us - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    aboutMetaDescription: `Stronger social connections are at the core of who we are. Our job is to supercharge your social interactions with your friends, colleagues, and clients using our research-backed techniques.`,
    aboutBodyVideoUrl: `https://youtu.be/_onRdMrhzmw`,
    blogMetaTitle: `Blog - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    blogMetaDescription: `On ${metaTagDefaults.explearningPublic.metaTagSiteName}'s blog you have access to our complete library of free lessons on building stronger social connections. From confident communication, to building rapport, to asserting yourself in public, our goal is to supercharge your social interactions with your friends, colleagues, and clients.`,
    blogPageTitle: `${metaTagDefaults.explearningPublic.metaTagSiteName} Blog`,
    blogPagHeroSubtitle: `Access our complete library of free lessons on building stronger social connections`,
    blogActionMessage: `View Collection`,
    contactMetaTitle: `Contact Us - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    contactMetaDescription: `Get in touch with the ${metaTagDefaults.explearningPublic.metaTagSiteName} team using this contact form. We welcome questions, suggestions, and any thoughtful input. Let us know if there is anything else we can do to help you strengthen your social connections!`,
    contactPageTitle: 'Contact Us',
    contactPageHeroSubtitle: 'Questions, suggestions, and thoughtful input are welcome',
    contactActionMessage: 'Get in Touch',
    homeCapTitleOne: 'Confidence',
    homeCapBodyOne: 'Cultivate your mental fortitude for stronger social connections with the people who matter most',
    homeCapIconOnePath: PublicIconPaths.FIST_ICON,
    homeCapTitleTwo: 'Authenticity',
    homeCapBodyTwo: 'Project your unique and authentic self to win the trust of your friends, colleagues, and clients',
    homeCapIconTwoPath: PublicIconPaths.SHIELD_ICON,
    homeCapTitleThree: 'Poise',
    homeCapBodyThree: 'Assert yourself in public and communicate with clarity and grace in any social context',
    homeCapIconThreePath: PublicIconPaths.LOTUS_FLOWER_ICON,
    homePageTitle: 'A Richer Life Begins with Stronger Social Connections',
    homeActionMessage: 'Learn More',
    privacyPolicyMetaTitle: `Privacy Policy - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    termsAndConditionsMetaTitle: `Terms and Conditions - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    podcastMetaTitle: `Podcast - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    podcastMetaDescription: `Get our lastest social skills strategies in audio form from our weekly ${metaTagDefaults.sywPublic.metaTagSiteName} podcast. Available on all the major directories, including Soundlcoud, iTunes, Google Podcast, Spotify, and more.`,
    podcastPageTitle: 'Podcast',
    podcastPageHeroSubtitle: 'Get our lastest social skills strategies in audio form',
    podcastActionMessage: 'View Episodes',
    productListMetaTitle: `Products - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    productListMetaDescription: `${metaTagDefaults.explearningPublic.metaTagSiteName} offers a variety of products to help you improve your social skills and professional interactions. From communications coaching to detailed web courses, our goal is to make you the best communicator you can be.`,
    purchaseConfirmationMetaTitle: `Purchase Confirmation - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    serviceListMetaTitle: `Services - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    serviceListMetaDescription: `${metaTagDefaults.explearningPublic.metaTagSiteName} offers a variety of services to help you improve your social skills and professional interactions. From communications coaching to detailed web courses, our goal is to make you the best communicator you can be.`,
    webcourseListMetaTitle: `Web Courses - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    webcourseListMetaDescription: `${metaTagDefaults.explearningPublic.metaTagSiteName} offers interactive, in-depth web courses that are designed to take your social skills and professional communications to a new level.`,
    downloadPromoTitle: `Afraid of Small Talk?`,
    downloadPromoDescription: `Sign up to get our five foolproof strategies for mastering small talk.`,
    downloadPromoDeclineButton: `Nah, I'm already a small talk pro.`,
    subscribeBoxTitle: `Don't miss out`,
    subscribeBoxDescription: `Sign up for the latest communication techniques and special offers.`,
    waitListBoxDescription: `Sign up for early bird prices on this webcourse along with our latest communication techniques.`,
  },
  maryDaphnePublic: {
    aboutMetaTitle: `About Us - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    aboutMetaDescription: `Our mission at ${metaTagDefaults.maryDaphnePublic.metaTagSiteName} is to expand your sense of opportunity and possibility.`,
    aboutBodyVideoUrl: `https://youtu.be/X949bB9fqMA`,
    blogMetaTitle: `Blog - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    blogMetaDescription: `On ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}'s blog you have access to our complete library of insights and personal development content.`,
    blogPageTitle: `Our Blog`,
    blogPagHeroSubtitle: `Access our complete library of insights and personal development content`,
    blogActionMessage: `View Collection`,
    contactMetaTitle: `Contact Us - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    contactMetaDescription: `Get in touch with the ${metaTagDefaults.maryDaphnePublic.metaTagSiteName} team using this contact form. We welcome questions, suggestions, and any thoughtful input.`,
    contactPageTitle: 'Contact Us',
    contactPageHeroSubtitle: 'Questions, suggestions, and thoughtful input are welcome',
    contactActionMessage: 'Get in Touch',
    homeCapTitleOne: 'Strength',
    homeCapBodyOne: 'Project confidence and poise by leveraging skills and expertise you have built from the ground up',
    homeCapIconOnePath: PublicIconPaths.FIST_ICON,
    homeCapTitleTwo: 'Authority',
    homeCapBodyTwo: 'Develop a deeper understanding of yourself and how people see you to win the trust of your peers and clients',
    homeCapIconTwoPath: PublicIconPaths.SHIELD_ICON,
    homeCapTitleThree: 'Intuition',
    homeCapBodyThree: 'Deploy battle-tested strategies to overcome challenges and obstacles in unfamiliar contexts',
    homeCapIconThreePath: PublicIconPaths.LOTUS_FLOWER_ICON,
    homePageTitle: 'Expand your sense of possibility and opportunity',
    homeActionMessage: 'Learn More',
    privacyPolicyMetaTitle: `Privacy Policy - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    termsAndConditionsMetaTitle: `Terms and Conditions - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    productListMetaTitle: `Products - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    productListMetaDescription: `${metaTagDefaults.maryDaphnePublic.metaTagSiteName} offers a variety of services to help you improve your confidence, health, and decision making. From life coaching to high quality web courses, our goal is to equip you for when opportunity comes knocking.`,
    purchaseConfirmationMetaTitle: `Purchase Confirmation - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    serviceListMetaTitle: `Services - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    serviceListMetaDescription: `${metaTagDefaults.maryDaphnePublic.metaTagSiteName} offers a variety of services to help you improve your confidence, health, and decision making. From life coaching to high quality web courses, our goal is to equip you for when opportunity comes knocking.`,
    webcourseListMetaTitle: `Web Courses - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    webcourseListMetaDescription: `${metaTagDefaults.maryDaphnePublic.metaTagSiteName} offers a variety of services to help you improve your confidence, health, and decision making. From life coaching to high quality web courses, our goal is to equip you for when opportunity comes knocking.`,
    downloadPromoTitle: `Afraid of Small Talk?`,
    downloadPromoDescription: `Sign up to get our five foolproof strategies for mastering small talk.`,
    downloadPromoDeclineButton: `Nah, I'm already a small talk pro.`,
    subscribeBoxTitle: `Don't miss out`,
    subscribeBoxDescription: `Sign up for my latest content releases and special offers.`,
    waitListBoxDescription: `Sign up for early bird prices on this webcourse along with our latest content releases.`,
  },
  sywPublic: {
    aboutMetaTitle: `About Us - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    aboutMetaDescription: `There’s a lot of wealth out there. But no one’s going to hand it to you. If you want your piece of the pie, you need to go out and get it. Stake Your Wealth is here to help you do that. We dig into topics ranging from personal finance, to financial independence, to investing in, and building, profitable businesses.`,
    aboutBodyVideoUrl: `https://youtu.be/YQz4bULPVHM`,
    blogMetaTitle: `Blog - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    blogMetaDescription: `On ${metaTagDefaults.sywPublic.metaTagSiteName}'s blog you have access to our complete library of free lessons on building wealth. We dig into topics ranging from personal finance, to financial independence, to investing in, and building, profitable businesses.`,
    blogPageTitle: `${metaTagDefaults.sywPublic.metaTagSiteName} Blog`,
    blogPagHeroSubtitle: `Access to our complete library of free lessons on building wealth`,
    blogActionMessage: `View Collection`,
    contactMetaTitle: `Contact Us - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    contactMetaDescription: `Get in touch with the ${metaTagDefaults.explearningPublic.metaTagSiteName} team using this contact form. We welcome questions, suggestions, and any thoughtful input. Let us know if there is anything else we can do to help you on your wealth building journey!`,
    contactPageTitle: 'Contact Us',
    contactPageHeroSubtitle: 'Questions, suggestions, and thoughtful input are welcome',
    contactActionMessage: 'Get in Touch',
    homeCapTitleOne: 'Empowerment',
    homeCapBodyOne: `Equip yourself to build the wealth you deserve by leveraging your unique skills and assets`,
    homeCapIconOnePath: PublicIconPaths.SHIELD_ICON,
    homeCapTitleTwo: 'Control',
    homeCapBodyTwo: `Build an unshakable foundation of expertise in managing your cash flow and personal finances`,
    homeCapIconTwoPath: PublicIconPaths.FIST_ICON,
    homeCapTitleThree: 'Liberation',
    homeCapBodyThree: `Free yourself from society's outdated definitions of financial independence and financial security`,
    homeCapIconThreePath: PublicIconPaths.LOTUS_FLOWER_ICON,
    homePageTitle: 'Simple, common sense strategies for building wealth',
    homeActionMessage: 'Learn More',
    privacyPolicyMetaTitle: `Privacy Policy - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    termsAndConditionsMetaTitle: `Terms and Conditions - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    podcastMetaTitle: `Podcast - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    podcastMetaDescription: `Get our lastest wealth building strategies in audio form from our weekly ${metaTagDefaults.sywPublic.metaTagSiteName} podcast. Available on all the major directories, including Soundlcoud, iTunes, Google Podcast, Spotify, and more.`,
    podcastPageTitle: 'Podcast',
    podcastPageHeroSubtitle: 'Get our lastest wealth building strategies in audio form',
    podcastActionMessage: 'View Episodes',
    productListMetaTitle: `Products - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    productListMetaDescription: `${metaTagDefaults.sywPublic.metaTagSiteName} offers a variety of products to help you improve your wealth building skills. From personal finance, to financial independence, to investing in, and building, profitable businesses, our goal is to equip you to build the wealth you deserve.`,
    purchaseConfirmationMetaTitle: `Purchase Confirmation - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    serviceListMetaTitle: `Services - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    serviceListMetaDescription: `${metaTagDefaults.sywPublic.metaTagSiteName} offers a variety of products to help you improve your wealth building skills. From personal finance, to financial independence, to investing in, and building, profitable businesses, our goal is to equip you to build the wealth you deserve.`,
    webcourseListMetaTitle: `Web Courses - ${metaTagDefaults.sywPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    webcourseListMetaDescription: `${metaTagDefaults.sywPublic.metaTagSiteName} offers a variety of products to help you improve your wealth building skills. From personal finance, to financial independence, to investing in, and building, profitable businesses, our goal is to equip you to build the wealth you deserve.`,
    downloadPromoTitle: `Is Building Wealth a Priority For You?`,
    downloadPromoDescription: `Get started with our free 3-Step Guide to increasing your net worth.`,
    downloadPromoDeclineButton: `Nah, I'm already a wealth building pro.`,
    subscribeBoxTitle: `Don't miss out`,
    subscribeBoxDescription: `Sign up to get our 3-Step Guide to building wealth.`,
    waitListBoxDescription: `Sign up for early bird prices on this webcourse along with our latest wealth building strategies.`,
  },
  advePublic: {
    aboutMetaTitle: `About Us - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    aboutMetaDescription: `Our mission at Advanced English is to teach you to speak English fluently and confidently. At Advanced English, we teach English fluency by immersing our students in real-world English conversations and scenarios. Alongside the language, we teach American English culture and norms.`,
    aboutBodyVideoUrl: `https://youtu.be/4YWtm8T8gj8`,
    blogMetaTitle: `Blog - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    blogMetaDescription: `On ${metaTagDefaults.advePublic.metaTagSiteName}'s blog you have access to our complete library of free lessons on advanced english. Our goal with our content is for you to learn to speak English fluently and confidently.`,
    blogPageTitle: `${metaTagDefaults.advePublic.metaTagSiteName} Blog`,
    blogPagHeroSubtitle: `Access to our complete library of free lessons on speaking English fluently and confidently`,
    blogActionMessage: `View Collection`,
    contactMetaTitle: `Contact Us - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    contactMetaDescription: `Get in touch with the ${metaTagDefaults.explearningPublic.metaTagSiteName} team using this contact form. We welcome questions, suggestions, and any thoughtful input. Let us know if there is anything else we can do to help you on your English learning journey!`,
    contactPageTitle: 'Contact Us',
    contactPageHeroSubtitle: 'Questions, suggestions, and thoughtful input are welcome',
    contactActionMessage: 'Get in Touch',
    homeCapTitleOne: 'Fluency',
    homeCapBodyOne: `Communicate like a native English speaker in any professional or social context`,
    homeCapIconOnePath: PublicIconPaths.SHIELD_ICON,
    homeCapTitleTwo: 'Confidence',
    homeCapBodyTwo: `Feel confident in your English interactions by understanding American English culture and norms`,
    homeCapIconTwoPath: PublicIconPaths.FIST_ICON,
    homeCapTitleThree: 'Clarity',
    homeCapBodyThree: `Learn to speak in clear, concise English to ensure your voice is heard and understood`,
    homeCapIconThreePath: PublicIconPaths.LOTUS_FLOWER_ICON,
    homePageTitle: 'Learn to speak English fluently and confidently',
    homeActionMessage: 'Learn More',
    privacyPolicyMetaTitle: `Privacy Policy - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    termsAndConditionsMetaTitle: `Terms and Conditions - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    podcastMetaTitle: `Podcast - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    podcastMetaDescription: `Get our lastest advanced English strategies in audio form from our weekly ${metaTagDefaults.advePublic.metaTagSiteName} podcast. Available on all the major directories, including Soundlcoud, iTunes, Google Podcast, Spotify, and more.`,
    podcastPageTitle: 'Podcast',
    podcastPageHeroSubtitle: 'Get our lastest wealth building strategies in audio form',
    podcastActionMessage: 'View Episodes',
    productListMetaTitle: `Products - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    productListMetaDescription: `${metaTagDefaults.advePublic.metaTagSiteName} offers a variety of products to help you improve your advanced English fluency. From conversational English, to business English, to native-sounding English, our goal is to equip you to speak English with fluency and confidence.`,
    purchaseConfirmationMetaTitle: `Purchase Confirmation - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    serviceListMetaTitle: `Services - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    serviceListMetaDescription: `${metaTagDefaults.advePublic.metaTagSiteName} offers a variety of products to help you improve your advanced English fluency. From conversational English, to business English, to native-sounding English, our goal is to equip you to speak English with fluency and confidence.`,
    webcourseListMetaTitle: `Web Courses - ${metaTagDefaults.advePublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    webcourseListMetaDescription: `${metaTagDefaults.advePublic.metaTagSiteName} offers a variety of products to help you improve your advanced English fluency. From conversational English, to business English, to native-sounding English, our goal is to equip you to speak English with fluency and confidence.`,
    downloadPromoTitle: `Want to Speak English Fluently?`,
    downloadPromoDescription: `Get started with our free Small Talk Guide.`,
    downloadPromoDeclineButton: `Nah, I'm already a small-talk pro.`,
    subscribeBoxTitle: `Don't miss out`,
    subscribeBoxDescription: `Sign up to get our free Small Talk Guide.`,
    waitListBoxDescription: `Sign up for early bird prices on this webcourse along with our latest Advanced English strategies.`,
  },
};
