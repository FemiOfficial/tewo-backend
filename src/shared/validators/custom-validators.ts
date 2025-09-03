import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom validator for checking if a date is in the future
@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return true; // Allow empty values if field is optional

    const date = new Date(value);
    const now = new Date();

    return date > now;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a future date`;
  }
}

// Custom validator for checking if a string contains only allowed characters
@ValidatorConstraint({ name: 'allowedCharacters', async: false })
export class AllowedCharactersConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (!value) return true;

    const allowedChars = args.constraints[0] || /^[a-zA-Z0-9\s\-_\.]+$/;

    if (typeof allowedChars === 'string') {
      const regex = new RegExp(allowedChars);
      return regex.test(value);
    }

    return allowedChars.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} contains invalid characters`;
  }
}

// Custom validator for checking if an array contains unique values
@ValidatorConstraint({ name: 'uniqueArray', async: false })
export class UniqueArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) return false;

    const uniqueSet = new Set(value);
    return uniqueSet.size === value.length;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must contain unique values`;
  }
}

// Custom validator for checking if a value matches a specific pattern based on another field
@ValidatorConstraint({ name: 'conditionalPattern', async: false })
export class ConditionalPatternConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (!value) return true;

    const [patternField, patternMap] = args.constraints;
    const patternFieldValue = (args.object as any)[patternField];

    if (!patternFieldValue || !patternMap[patternFieldValue]) return true;

    const regex = new RegExp(patternMap[patternFieldValue]);
    return regex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} format is invalid for the selected ${args.constraints[0]}`;
  }
}

// Custom validator for business logic validation
@ValidatorConstraint({ name: 'businessRule', async: false })
export class BusinessRuleConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [ruleType, ruleConfig] = args.constraints;

    switch (ruleType) {
      case 'scheduleConflict':
        return this.validateScheduleConflict(value, args.object, ruleConfig);
      case 'riskLevel':
        return this.validateRiskLevel(value, ruleConfig);
      case 'complianceScore':
        return this.validateComplianceScore(value, ruleConfig);
      default:
        return true;
    }
  }

  private validateScheduleConflict(
    value: any,
    object: any,
    config: any,
  ): boolean {
    // Example: Check if schedule conflicts with existing schedules
    if (!value || !object.controlWizardId) return true;

    // This would typically check against the database
    // For now, we'll just do basic validation
    const startDate = new Date(value);
    const endDate = new Date(
      startDate.getTime() + (config?.duration || 24 * 60 * 60 * 1000),
    );

    return startDate < endDate;
  }

  private validateRiskLevel(value: any, config: any): boolean {
    if (!value || !config.allowedLevels) return true;

    return config.allowedLevels.includes(value);
  }

  private validateComplianceScore(value: any, config: any): boolean {
    if (typeof value !== 'number') return false;

    const { min, max } = config;
    return value >= (min || 0) && value <= (max || 100);
  }

  defaultMessage(args: ValidationArguments) {
    const [ruleType] = args.constraints;
    return `${args.property} failed business rule validation: ${ruleType}`;
  }
}

// Decorator functions
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}

export function AllowedCharacters(
  pattern: string | RegExp,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [pattern],
      validator: AllowedCharactersConstraint,
    });
  };
}

export function UniqueArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueArrayConstraint,
    });
  };
}

export function ConditionalPattern(
  patternField: string,
  patternMap: Record<string, string>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [patternField, patternMap],
      validator: ConditionalPatternConstraint,
    });
  };
}

export function BusinessRule(
  ruleType: string,
  ruleConfig?: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [ruleType, ruleConfig],
      validator: BusinessRuleConstraint,
    });
  };
}
