// types/home-settings.ts
export type CloudImage = { url?: string; publicId?: string };

export type HeroSlide = {
  _id?: string;
  title?: string;
  description?: string;
  image?: CloudImage;
};

export type Stats = {
  eventHosted?: string;
  studentsConnected?: string;
  careerChangedPercent?: string;
  certificateEarned?: string;
};

export type TeamMember = {
  _id?: string;
  image?: CloudImage;
  name?: string;
  designation?: string;
};

export type MediaCoverage = {
  _id?: string;
  image?: CloudImage;
  linkUrl?: string;
};

export type HomeVideo = {
  images?: CloudImage[];
  videoUrl?: string;
};

export type HomeSettings = {
  userId: string;
  hero?: { slides?: HeroSlide[] };
  stats?: Stats;
  homeVideo?: HomeVideo;
  teamMembers?: TeamMember[];
  mediaCoverage?: MediaCoverage[];
};

// Public (no userId)
export type PublicHome = Omit<HomeSettings, 'userId'>;
