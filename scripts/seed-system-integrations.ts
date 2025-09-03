import { DataSource, LessThan } from 'typeorm';
import {
  SystemIntegration,
  SystemIntegrationCategory,
} from '../src/shared/db/typeorm/entities';
import dataSource from '../typeorm.config';

async function seedSystemIntegrations() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Delete existing records to avoid conflicts
    await deleteExistingRecords(dataSource);
    console.log('🗑️  Existing records deleted');

    // Create system integrations
    const integrations = await createSystemIntegrations(dataSource);
    console.log('✅ System integrations created');

    console.log('🎉 Seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Created ${integrations.length} system integrations`);

    integrations.forEach((integration) => {
      console.log(
        `  - ${integration.name} (${integration.key}) - ${integration.category}`,
      );
    });
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

async function deleteExistingRecords(dataSource: DataSource) {
  const integrationRepository = dataSource.getRepository(SystemIntegration);

  await integrationRepository.delete({
    createdAt: LessThan(new Date()),
  });

  console.log('🗑️  Deleted all existing system integrations');
}

async function createSystemIntegrations(
  dataSource: DataSource,
): Promise<SystemIntegration[]> {
  const integrationRepository = dataSource.getRepository(SystemIntegration);

  const integrationsData = [
    // Code Repository
    {
      name: 'GitHub',
      key: 'github',
      category: SystemIntegrationCategory.CodeRepository,
      description: 'Git-based code hosting and collaboration platform',
      status: 'active',
    },
    {
      name: 'GitLab',
      key: 'gitlab',
      category: SystemIntegrationCategory.CodeRepository,
      description: 'Complete DevOps platform with Git repository management',
      status: 'active',
    },
    {
      name: 'Bitbucket',
      key: 'bitbucket',
      category: SystemIntegrationCategory.CodeRepository,
      description: 'Git code hosting service for teams and projects',
      status: 'active',
    },
    {
      name: 'Azure DevOps',
      key: 'azure_devops',
      category: SystemIntegrationCategory.CodeRepository,
      description: "Microsoft's integrated development platform",
      status: 'active',
    },

    // CI/CD
    {
      name: 'Jenkins',
      key: 'jenkins',
      category: SystemIntegrationCategory.CI_CD,
      description: 'Open-source automation server for CI/CD pipelines',
      status: 'active',
    },
    {
      name: 'GitHub Actions',
      key: 'github_actions',
      category: SystemIntegrationCategory.CI_CD,
      description: "GitHub's built-in CI/CD automation platform",
      status: 'active',
    },
    {
      name: 'GitLab CI/CD',
      key: 'gitlab_cicd',
      category: SystemIntegrationCategory.CI_CD,
      description: "GitLab's integrated CI/CD pipeline system",
      status: 'active',
    },
    {
      name: 'CircleCI',
      key: 'circleci',
      category: SystemIntegrationCategory.CI_CD,
      description: 'Cloud-based CI/CD platform for software teams',
      status: 'active',
    },

    // Container Registry
    {
      name: 'Docker Hub',
      key: 'docker_hub',
      category: SystemIntegrationCategory.ContainerRegistry,
      description: 'Official Docker image registry and repository',
      status: 'active',
    },
    {
      name: 'Amazon ECR',
      key: 'amazon_ecr',
      category: SystemIntegrationCategory.ContainerRegistry,
      description: 'AWS managed Docker container registry',
      status: 'active',
    },
    {
      name: 'Google Container Registry',
      key: 'gcr',
      category: SystemIntegrationCategory.ContainerRegistry,
      description: 'Google Cloud Platform container registry',
      status: 'active',
    },
    {
      name: 'Azure Container Registry',
      key: 'azure_acr',
      category: SystemIntegrationCategory.ContainerRegistry,
      description: 'Microsoft Azure managed container registry',
      status: 'active',
    },

    // Database
    {
      name: 'PostgreSQL',
      key: 'postgresql',
      category: SystemIntegrationCategory.Database,
      description: 'Advanced open-source relational database',
      status: 'active',
    },
    {
      name: 'MySQL',
      key: 'mysql',
      category: SystemIntegrationCategory.Database,
      description: 'Popular open-source relational database',
      status: 'active',
    },
    {
      name: 'MongoDB',
      key: 'mongodb',
      category: SystemIntegrationCategory.Database,
      description: 'Document-oriented NoSQL database',
      status: 'active',
    },
    {
      name: 'Redis',
      key: 'redis',
      category: SystemIntegrationCategory.Database,
      description: 'In-memory data structure store and cache',
      status: 'active',
    },

    // DevOps
    {
      name: 'Terraform',
      key: 'terraform',
      category: SystemIntegrationCategory.DevOps,
      description: 'Infrastructure as Code tool for cloud resources',
      status: 'active',
    },
    {
      name: 'Ansible',
      key: 'ansible',
      category: SystemIntegrationCategory.DevOps,
      description: 'Configuration management and automation platform',
      status: 'active',
    },
    {
      name: 'Kubernetes',
      key: 'kubernetes',
      category: SystemIntegrationCategory.DevOps,
      description: 'Container orchestration platform',
      status: 'active',
    },
    {
      name: 'Helm',
      key: 'helm',
      category: SystemIntegrationCategory.DevOps,
      description: 'Kubernetes package manager',
      status: 'active',
    },

    // Identity and Access Management
    {
      name: 'Auth0',
      key: 'auth0',
      category: SystemIntegrationCategory.IdentityAndAccessManagement,
      description: 'Identity platform for web and mobile applications',
      status: 'active',
    },
    {
      name: 'Okta',
      key: 'okta',
      category: SystemIntegrationCategory.IdentityAndAccessManagement,
      description: 'Identity and access management platform',
      status: 'active',
    },
    {
      name: 'AWS IAM',
      key: 'aws_iam',
      category: SystemIntegrationCategory.IdentityAndAccessManagement,
      description: 'AWS Identity and Access Management service',
      status: 'active',
    },
    {
      name: 'Azure AD',
      key: 'azure_ad',
      category: SystemIntegrationCategory.IdentityAndAccessManagement,
      description: 'Microsoft Azure Active Directory',
      status: 'active',
    },

    // CRM
    {
      name: 'Salesforce',
      key: 'salesforce',
      category: SystemIntegrationCategory.CRM,
      description: 'Cloud-based CRM platform for sales and customer service',
      status: 'active',
    },
    {
      name: 'HubSpot',
      key: 'hubspot',
      category: SystemIntegrationCategory.CRM,
      description: 'Inbound marketing and CRM platform',
      status: 'active',
    },
    {
      name: 'Pipedrive',
      key: 'pipedrive',
      category: SystemIntegrationCategory.CRM,
      description: 'Sales CRM and pipeline management tool',
      status: 'active',
    },

    // Monitoring
    {
      name: 'Datadog',
      key: 'datadog',
      category: SystemIntegrationCategory.Monitoring,
      description: 'Cloud monitoring and analytics platform',
      status: 'active',
    },
    {
      name: 'New Relic',
      key: 'new_relic',
      category: SystemIntegrationCategory.Monitoring,
      description: 'Application performance monitoring platform',
      status: 'active',
    },
    {
      name: 'Prometheus',
      key: 'prometheus',
      category: SystemIntegrationCategory.Monitoring,
      description: 'Open-source monitoring and alerting toolkit',
      status: 'active',
    },
    {
      name: 'Grafana',
      key: 'grafana',
      category: SystemIntegrationCategory.Monitoring,
      description: 'Open-source analytics and monitoring platform',
      status: 'active',
    },

    // Network
    {
      name: 'Cloudflare',
      key: 'cloudflare',
      category: SystemIntegrationCategory.Network,
      description: 'CDN, DNS, and security services',
      status: 'active',
    },
    {
      name: 'AWS Route 53',
      key: 'aws_route53',
      category: SystemIntegrationCategory.Network,
      description: 'AWS DNS and domain registration service',
      status: 'active',
    },
    {
      name: 'Azure DNS',
      key: 'azure_dns',
      category: SystemIntegrationCategory.Network,
      description: 'Microsoft Azure DNS hosting service',
      status: 'active',
    },

    // Security
    {
      name: 'Snyk',
      key: 'snyk',
      category: SystemIntegrationCategory.Security,
      description: 'Vulnerability scanning and security platform',
      status: 'active',
    },
    {
      name: 'SonarQube',
      key: 'sonarqube',
      category: SystemIntegrationCategory.Security,
      description: 'Code quality and security analysis platform',
      status: 'active',
    },
    {
      name: 'OWASP ZAP',
      key: 'owasp_zap',
      category: SystemIntegrationCategory.Security,
      description: 'Open-source web application security scanner',
      status: 'active',
    },
    {
      name: 'Vault',
      key: 'vault',
      category: SystemIntegrationCategory.Security,
      description: 'HashiCorp secrets management and encryption',
      status: 'active',
    },

    // Storage
    {
      name: 'AWS S3',
      key: 'aws_s3',
      category: SystemIntegrationCategory.Storage,
      description: 'AWS Simple Storage Service for object storage',
      status: 'active',
    },
    {
      name: 'Azure Blob Storage',
      key: 'azure_blob',
      category: SystemIntegrationCategory.Storage,
      description: 'Microsoft Azure object storage service',
      status: 'active',
    },
    {
      name: 'Google Cloud Storage',
      key: 'gcs',
      category: SystemIntegrationCategory.Storage,
      description: 'Google Cloud Platform object storage',
      status: 'active',
    },
    {
      name: 'MinIO',
      key: 'minio',
      category: SystemIntegrationCategory.Storage,
      description: 'High-performance object storage compatible with S3',
      status: 'active',
    },

    // Web Application
    {
      name: 'Vercel',
      key: 'vercel',
      category: SystemIntegrationCategory.WebApplication,
      description: 'Platform for deploying and hosting web applications',
      status: 'active',
    },
    {
      name: 'Netlify',
      key: 'netlify',
      category: SystemIntegrationCategory.WebApplication,
      description: 'Web development platform for static sites and apps',
      status: 'active',
    },
    {
      name: 'Heroku',
      key: 'heroku',
      category: SystemIntegrationCategory.WebApplication,
      description: 'Cloud platform for deploying and managing applications',
      status: 'active',
    },
    {
      name: 'AWS Elastic Beanstalk',
      key: 'aws_eb',
      category: SystemIntegrationCategory.WebApplication,
      description: 'AWS platform for deploying and scaling web applications',
      status: 'active',
    },

    // Email
    {
      name: 'Gmail',
      key: 'gmail',
      category: SystemIntegrationCategory.Email,
      description: 'Google Workspace email service',
      status: 'active',
    },
    {
      name: 'Outlook',
      key: 'outlook',
      category: SystemIntegrationCategory.Email,
      description: 'Microsoft 365 email and calendar service',
      status: 'active',
    },
    {
      name: 'SendGrid',
      key: 'sendgrid',
      category: SystemIntegrationCategory.Email,
      description: 'Email delivery and marketing platform',
      status: 'active',
    },
    {
      name: 'Mailgun',
      key: 'mailgun',
      category: SystemIntegrationCategory.Email,
      description: 'Email API service for developers',
      status: 'active',
    },

    // Chat
    {
      name: 'Slack',
      key: 'slack',
      category: SystemIntegrationCategory.Chat,
      description: 'Team communication and collaboration platform',
      status: 'active',
    },
    {
      name: 'Microsoft Teams',
      key: 'teams',
      category: SystemIntegrationCategory.Chat,
      description: "Microsoft's team collaboration platform",
      status: 'active',
    },
    {
      name: 'Discord',
      key: 'discord',
      category: SystemIntegrationCategory.Chat,
      description: 'Voice, video, and text communication platform',
      status: 'active',
    },
    {
      name: 'Telegram',
      key: 'telegram',
      category: SystemIntegrationCategory.Chat,
      description: 'Cloud-based instant messaging service',
      status: 'active',
    },

    // Document
    {
      name: 'Google Docs',
      key: 'google_docs',
      category: SystemIntegrationCategory.Document,
      description: 'Cloud-based document creation and collaboration',
      status: 'active',
    },
    {
      name: 'Microsoft Word',
      key: 'microsoft_word',
      category: SystemIntegrationCategory.Document,
      description: 'Word processing application from Microsoft Office',
      status: 'active',
    },
    {
      name: 'Notion',
      key: 'notion',
      category: SystemIntegrationCategory.Document,
      description: 'All-in-one workspace for notes and collaboration',
      status: 'active',
    },
    {
      name: 'Confluence',
      key: 'confluence',
      category: SystemIntegrationCategory.Document,
      description: 'Team workspace and knowledge management platform',
      status: 'active',
    },

    // Calendar
    {
      name: 'Google Calendar',
      key: 'google_calendar',
      category: SystemIntegrationCategory.Calendar,
      description: 'Time-management and scheduling calendar service',
      status: 'active',
    },
    {
      name: 'Outlook Calendar',
      key: 'outlook_calendar',
      category: SystemIntegrationCategory.Calendar,
      description: 'Microsoft 365 calendar and scheduling service',
      status: 'active',
    },
    {
      name: 'Calendly',
      key: 'calendly',
      category: SystemIntegrationCategory.Calendar,
      description: 'Online appointment scheduling software',
      status: 'active',
    },
    {
      name: 'Apple Calendar',
      key: 'apple_calendar',
      category: SystemIntegrationCategory.Calendar,
      description: 'Apple ecosystem calendar application',
      status: 'active',
    },

    // Project Management
    {
      name: 'Jira',
      key: 'jira',
      category: SystemIntegrationCategory.ProjectManagement,
      description: 'Project management and issue tracking platform',
      status: 'active',
    },
    {
      name: 'Asana',
      key: 'asana',
      category: SystemIntegrationCategory.ProjectManagement,
      description: 'Work management platform for teams',
      status: 'active',
    },
    {
      name: 'Trello',
      key: 'trello',
      category: SystemIntegrationCategory.ProjectManagement,
      description: 'Visual collaboration tool for organizing projects',
      status: 'active',
    },
    {
      name: 'Monday.com',
      key: 'monday',
      category: SystemIntegrationCategory.ProjectManagement,
      description: 'Work operating system for teams',
      status: 'active',
    },

    // Time Tracking
    {
      name: 'Toggl',
      key: 'toggl',
      category: SystemIntegrationCategory.TimeTracking,
      description: 'Time tracking and productivity tool',
      status: 'active',
    },
    {
      name: 'Harvest',
      key: 'harvest',
      category: SystemIntegrationCategory.TimeTracking,
      description: 'Time tracking and invoicing software',
      status: 'active',
    },
    {
      name: 'RescueTime',
      key: 'rescuetime',
      category: SystemIntegrationCategory.TimeTracking,
      description: 'Automatic time tracking and productivity monitoring',
      status: 'active',
    },
    {
      name: 'Clockify',
      key: 'clockify',
      category: SystemIntegrationCategory.TimeTracking,
      description: 'Free time tracking and timesheet app',
      status: 'active',
    },

    // Billing
    {
      name: 'Stripe',
      key: 'stripe',
      category: SystemIntegrationCategory.Billing,
      description: 'Payment processing platform for internet businesses',
      status: 'active',
    },
    {
      name: 'PayPal',
      key: 'paypal',
      category: SystemIntegrationCategory.Billing,
      description: 'Online payment system and money transfer service',
      status: 'active',
    },
    {
      name: 'Square',
      key: 'square',
      category: SystemIntegrationCategory.Billing,
      description: 'Payment and point-of-sale solutions',
      status: 'active',
    },
    {
      name: 'QuickBooks',
      key: 'quickbooks',
      category: SystemIntegrationCategory.Billing,
      description: 'Accounting and invoicing software',
      status: 'active',
    },

    // Other
    {
      name: 'Zapier',
      key: 'zapier',
      category: SystemIntegrationCategory.Other,
      description: 'Automation platform connecting apps and services',
      status: 'active',
    },
    {
      name: 'IFTTT',
      key: 'ifttt',
      category: SystemIntegrationCategory.Other,
      description:
        'Web-based service to create chains of conditional statements',
      status: 'active',
    },
    {
      name: 'Airtable',
      key: 'airtable',
      category: SystemIntegrationCategory.Other,
      description: 'Low-code platform for building collaborative apps',
      status: 'active',
    },
    {
      name: 'Figma',
      key: 'figma',
      category: SystemIntegrationCategory.Other,
      description: 'Collaborative interface design tool',
      status: 'active',
    },
  ];

  const integrations = integrationRepository.create(integrationsData);
  return await integrationRepository.save(integrations);
}

// Run the seeding function
if (require.main === module) {
  seedSystemIntegrations()
    .then(() => {
      console.log('🎯 Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

export { seedSystemIntegrations };
