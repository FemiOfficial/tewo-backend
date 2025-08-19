import { DataSource } from 'typeorm';
import { Role, Permission, RoleType } from '../src/shared/db/typeorm/entities';
import dataSource from '../typeorm.config';

async function seedRolesAndPermissions() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Create permissions first
    const permissions = await createPermissions(dataSource);
    console.log('✅ Permissions created');

    // Create roles with their permissions
    const roles = await createRoles(dataSource, permissions);
    console.log('✅ Roles created with permissions');

    console.log('🎉 Seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Created ${permissions.length} permissions`);
    console.log(`- Created ${roles.length} roles`);

    roles.forEach((role) => {
      console.log(
        `  - ${role.name}: ${role.permissions?.length || 0} permissions`,
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

async function createPermissions(
  dataSource: DataSource,
): Promise<Permission[]> {
  const permissionRepository = dataSource.getRepository(Permission);

  // Check if permissions already exist
  const existingPermissions = await permissionRepository.find();
  if (existingPermissions.length > 0) {
    console.log('⚠️  Permissions already exist, skipping creation');
    return existingPermissions;
  }

  const permissionsData = [
    // User Management
    {
      name: 'user.create',
      module: 'users',
      keys: ['create'],
      scope: true,
    },
    {
      name: 'user.read',
      module: 'users',
      keys: ['read'],
      scope: true,
    },
    {
      name: 'user.update',
      module: 'users',
      keys: ['update'],
      scope: true,
    },
    {
      name: 'user.delete',
      module: 'users',
      keys: ['delete'],
      scope: true,
    },
    {
      name: 'user.invite',
      module: 'users',
      keys: ['invite'],
      scope: true,
    },

    // Organization Management
    {
      name: 'organization.create',
      module: 'organizations',
      keys: ['create'],
      scope: true,
    },
    {
      name: 'organization.read',
      module: 'organizations',
      keys: ['read'],
      scope: true,
    },
    {
      name: 'organization.update',
      module: 'organizations',
      keys: ['update'],
      scope: true,
    },
    {
      name: 'organization.delete',
      module: 'organizations',
      keys: ['delete'],
      scope: true,
    },

    // Policy Management
    {
      name: 'policy.create',
      module: 'policies',
      keys: ['create'],
      scope: true,
    },
    {
      name: 'policy.read',
      module: 'policies',
      keys: ['read'],
      scope: true,
    },
    {
      name: 'policy.update',
      module: 'policies',
      keys: ['update'],
      scope: true,
    },
    {
      name: 'policy.delete',
      module: 'policies',
      keys: ['delete'],
      scope: true,
    },
    {
      name: 'policy.approve',
      module: 'policies',
      keys: ['approve'],
      scope: true,
    },

    // Audit Management
    {
      name: 'audit.create',
      module: 'audits',
      keys: ['create'],
      scope: true,
    },
    {
      name: 'audit.read',
      module: 'audits',
      keys: ['read'],
      scope: true,
    },
    {
      name: 'audit.update',
      module: 'audits',
      keys: ['update'],
      scope: true,
    },
    {
      name: 'audit.delete',
      module: 'audits',
      keys: ['delete'],
      scope: true,
    },
    {
      name: 'audit.approve',
      module: 'audits',
      keys: ['approve'],
      scope: true,
    },

    // Compliance Management
    {
      name: 'compliance.read',
      module: 'compliance',
      keys: ['read'],
      scope: true,
    },
    {
      name: 'compliance.update',
      module: 'compliance',
      keys: ['update'],
      scope: true,
    },
    {
      name: 'compliance.approve',
      module: 'compliance',
      keys: ['approve'],
      scope: true,
    },

    // System Administration
    {
      name: 'system.settings',
      module: 'system',
      keys: ['read', 'update'],
      scope: true,
    },
    {
      name: 'system.logs',
      module: 'system',
      keys: ['read'],
      scope: true,
    },
  ];

  const permissions = permissionRepository.create(permissionsData);
  return await permissionRepository.save(permissions);
}

async function createRoles(
  dataSource: DataSource,
  permissions: Permission[],
): Promise<Role[]> {
  const roleRepository = dataSource.getRepository(Role);

  // Check if roles already exist
  const existingRoles = await roleRepository.find();
  if (existingRoles.length > 0) {
    console.log('⚠️  Roles already exist, skipping creation');
    return existingRoles;
  }

  // Helper function to find permissions by name
  const findPermissions = (names: string[]) => {
    return permissions.filter((p) => names.includes(p.name));
  };

  const rolesData: Record<string, any>[] = [
    {
      name: 'owner',
      type: RoleType.DEFAULT,
      description: 'Full system access with ownership privileges',
      isActive: true,
      permissions: findPermissions([
        'user.create',
        'user.read',
        'user.update',
        'user.delete',
        'user.invite',
        'organization.create',
        'organization.read',
        'organization.update',
        'organization.delete',
        'policy.create',
        'policy.read',
        'policy.update',
        'policy.delete',
        'policy.approve',
        'audit.create',
        'audit.read',
        'audit.update',
        'audit.delete',
        'audit.approve',
        'compliance.read',
        'compliance.update',
        'compliance.approve',
        'system.settings',
        'system.logs',
      ]),
    },
    {
      name: 'admin',
      type: RoleType.DEFAULT,
      description: 'Administrative access with management privileges',
      isActive: true,
      permissions: findPermissions([
        'user.create',
        'user.read',
        'user.update',
        'user.invite',
        'organization.read',
        'organization.update',
        'policy.create',
        'policy.read',
        'policy.update',
        'policy.approve',
        'audit.create',
        'audit.read',
        'audit.update',
        'audit.approve',
        'compliance.read',
        'compliance.update',
        'compliance.approve',
        'system.logs',
      ]),
    },
    {
      name: 'support',
      type: RoleType.DEFAULT,
      description: 'Support access with limited management privileges',
      isActive: true,
      permissions: findPermissions([
        'user.read',
        'user.update',
        'organization.read',
        'policy.read',
        'policy.update',
        'audit.read',
        'audit.update',
        'compliance.read',
        'compliance.update',
      ]),
    },
    {
      name: 'engineer',
      type: RoleType.DEFAULT,
      description: 'Technical access for system operations',
      isActive: true,
      permissions: findPermissions([
        'user.read',
        'organization.read',
        'policy.read',
        'audit.read',
        'audit.create',
        'compliance.read',
        'system.logs',
      ]),
    },
  ];

  const roles = roleRepository.create(rolesData);
  return await roleRepository.save(roles);
}

// Run the seeding function
if (require.main === module) {
  seedRolesAndPermissions()
    .then(() => {
      console.log('🎯 Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

export { seedRolesAndPermissions };
