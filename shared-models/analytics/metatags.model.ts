import { LegalBusinessNames, ShorthandBusinessNames } from '../../shared-models/forms-and-components/legal-vars.model';
import { PublicIconPaths } from '../../shared-models/routes-and-paths/icon-paths.model';
import { PublicImagePaths } from '../../shared-models/routes-and-paths/image-paths.model';

export const metaTagDefaults = {
  explearningPublic: {
    metaTagDefaultTitle: 'Explearning - Supercharge Your Social Skills',
    // tslint:disable-next-line:max-line-length
    metaTagDefaultDescription: 'A richer life begins with better communication. Equip yourself for personal and professional success by improving your speaking skills and communication skills using our research-backed techniques. We teach you public speaking techniques, interview strategies, negotiation tactics, and much more.',
    metaTagAuthor: LegalBusinessNames.EXPLEARNING,
    // tslint:disable-next-line:max-line-length
    metaTagDefaultKeywords: 'social skills, make friends, build trust, be authentic, what is effective communication, what is communication skills, effective communication techniques, public speaking techniques, interview strategies, mary daphne root',
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
};

export const metaTagsContentPages = {
  explearningPublic: {
    aboutMetaTitle: `About Us - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    aboutMetaDescription: `Speaking skills and effective communication are at the core of who we are. My goal is to equip you for personal and professional success by improving your speaking skills and communication skills using our research-backed techniques. With an Ed.M from Columbia University, I've been teaching and coaching communications for over ten years.`,
    aboutBodyVideoUrl: `https://youtu.be/X949bB9fqMA`,
    blogMetaTitle: `Blog - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    blogMetaDescription: `On ${metaTagDefaults.explearningPublic.metaTagSiteName}'s blog you have access to our complete library of free lessons on speaking skills and effective communication. From public speaking techniques to interview strategies and negotiation tactics, our goal is to make you the best communicator you can be.`,
    blogPageTitle: `${metaTagDefaults.explearningPublic.metaTagSiteName} Blog`,
    blogPagHeroSubtitle: `Access our complete library of free lessons on speaking skills and effective communication`,
    blogActionMessage: `View Collection`,
    contactMetaTitle: `Contact Us - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    contactMetaDescription: `Get in touch with the ${metaTagDefaults.explearningPublic.metaTagSiteName} team using this contact form. We welcome questions, suggestions, and any thoughtful input. Let us know if there is anything else we can do to help you improve your speaking and communication skills!`,
    contactPageTitle: 'Contact Us',
    contactPageHeroSubtitle: 'Questions, suggestions, and thoughtful input are welcome',
    contactActionMessage: 'Get in Touch',
    homeCapTitleOne: 'Confidence',
    homeCapBodyOne: 'Learn effective communication skills for interviews, public speaking, salary negotiations, and more',
    homeCapIconOnePath: PublicIconPaths.FIST_ICON,
    homeCapTitleTwo: 'Authenticity',
    homeCapBodyTwo: 'Develop authentic speaking skills and project your true self to win the trust of your peers and clients',
    homeCapIconTwoPath: PublicIconPaths.SHIELD_ICON,
    homeCapTitleThree: 'Poise',
    homeCapBodyThree: 'Demonstrate professionalism and competence through better body language and demeanor',
    homeCapIconThreePath: PublicIconPaths.LOTUS_FLOWER_ICON,
    homePageTitle: 'A Richer Life Begins with Better Communication',
    homeActionMessage: 'Learn More',
    privacyPolicyMetaTitle: `Privacy Policy - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    termsAndConditionsMetaTitle: `Terms and Conditions - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    podcastMetaTitle: `Podcast - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    podcastMetaDescription: `Get our lastest communications strategies in audio form from our weekly ${metaTagDefaults.sywPublic.metaTagSiteName} podcast. Available on all the major directories, including Soundlcoud, iTunes, Google Podcast, Spotify, and more.`,
    podcastPageTitle: 'Podcast',
    podcastPageHeroSubtitle: 'Get our lastest communications strategies in audio form',
    podcastActionMessage: 'View Episodes',
    productListMetaTitle: `Products - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    productListMetaDescription: `${metaTagDefaults.explearningPublic.metaTagSiteName} offers a variety of products to help you improve your speaking skills and communication skills. From professional communications coaching to high quality web courses, our goal is to make you the best communicator you can be.`,
    purchaseConfirmationMetaTitle: `Purchase Confirmation - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`,
    serviceListMetaTitle: `Services - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    serviceListMetaDescription: `${metaTagDefaults.explearningPublic.metaTagSiteName} offers a variety of services to help you improve your speaking skills and communication skills. From professional communications coaching to high quality web courses, our goal is to make you the best communicator you can be.`,
    webcourseListMetaTitle: `Web Courses - ${metaTagDefaults.explearningPublic.metaTagSiteName}`,
    // tslint:disable-next-line: max-line-length
    webcourseListMetaDescription: `${metaTagDefaults.explearningPublic.metaTagSiteName} offers interactive, in-depth web courses that are designed to take your communication skills and social skills to a new level.`,
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
};
