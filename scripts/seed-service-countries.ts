import { DataSource } from 'typeorm';
import { ServiceCountry } from '../src/shared/db/typeorm/entities';
import dataSource from '../typeorm.config';

async function seedServiceCountries() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Create service countries
    const serviceCountries = await createServiceCountries(dataSource);
    console.log('✅ Service countries created');

    console.log('🎉 Seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Created ${serviceCountries.length} service countries`);

    serviceCountries.forEach((country) => {
      console.log(
        `  - ${country.name} (${country.code}) - ${country.currency} (${country.currencySymbol})`,
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

async function createServiceCountries(
  dataSource: DataSource,
): Promise<ServiceCountry[]> {
  const serviceCountryRepository = dataSource.getRepository(ServiceCountry);

  const countriesData = [
    {
      name: 'Nigeria',
      code: 'NG',
      currency: 'Nigerian Naira',
      currencyCode: 'NGN',
      currencySymbol: '₦',
      isActive: true,
    },
  ];

  const serviceCountries: ServiceCountry[] = [];

  for (const countryData of countriesData) {
    const existingCountry = await serviceCountryRepository.findOne({
      where: { code: countryData.code },
    });

    if (existingCountry) {
      console.log(
        `⚠️  Country ${countryData.name} (${countryData.code}) already exists, skipping...`,
      );
      serviceCountries.push(existingCountry);
      continue;
    }

    const serviceCountry = serviceCountryRepository.create(countryData);
    const savedCountry = await serviceCountryRepository.save(serviceCountry);
    serviceCountries.push(savedCountry);
    console.log(
      `✅ Created country: ${savedCountry.name} (${savedCountry.code})`,
    );
  }

  return serviceCountries;
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedServiceCountries()
    .then(() => {
      console.log('🎉 Service countries seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Service countries seeding failed:', error);
      process.exit(1);
    });
}

export { seedServiceCountries };
