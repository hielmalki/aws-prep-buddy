import type { Question } from './types.js';

export interface LearnModule {
  slug: string;
  title: string;
  summary: string;
  subTopics: string[];
  topicTags: string[];
  sectionSlugs: string[];
  icon: 'cloud' | 'compute' | 'globe' | 'network' | 'storage' | 'security' | 'monitor' | 'billing' | 'migration' | 'value' | 'pillars' | 'other';
}

export const LEARN_MODULES: LearnModule[] = [
  {
    slug: 'introduction',
    title: 'Introduction to Cloud Computing',
    summary: 'What cloud is, why it matters, and the core service models.',
    subTopics: ['What is cloud computing', 'Benefits of the cloud', 'Cloud service models (IaaS, PaaS, SaaS)'],
    topicTags: [],
    sectionSlugs: ['cloud_computing'],
    icon: 'cloud',
  },
  {
    slug: 'compute',
    title: 'Compute in the Cloud',
    summary: 'Virtual servers, auto-scaling, and load balancing on AWS.',
    subTopics: ['Amazon EC2', 'Auto Scaling', 'Elastic Load Balancing', 'AWS Lambda', 'AWS Fargate'],
    topicTags: ['EC2', 'Compute', 'Lambda'],
    sectionSlugs: ['ec2', 'elb_asg', 'other_compute'],
    icon: 'compute',
  },
  {
    slug: 'global-infrastructure',
    title: 'Global Infrastructure and Reliability',
    summary: 'How AWS spans Regions, AZs, and edge locations worldwide.',
    subTopics: ['Regions and Availability Zones', 'Edge Locations', 'High availability and fault tolerance'],
    topicTags: ['Networking'],
    sectionSlugs: ['global_infrastructure'],
    icon: 'globe',
  },
  {
    slug: 'networking',
    title: 'Networking',
    summary: 'Virtual Private Cloud, subnets, and connectivity to AWS.',
    subTopics: ['Virtual Private Cloud (VPC)', 'Subnets', 'Internet Gateway and routing'],
    topicTags: ['VPC'],
    sectionSlugs: ['vpc'],
    icon: 'network',
  },
  {
    slug: 'storage-databases',
    title: 'Storage and Databases',
    summary: 'Object, block, and file storage plus managed databases.',
    subTopics: ['Amazon S3', 'EBS and EFS', 'Amazon RDS', 'Amazon DynamoDB'],
    topicTags: ['S3', 'Storage', 'RDS', 'Databases'],
    sectionSlugs: ['s3', 'ec2_storage', 'databases'],
    icon: 'storage',
  },
  {
    slug: 'security',
    title: 'Security',
    summary: 'Shared responsibility, identity management, and compliance.',
    subTopics: ['Shared Responsibility Model', 'Identity and Access Management (IAM)', 'Security best practices'],
    topicTags: ['IAM', 'Security'],
    sectionSlugs: ['iam', 'security_compliance', 'advanced_identity'],
    icon: 'security',
  },
  {
    slug: 'monitoring',
    title: 'Monitoring and Analytics',
    summary: 'Observe your infrastructure with CloudWatch, CloudTrail, and more.',
    subTopics: ['Amazon CloudWatch', 'AWS CloudTrail', 'Trusted Advisor'],
    topicTags: ['CloudWatch', 'Support'],
    sectionSlugs: ['cloud_monitoring'],
    icon: 'monitor',
  },
  {
    slug: 'pricing-support',
    title: 'Pricing and Support',
    summary: 'Cost models, the Free Tier, and AWS support plans.',
    subTopics: ['Pricing models (On-Demand, Reserved, Spot)', 'AWS Free Tier', 'Support plans'],
    topicTags: ['Billing'],
    sectionSlugs: ['account_management_billing_support'],
    icon: 'billing',
  },
  {
    slug: 'migration-innovation',
    title: 'Migration and Innovation',
    summary: 'Migration strategies, Snow Family, and cloud innovation.',
    subTopics: ['Migration strategies (lift-and-shift)', 'AWS Snow Family', 'Innovation with cloud services'],
    topicTags: ['Migration'],
    sectionSlugs: ['deploying'],
    icon: 'migration',
  },
  {
    slug: 'cloud-value',
    title: 'AWS Cloud Value Proposition',
    summary: 'Business value, cost optimization, and organizational advantages.',
    subTopics: ['Business value of AWS', 'Cost optimization', 'Advantages for organizations'],
    topicTags: [],
    sectionSlugs: ['architecting_and_ecosystem'],
    icon: 'value',
  },
  {
    slug: 'well-architected',
    title: 'Well-Architected Framework',
    summary: 'The six pillars for building reliable, efficient cloud systems.',
    subTopics: ['Operational Excellence', 'Security', 'Reliability', 'Performance Efficiency', 'Cost Optimization', 'Sustainability'],
    topicTags: [],
    sectionSlugs: [],
    icon: 'pillars',
  },
  {
    slug: 'other',
    title: 'Other Topics',
    summary: 'Questions that span multiple or unlisted service areas.',
    subTopics: [],
    topicTags: [],
    sectionSlugs: [],
    icon: 'other',
  },
];

const MODULE_PRIORITY = LEARN_MODULES.filter(m => m.slug !== 'other' && m.topicTags.length > 0);
const OTHER_MODULE = LEARN_MODULES.find(m => m.slug === 'other')!;

export function moduleForQuestion(question: Question): LearnModule {
  for (const mod of MODULE_PRIORITY) {
    for (const tag of mod.topicTags) {
      if (question.topics.includes(tag)) return mod;
    }
  }
  return OTHER_MODULE;
}

export function groupQuestionsByModule(questions: Question[]): Map<string, { module: LearnModule; questions: Question[] }> {
  const map = new Map<string, { module: LearnModule; questions: Question[] }>();
  for (const q of questions) {
    const mod = moduleForQuestion(q);
    if (!map.has(mod.slug)) map.set(mod.slug, { module: mod, questions: [] });
    map.get(mod.slug)!.questions.push(q);
  }
  // Return in LEARN_MODULES priority order
  const ordered = new Map<string, { module: LearnModule; questions: Question[] }>();
  for (const mod of LEARN_MODULES) {
    if (map.has(mod.slug)) ordered.set(mod.slug, map.get(mod.slug)!);
  }
  return ordered;
}
