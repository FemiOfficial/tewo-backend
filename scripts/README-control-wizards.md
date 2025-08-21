# Control Wizard Seed Script

This script seeds the database with comprehensive control wizards for **Data Privacy** and **Access Controls** categories using a clean JSON configuration approach.

## 🎯 What Gets Created

### Data Privacy Wizards

1. **GDPR Compliance & Data Protection**
   - **Type**: System-defined, Hybrid mode
   - **Schedule**: Quarterly assessments
   - **Features**:
     - GDPR compliance assessment form
     - Data protection policy document
     - Multi-stage approval workflow
     - Automated compliance reporting
   - **Frameworks**: GDPR, SOC 2

2. **Data Privacy Impact Assessment (DPIA)**
   - **Type**: Custom, Workflow mode
   - **Schedule**: On-demand (non-recurring)
   - **Features**:
     - DPIA assessment questionnaire
     - Privacy risk evaluation
     - Approval workflow
     - Risk assessment reporting
   - **Frameworks**: SOC 2

### Access Controls Wizards

1. **GitHub Access Management & Review**
   - **Type**: Custom, Automated mode
   - **Schedule**: Quarterly automated reviews
   - **Features**:
     - Automated access review
     - Manual exception handling
     - Access review reporting
     - Integration with GitHub
   - **Frameworks**: SOC 2

2. **Multi-Cloud Access Control & Monitoring**
   - **Type**: Custom, Hybrid mode
   - **Schedule**: Monthly audits
   - **Features**:
     - Cross-cloud access monitoring
     - AWS, Azure, GCP integration
     - Monthly audit forms
     - Parallel approval workflow
   - **Frameworks**: ISO 27001

## 🚀 How to Run

### Prerequisites

Before running this seed script, ensure you have:

1. ✅ **Database connection** configured in `.env`
2. ✅ **Frameworks** seeded (ISO 27001, GDPR, SOC 2, etc.)
3. ✅ **Control Categories** seeded (Data Privacy, Access Controls)
4. ✅ **Users** created in the system
5. ✅ **Organizations** (optional - wizards can be created without organizations)

### Running the Seed

```bash
# Using npm
npm run seed:wizards

# Using yarn
yarn seed:wizards

# Direct execution
npx ts-node -r tsconfig-paths/register scripts/seed-control-wizards.ts
```

## 📊 Expected Output

```
✅ Database connection established
📋 Found existing data:
- Organizations: 1
- Frameworks: 10
- Control Categories: 7
- Users: 1
✅ Data Privacy wizards created
✅ Access Controls wizards created
🎉 Control Wizard seeding completed successfully!

📊 Summary:
- Created 2 Data Privacy wizards
- Created 2 Access Controls wizards
  - Data Privacy: GDPR Compliance & Data Protection
  - Data Privacy: Data Privacy Impact Assessment (DPIA)
  - Access Controls: GitHub Access Management & Review
  - Access Controls: Multi-Cloud Access Control & Monitoring
🔌 Database connection closed
```

## 🔧 Configuration-Based Approach

### JSON Configuration File

The seed script now uses `control-wizard-configs.json` for cleaner, more maintainable wizard definitions:

```json
{
  "dataPrivacyWizards": [
    {
      "title": "GDPR Compliance & Data Protection",
      "description": "Comprehensive GDPR compliance framework...",
      "type": "system_defined",
      "mode": "hybrid",
      "isRecurring": true,
      "requiresApproval": true,
      "requiresEvidence": true,
      "generatesReport": true,
      "schedule": { ... },
      "form": { ... },
      "document": { ... },
      "approval": { ... },
      "report": { ... }
    }
  ]
}
```

### Key Benefits

- **Cleaner Code**: Wizard definitions separated from logic
- **Easy Maintenance**: Modify wizards without touching TypeScript code
- **Reusable**: JSON configs can be used by other tools
- **Version Control**: Track wizard changes in Git
- **Team Collaboration**: Non-developers can modify wizard configs

## 🏢 Organization Handling

### Default vs. Organization-Specific Wizards

