import type { Option } from './types.js';

const KEYWORDS: Record<string, string[]> = {
  EC2:        ['ec2', 'elastic compute', 'instance type', 'ami'],
  S3:         ['s3', 'simple storage', 'bucket', 'object storage'],
  IAM:        ['iam', 'identity and access', 'mfa', 'role', 'policy'],
  VPC:        ['vpc', 'subnet', 'security group', 'nacl', 'internet gateway'],
  RDS:        ['rds', 'aurora', 'relational database'],
  Lambda:     ['lambda', 'serverless function'],
  CloudWatch: ['cloudwatch', 'cloudtrail'],
  Billing:    ['billing', 'cost explorer', 'budgets', 'reserved instance', 'savings plan'],
  Support:    ['support plan', 'trusted advisor', 'tam'],
  Security:   ['kms', 'shield', 'waf', 'guardduty', 'inspector', 'macie'],
  Networking: ['route 53', 'cloudfront', 'direct connect', 'api gateway'],
  Compute:    ['lightsail', 'batch', 'fargate', 'ecs', 'eks'],
  Storage:    ['ebs', 'efs', 'fsx', 'glacier', 'storage gateway'],
  Databases:  ['dynamodb', 'redshift', 'documentdb', 'neptune'],
  Migration:  ['snowball', 'dms', 'migration hub'],
};

export function tagTopics(text: string, options: Option[]): string[] {
  const haystack = [text, ...options.map(o => o.text)].join(' ').toLowerCase();
  const matched = new Set<string>();
  for (const [topic, keywords] of Object.entries(KEYWORDS)) {
    for (const kw of keywords) {
      if (haystack.includes(kw)) {
        matched.add(topic);
        break;
      }
    }
  }
  return [...matched].sort();
}
