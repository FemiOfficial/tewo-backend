import { DataSource, LessThan, MoreThan } from 'typeorm';
import {
  Control,
  ControlCategory,
  Framework,
} from '../src/shared/db/typeorm/entities';
import dataSource from '../typeorm.config';

async function seedControlsCategoriesFrameworks() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Delete existing records to avoid conflicts
    await deleteExistingRecords(dataSource);
    console.log('🗑️  Existing records deleted');

    // Create frameworks first
    const frameworks = await createFrameworks(dataSource);
    console.log('✅ Frameworks created');

    // Create control categories with framework relationships
    const controlCategories = await createControlCategories(
      dataSource,
      frameworks,
    );
    console.log('✅ Control categories created with framework relationships');

    // Create controls
    const controls = await createControls(dataSource, controlCategories);
    console.log('✅ Controls created');

    console.log('🎉 Seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Created ${frameworks.length} frameworks`);
    console.log(`- Created ${controlCategories.length} control categories`);
    console.log(`- Created ${controls.length} controls`);

    frameworks.forEach((framework) => {
      console.log(
        `  - ${framework.name} (${framework.shortCode}) - ${framework.region.join(
          ', ',
        )}`,
      );
    });

    controlCategories.forEach((category) => {
      console.log(
        `  - ${category.name} (${category.frameworks?.length || 0} frameworks)`,
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
  const controlRepository = dataSource.getRepository(Control);
  const categoryRepository = dataSource.getRepository(ControlCategory);
  const frameworkRepository = dataSource.getRepository(Framework);

  // Delete in reverse order to respect foreign key constraints
  await controlRepository.delete({
    createdAt: LessThan(new Date()),
  });
  await categoryRepository.delete({
    createdAt: LessThan(new Date()),
  });
  await frameworkRepository.delete({
    createdAt: LessThan(new Date()),
  });

  console.log('🗑️  Deleted all existing controls, categories, and frameworks');
}

async function createFrameworks(dataSource: DataSource): Promise<Framework[]> {
  const frameworkRepository = dataSource.getRepository(Framework);

  const frameworksData = [
    {
      name: 'ISO 27001',
      shortCode: 'ISO27001',
      region: ['GL'],
    },
    {
      name: 'General Data Protection Regulation',
      shortCode: 'GDPR',
      region: ['EU'],
    },
    {
      name: 'Nigeria Data Protection Regulation',
      shortCode: 'NDPR',
      region: ['NG'],
    },
    {
      name: 'Payment Card Industry Data Security Standard',
      shortCode: 'PCIDSS',
      region: ['GL'],
    },
    {
      name: 'Payment System Service Provider',
      shortCode: 'PSSP',
      region: ['NG'],
    },
    {
      name: 'SOC 2 Type II',
      shortCode: 'SOC2',
      region: ['GL'],
    },
    {
      name: 'NIST Cybersecurity Framework',
      shortCode: 'NIST',
      region: ['US'],
    },
    {
      name: 'COBIT',
      shortCode: 'COBIT',
      region: ['GL'],
    },
    {
      name: 'ITIL',
      shortCode: 'ITIL',
      region: ['GL'],
    },
    {
      name: 'HIPAA',
      shortCode: 'HIPAA',
      region: ['US'],
    },
  ];

  const frameworks = frameworkRepository.create(frameworksData);
  return await frameworkRepository.save(frameworks);
}

async function createControlCategories(
  dataSource: DataSource,
  frameworks: Framework[],
): Promise<ControlCategory[]> {
  const categoryRepository = dataSource.getRepository(ControlCategory);

  // Helper function to find frameworks by short codes
  const findFrameworks = (shortCodes: string[]) =>
    frameworks.filter((fw) => shortCodes.includes(fw.shortCode));

  const categoriesData = [
    {
      name: 'Access Controls',
      frameworks: findFrameworks(['ISO27001', 'PCIDSS', 'SOC2', 'NIST']),
    },
    {
      name: 'Data Privacy',
      frameworks: findFrameworks(['ISO27001', 'GDPR', 'NDPR', 'SOC2', 'HIPAA']),
    },
    {
      name: 'Governance',
      frameworks: findFrameworks([
        'ISO27001',
        'COBIT',
        'NIST',
        'PCIDSS',
        'SOC2',
      ]),
    },
    {
      name: 'Information Management',
      frameworks: findFrameworks([
        'ISO27001',
        'GDPR',
        'NDPR',
        'PCIDSS',
        'SOC2',
        'ITIL',
      ]),
    },
    {
      name: 'IT & Operational Security',
      frameworks: findFrameworks([
        'ISO27001',
        'PCIDSS',
        'NIST',
        'SOC2',
        'ITIL',
      ]),
    },
    {
      name: 'Risk Management',
      frameworks: findFrameworks([
        'ISO27001',
        'PCIDSS',
        'SOC2',
        'COBIT',
        'ITIL',
      ]),
    },
    {
      name: 'Security & Incidents',
      frameworks: findFrameworks(['ISO27001', 'NIST', 'PCIDSS', 'SOC2']),
    },
  ];

  const categories = categoryRepository.create(categoriesData);
  return await categoryRepository.save(categories);
}

async function createControls(
  dataSource: DataSource,
  categories: ControlCategory[],
): Promise<Control[]> {
  const controlRepository = dataSource.getRepository(Control);

  // Helper function to find category by name
  const findCategory = (name: string) =>
    categories.find((cat) => cat.name === name);

  const controlsData = [
    // Access Controls
    {
      title: 'User Access Management',
      description:
        'Establish and maintain user access management processes to ensure appropriate access to systems and data.',
      categoryId: findCategory('Access Controls')?.id,
      controlIdString: 'AC-01',
    },
    {
      title: 'Privileged Access Control',
      description:
        'Implement controls to manage and monitor privileged access to critical systems and data.',
      categoryId: findCategory('Access Controls')?.id,
      controlIdString: 'AC-02',
    },
    {
      title: 'Multi-Factor Authentication',
      description:
        'Implement multi-factor authentication for all user accounts accessing sensitive systems.',
      categoryId: findCategory('Access Controls')?.id,
      controlIdString: 'AC-03',
    },

    // Data Privacy
    {
      title: 'Data Classification',
      description:
        'Establish data classification framework to categorize data based on sensitivity and business value.',
      categoryId: findCategory('Data Privacy')?.id,
      controlIdString: 'DP-01',
    },
    {
      title: 'Data Retention Policy',
      description:
        'Implement data retention policies and procedures to ensure compliance with regulatory requirements.',
      categoryId: findCategory('Data Privacy')?.id,
      controlIdString: 'DP-02',
    },
    {
      title: 'Data Subject Rights',
      description:
        'Establish processes to handle data subject rights requests including access, rectification, and deletion.',
      categoryId: findCategory('Data Privacy')?.id,
      controlIdString: 'DP-03',
    },

    // Governance
    {
      title: 'Information Security Policy',
      description:
        'Develop and maintain comprehensive information security policies and procedures.',
      categoryId: findCategory('Governance')?.id,
      controlIdString: 'GV-01',
    },
    {
      title: 'Risk Assessment Framework',
      description:
        'Establish risk assessment methodology and conduct regular risk assessments.',
      categoryId: findCategory('Governance')?.id,
      controlIdString: 'GV-02',
    },
    {
      title: 'Compliance Monitoring',
      description:
        'Implement processes to monitor and ensure compliance with applicable regulations and standards.',
      categoryId: findCategory('Governance')?.id,
      controlIdString: 'GV-03',
    },

    // Information Management
    {
      title: 'Data Inventory and Mapping',
      description:
        'Maintain comprehensive inventory of data assets and their locations across the organization.',
      categoryId: findCategory('Information Management')?.id,
      controlIdString: 'IM-01',
    },
    {
      title: 'Data Backup and Recovery',
      description:
        'Implement robust data backup and recovery procedures to ensure business continuity.',
      categoryId: findCategory('Information Management')?.id,
      controlIdString: 'IM-02',
    },
    {
      title: 'Data Encryption',
      description:
        'Implement encryption for data at rest and in transit to protect sensitive information.',
      categoryId: findCategory('Information Management')?.id,
      controlIdString: 'IM-03',
    },

    // IT & Operational Security
    {
      title: 'Vulnerability Management',
      description:
        'Establish vulnerability management program to identify, assess, and remediate security vulnerabilities.',
      categoryId: findCategory('IT & Operational Security')?.id,
      controlIdString: 'IT-01',
    },
    {
      title: 'Patch Management',
      description:
        'Implement systematic patch management process to keep systems updated and secure.',
      categoryId: findCategory('IT & Operational Security')?.id,
      controlIdString: 'IT-02',
    },
    {
      title: 'Network Security',
      description:
        'Implement network security controls including firewalls, segmentation, and monitoring.',
      categoryId: findCategory('IT & Operational Security')?.id,
      controlIdString: 'IT-03',
    },

    // Risk Management
    {
      title: 'Third-Party Risk Management',
      description:
        'Establish processes to assess and manage risks associated with third-party vendors and partners.',
      categoryId: findCategory('Risk Management')?.id,
      controlIdString: 'RM-01',
    },
    {
      title: 'Business Continuity Planning',
      description:
        'Develop and maintain business continuity and disaster recovery plans.',
      categoryId: findCategory('Risk Management')?.id,
      controlIdString: 'RM-02',
    },
    {
      title: 'Incident Response Planning',
      description:
        'Establish incident response procedures and team to handle security incidents effectively.',
      categoryId: findCategory('Risk Management')?.id,
      controlIdString: 'RM-03',
    },

    // Security & Incidents
    {
      title: 'Security Monitoring and Logging',
      description:
        'Implement comprehensive security monitoring and logging to detect and respond to security events.',
      categoryId: findCategory('Security & Incidents')?.id,
      controlIdString: 'SI-01',
    },
    {
      title: 'Security Incident Response',
      description:
        'Establish formal incident response procedures and escalation processes.',
      categoryId: findCategory('Security & Incidents')?.id,
      controlIdString: 'SI-02',
    },
    {
      title: 'Forensic Readiness',
      description:
        'Implement forensic readiness capabilities to support incident investigation and legal requirements.',
      categoryId: findCategory('Security & Incidents')?.id,
      controlIdString: 'SI-03',
    },
  ];

  const controls = controlRepository.create(controlsData);
  return await controlRepository.save(controls);
}

// Run the seeding function
if (require.main === module) {
  seedControlsCategoriesFrameworks()
    .then(() => {
      console.log('🎯 Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

export { seedControlsCategoriesFrameworks };