- **Default Wizards**: Created without `organizationId` for system-wide use
- **Organization Wizards**: Created with specific `organizationId` for company-specific controls

### Automatic Detection

The script automatically:

- Creates wizards without organizations if no organizations exist
- Associates wizards with organizations if they exist
- Maintains flexibility for both scenarios

## 🔧 Customization

### Adding New Wizards

To add new wizards, simply modify the JSON configuration:

1. **Add to existing category**:

   ```json
   {
     "dataPrivacyWizards": [
       // ... existing wizards
       {
         "title": "New Privacy Wizard",
         "description": "Description...",
         "type": "custom",
         "mode": "manual"
       }
     ]
   }
   ```

2. **Add new category**:
   ```json
   {
     "dataPrivacyWizards": [ ... ],
     "accessControlWizards": [ ... ],
     "newCategoryWizards": [
       {
         "title": "New Category Wizard",
         "description": "Description...",
         "type": "system_defined"
       }
     ]
   }
   ```

### Wizard Configuration

Each wizard includes:

- **Basic Info**: Title, description, type, mode
- **Scheduling**: Recurring intervals, execution methods
- **Forms**: Assessment forms with fields and validation
- **Documents**: Policy documents with version control
- **Approvals**: Multi-stage approval workflows
- **Reports**: Automated reporting with templates

### Field Types Available

- `TEXT` - Single line text input
- `TEXTAREA` - Multi-line text input
- `SELECT` - Dropdown selection
- `MULTI_SELECT` - Multiple choice selection
- `BOOLEAN` - Yes/No checkbox
- `NUMBER` - Numeric input
- `DATE` - Date picker
- `TIME` - Time picker
- `FILE_UPLOAD` - File attachment
- `SIGNATURE` - Digital signature
- `RATING` - Rating scale
- `MATRIX` - Matrix questions

## 🗄️ Database Tables Created

The script creates records in these tables:

- `control_wizards` - Main wizard configurations
- `control_wizard_schedules` - Recurring schedules
- `control_wizard_forms` - Assessment forms
- `control_wizard_form_fields` - Form field definitions
- `control_wizard_documents` - Policy documents
- `control_wizard_approvals` - Approval workflows
- `control_wizard_reports` - Reporting configurations

## 🚨 Troubleshooting

### Common Issues

1. **"Required data not found"**
   - Run other seed files first: `npm run seed:controls`
   - Ensure database has frameworks, categories, and users

2. **"Cannot find module" errors**
   - Check that `tsconfig.json` has `"resolveJsonModule": true`
   - Verify the JSON file path is correct

3. **Database connection errors**
   - Verify `.env` file has correct `DATABASE_URL`
   - Ensure database is running and accessible

4. **TypeScript compilation errors**
   - Ensure `tsconfig.json` has proper JSON module support
   - Check that all imports are correct

### Debug Mode

To run with additional logging:

```bash
DEBUG=* npm run seed:wizards
```

## 🔄 Re-running the Seed

The script is designed to be idempotent, but for clean re-runs:

1. **Delete existing wizards** (if any)
2. **Run the seed script** again
3. **Verify** the new wizards are created

## 📝 Notes

- **Timestamps**: All wizards are created with current timestamps
- **Schedules**: Start dates are set to January 1, 2024
- **Users**: Uses the first available user as the creator
- **Organizations**: Optional - wizards can be organization-agnostic
- **Frameworks**: Automatically finds frameworks by short codes
- **JSON Config**: All wizard definitions stored in `control-wizard-configs.json`

## 🤝 Contributing

When adding new wizards:

1. **Follow the JSON structure** in the config file
2. **Include comprehensive configurations** for all components
3. **Test the seed script** thoroughly
4. **Update this README** with new wizard details
5. **Maintain backward compatibility** when possible

## 🔮 Future Enhancements

Potential improvements:

- **Template System**: Pre-built wizard templates
- **Validation**: JSON schema validation for configs
- **Import/Export**: Wizard configuration import/export
- **UI Builder**: Visual wizard configuration interface
- **Versioning**: Wizard configuration versioning
