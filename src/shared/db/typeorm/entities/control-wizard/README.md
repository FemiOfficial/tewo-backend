# Control Wizard Entities

This folder contains the database entities for the Control Wizard system, which enables organizations to set up company-wide compliance controls through an intuitive wizard interface.

## Overview

The Control Wizard system supports different types of controls across all compliance categories:

- **Security & Incidents Management**
- **Risk Management**
- **IT & Operational Security**
- **Information Management**
- **Governance**
- **Data Privacy**
- **Access Controls**

## Entity Structure

### Core Entities

#### 1. `ControlWizard` (Main Entity)

- **Purpose**: Central entity that defines a control wizard configuration
- **Key Features**:
  - Supports both system-defined and custom controls
  - Maps to specific control categories and frameworks
  - Configurable execution modes (automated, manual, hybrid, workflow)
  - Category-specific configurations for different control types

#### 2. `ControlWizardSchedule`

- **Purpose**: Manages recurring schedules and execution methods
- **Key Features**:
  - Multiple interval types (daily, weekly, monthly, quarterly, etc.)
  - Flexible scheduling configuration
  - Support for automated, manual, and hybrid execution

### Form-Based Controls

#### 3. `ControlWizardForm`

- **Purpose**: Defines forms for assessments, questionnaires, and checklists
- **Key Features**:
  - Multiple form types (assessment, checklist, questionnaire, etc.)
  - Configurable scoring and validation
  - Version control support

#### 4. `ControlWizardFormField`

- **Purpose**: Defines individual form fields with validation rules
- **Key Features**:
  - Rich field types (text, select, file upload, signature, etc.)
  - Conditional logic support
  - Scoring and validation rules

#### 5. `ControlWizardFormSubmission`

- **Purpose**: Stores form responses and submissions
- **Key Features**:
  - Complete submission history
  - Scoring and evaluation results
  - Review and approval workflow

### Document-Based Controls

#### 6. `ControlWizardDocument`

- **Purpose**: Manages documents like policies, procedures, and standards
- **Key Features**:
  - Document lifecycle management
  - Approval workflows
  - Retention policies
  - Metadata and classification

#### 7. `ControlWizardDocumentVersion`

- **Purpose**: Tracks document versions and changes
- **Key Features**:
  - Complete version history
  - Change tracking and impact assessment
  - File management and integrity

### Workflow-Based Controls

#### 8. `ControlWizardApproval`

- **Purpose**: Manages multi-stage approval workflows
- **Key Features**:
  - Multiple approval types (sequential, parallel, majority, etc.)
  - Escalation and timeout handling
  - Delegation support

#### 9. `ControlWizardApprovalStage`

- **Purpose**: Defines individual approval stages
- **Key Features**:
  - Stage-specific approvers and requirements
  - Timeout and escalation configuration
  - Stage result tracking

### Reporting Controls

#### 10. `ControlWizardReport`

- **Purpose**: Configures automated reporting capabilities
- **Key Features**:
  - Multiple report types and formats
  - Configurable content and distribution
  - Template support

#### 11. `ControlWizardReportSchedule`

- **Purpose**: Manages automated report generation schedules
- **Key Features**:
  - Flexible scheduling options
  - Auto-generation and distribution
  - Performance tracking

### Execution Tracking

#### 12. `ControlWizardExecution`

- **Purpose**: Tracks all control executions and their results
- **Key Features**:
  - Complete execution history
  - Success/failure tracking
  - Performance metrics

## Key Relationships

```
ControlWizard (1) ←→ (N) ControlWizardSchedule
ControlWizard (1) ←→ (N) ControlWizardForm
ControlWizard (1) ←→ (N) ControlWizardDocument
ControlWizard (1) ←→ (N) ControlWizardApproval
ControlWizard (1) ←→ (N) ControlWizardReport

ControlWizardForm (1) ←→ (N) ControlWizardFormField
ControlWizardForm (1) ←→ (N) ControlWizardFormSubmission

ControlWizardDocument (1) ←→ (N) ControlWizardDocumentVersion

ControlWizardApproval (1) ←→ (N) ControlWizardApprovalStage

ControlWizardReport (1) ←→ (N) ControlWizardReportSchedule

ControlWizardSchedule (1) ←→ (N) ControlWizardExecution
```

## Usage Examples

### Creating an Access Control Wizard

```typescript
const accessControlWizard = {
  title: 'GitHub Access Management',
  description: 'Automated access review for GitHub repositories',
  mode: ControlWizardMode.AUTOMATED,
  categoryId: 7, // Access Controls
  frameworkId: 1, // SOC 2
  isRecurring: true,
  requiresEvidence: true,
  generatesReport: true,
  categorySpecificConfig: {
    accessReviewIntervals: ['quarterly'],
    automationCapabilities: ['auto-disable', 'auto-notify'],
  },
};
```

### Creating a Risk Assessment Wizard

```typescript
const riskWizard = {
  title: 'Enterprise Risk Assessment',
  description: 'Comprehensive risk identification and assessment',
  mode: ControlWizardMode.MANUAL,
  categoryId: 2, // Risk Management
  frameworkId: 1, // SOC 2
  requiresApproval: true,
  requiresEvidence: true,
  generatesReport: true,
  categorySpecificConfig: {
    riskAssessmentCriteria: ['Likelihood', 'Impact', 'Vulnerability'],
    riskScoringMethod: '5x5 Matrix',
  },
};
```

## Frontend Integration

The entities are designed to support:

- **Wizard Flow**: Step-by-step control setup
- **Conditional Logic**: Dynamic field display based on selections
- **Validation**: Real-time form validation
- **Progress Tracking**: Visual progress indicators
- **Template Library**: Pre-built control templates
- **Bulk Operations**: Setting up multiple similar controls

## Database Considerations

- **UUIDs**: Used for most primary keys to support distributed systems
- **JSONB**: Flexible configuration storage for category-specific settings
- **Timestamps**: Comprehensive audit trail with created/updated timestamps
- **Foreign Keys**: Proper referential integrity with cascade deletes
- **Indexes**: Consider adding indexes on frequently queried fields

## Migration Notes

When implementing these entities:

1. Create the tables in dependency order (parent entities first)
2. Add appropriate database indexes for performance
3. Consider data migration strategies for existing controls
4. Implement proper validation at the application layer
5. Set up monitoring for execution performance and failures
