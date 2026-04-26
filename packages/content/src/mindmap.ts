export interface MindmapService {
  abbr: string;
  fullName?: string;
  description?: string;
}

export interface MindmapCluster {
  id: string;
  label: string;
  hue: number;
  domain?: number;
  moduleSlug?: string;
  services: MindmapService[];
}

export const MINDMAP: MindmapCluster[] = [
  {
    id: 'compute',
    label: 'Compute',
    hue: 32,
    domain: 2,
    moduleSlug: 'compute',
    services: [
      { abbr: 'EC2',       fullName: 'Elastic Compute Cloud',  description: 'Virtuelle Server in der Cloud — minutengenaue Abrechnung, vier Preismodelle.' },
      { abbr: 'Lambda',    fullName: 'AWS Lambda',             description: 'Serverless-Functions — Code läuft ohne Server, Abrechnung pro Request.' },
      { abbr: 'ECS',       fullName: 'Elastic Container Service', description: 'Verwalteter Container-Orchestrator für Docker-Workloads.' },
      { abbr: 'Fargate',   fullName: 'AWS Fargate',            description: 'Serverless Compute für Container — kein Cluster-Management nötig.' },
      { abbr: 'Batch',     fullName: 'AWS Batch',              description: 'Vollständig verwaltete Batch-Verarbeitung in jeder Skalierung.' },
      { abbr: 'Lightsail', fullName: 'Amazon Lightsail',       description: 'Einfache virtuelle Server mit festem Preisplan für kleine Projekte.' },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    hue: 200,
    domain: 3,
    moduleSlug: 'storage-databases',
    services: [
      { abbr: 'S3',              fullName: 'Simple Storage Service',   description: 'Object Storage mit hoher Verfügbarkeit und 11 Neunen Dauerhaftigkeit.' },
      { abbr: 'EBS',             fullName: 'Elastic Block Store',       description: 'Block-Speicher für EC2-Instanzen — persistente SSD/HDD-Volumes.' },
      { abbr: 'EFS',             fullName: 'Elastic File System',       description: 'Verwaltetes NFS-Dateisystem — automatisch skalierbar für Linux.' },
      { abbr: 'FSx',             fullName: 'Amazon FSx',                description: 'Vollständig verwaltete Dateisysteme (Windows, Lustre, NetApp).' },
      { abbr: 'Storage Gateway', fullName: 'AWS Storage Gateway',       description: 'Hybride Cloud-Speicherbrücke zwischen On-Premises und S3.' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    hue: 270,
    domain: 3,
    moduleSlug: 'storage-databases',
    services: [
      { abbr: 'RDS',         fullName: 'Relational Database Service', description: 'Verwaltete relationale Datenbanken: MySQL, PostgreSQL, Oracle u.a.' },
      { abbr: 'DynamoDB',    fullName: 'Amazon DynamoDB',             description: 'Vollständig verwaltete NoSQL-Datenbank mit Millisekunden-Latenz.' },
      { abbr: 'Aurora',      fullName: 'Amazon Aurora',               description: 'MySQL/PostgreSQL-kompatible Datenbank — 5× schneller als Standard-MySQL.' },
      { abbr: 'ElastiCache', fullName: 'Amazon ElastiCache',          description: 'In-Memory-Cache (Redis/Memcached) für Echtzeit-Applikationen.' },
    ],
  },
  {
    id: 'networking',
    label: 'Networking',
    hue: 145,
    domain: 4,
    moduleSlug: 'networking',
    services: [
      { abbr: 'VPC',            fullName: 'Virtual Private Cloud',     description: 'Isoliertes virtuelles Netzwerk in AWS mit Subnetzen und Routing.' },
      { abbr: 'Route 53',       fullName: 'Amazon Route 53',           description: 'Hoch verfügbarer DNS-Service mit Routing-Richtlinien.' },
      { abbr: 'CloudFront',     fullName: 'Amazon CloudFront',         description: 'Globales CDN — statische und dynamische Inhalte schnell ausliefern.' },
      { abbr: 'API Gateway',    fullName: 'Amazon API Gateway',        description: 'Vollständig verwaltete REST/WebSocket-API-Erstellung und -Hosting.' },
      { abbr: 'Direct Connect', fullName: 'AWS Direct Connect',        description: 'Dedizierte Netzwerkverbindung vom Rechenzentrum zu AWS.' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    hue: 0,
    domain: 1,
    moduleSlug: 'security',
    services: [
      { abbr: 'IAM',       fullName: 'Identity and Access Management', description: 'Benutzer, Rollen und Richtlinien für sicheren Ressourcenzugriff.' },
      { abbr: 'KMS',       fullName: 'Key Management Service',         description: 'Verwalteter Dienst zum Erstellen und Verwalten kryptografischer Schlüssel.' },
      { abbr: 'Cognito',   fullName: 'Amazon Cognito',                 description: 'User-Pools und Identity-Pools für App-Authentifizierung.' },
      { abbr: 'WAF',       fullName: 'AWS WAF',                        description: 'Web Application Firewall — schützt vor SQL-Injection und XSS.' },
      { abbr: 'Shield',    fullName: 'AWS Shield',                     description: 'Verwalteter DDoS-Schutz — Standard kostenlos, Advanced kostenpflichtig.' },
      { abbr: 'GuardDuty', fullName: 'Amazon GuardDuty',               description: 'Intelligente Bedrohungserkennung mit Machine Learning.' },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    hue: 220,
    domain: 5,
    moduleSlug: 'monitoring',
    services: [
      { abbr: 'CloudWatch', fullName: 'Amazon CloudWatch',  description: 'Metriken, Logs und Alarme für AWS-Ressourcen und Anwendungen.' },
      { abbr: 'X-Ray',      fullName: 'AWS X-Ray',          description: 'Distributed Tracing für Microservices und serverlose Anwendungen.' },
      { abbr: 'CloudTrail', fullName: 'AWS CloudTrail',     description: 'Audit-Log aller API-Aufrufe und Kontoaktivitäten in AWS.' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    hue: 310,
    domain: 6,
    moduleSlug: undefined,
    services: [
      { abbr: 'CodeCommit',  fullName: 'AWS CodeCommit',  description: 'Vollständig verwalteter Git-basierter Quellcode-Repository-Service.' },
      { abbr: 'CodeBuild',   fullName: 'AWS CodeBuild',   description: 'Kontinuierlicher Build-Service — kompiliert, testet und paketiert.' },
      { abbr: 'CodeDeploy',  fullName: 'AWS CodeDeploy',  description: 'Automatisierte Bereitstellung auf EC2, Lambda und On-Premises.' },
      { abbr: 'CodePipeline',fullName: 'AWS CodePipeline',description: 'CI/CD-Pipeline für schnelle und zuverlässige Anwendungsaktualisierungen.' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    hue: 175,
    domain: undefined,
    moduleSlug: undefined,
    services: [
      { abbr: 'Athena',  fullName: 'Amazon Athena',           description: 'SQL-Abfragen direkt auf S3-Daten — serverlos, bezahle pro Abfrage.' },
      { abbr: 'Kinesis', fullName: 'Amazon Kinesis',          description: 'Echtzeit-Datenstreaming für Logs, Klicks und IoT-Ereignisse.' },
      { abbr: 'Redshift',fullName: 'Amazon Redshift',         description: 'Petabyte-fähiges Data Warehouse für analytische Abfragen.' },
      { abbr: 'Glue',    fullName: 'AWS Glue',                description: 'Serverloser ETL-Service zum Vorbereiten von Daten für Analytics.' },
    ],
  },
  {
    id: 'mlai',
    label: 'AI / ML',
    hue: 50,
    domain: undefined,
    moduleSlug: undefined,
    services: [
      { abbr: 'SageMaker',   fullName: 'Amazon SageMaker',  description: 'Vollständig verwaltete ML-Plattform — von Training bis Deployment.' },
      { abbr: 'Rekognition', fullName: 'Amazon Rekognition',description: 'Bild- und Videoanalyse mit Deep Learning — Gesichter, Objekte, Text.' },
      { abbr: 'Polly',       fullName: 'Amazon Polly',       description: 'Text-to-Speech-Service mit natürlichen Stimmen in vielen Sprachen.' },
      { abbr: 'Translate',   fullName: 'Amazon Translate',   description: 'Neuronale maschinelle Übersetzung für über 75 Sprachen.' },
    ],
  },
  {
    id: 'app',
    label: 'App Integ.',
    hue: 100,
    domain: undefined,
    moduleSlug: undefined,
    services: [
      { abbr: 'SNS',            fullName: 'Simple Notification Service', description: 'Pub/Sub-Messaging — sendet Benachrichtigungen an viele Empfänger.' },
      { abbr: 'SQS',            fullName: 'Simple Queue Service',        description: 'Vollständig verwaltete Message Queue für entkoppelte Microservices.' },
      { abbr: 'EventBridge',    fullName: 'Amazon EventBridge',          description: 'Serverloser Event-Bus für ereignisgesteuerte Architekturen.' },
      { abbr: 'Step Functions', fullName: 'AWS Step Functions',          description: 'Visueller Workflow-Orchestrator für verteilte Anwendungen.' },
    ],
  },
  {
    id: 'mgmt',
    label: 'Management',
    hue: 250,
    domain: undefined,
    moduleSlug: 'pricing-support',
    services: [
      { abbr: 'CloudFormation',  fullName: 'AWS CloudFormation',      description: 'Infrastructure as Code — Ressourcen als YAML/JSON-Template definieren.' },
      { abbr: 'Organizations',   fullName: 'AWS Organizations',       description: 'Zentralisierte Verwaltung mehrerer AWS-Konten und Abrechnungen.' },
      { abbr: 'Trusted Advisor', fullName: 'AWS Trusted Advisor',     description: 'Empfehlungen für Kosten, Performance, Sicherheit und Ausfallsicherheit.' },
      { abbr: 'Control Tower',   fullName: 'AWS Control Tower',       description: 'Automatisierte Landing Zone für sichere Multi-Account-Umgebungen.' },
    ],
  },
];
