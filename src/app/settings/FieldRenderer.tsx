import {Box, Typography} from '@mui/material';
import {CheckboxField} from './CheckboxField';
import {FieldsetField} from './FieldsetField';
import {NumberField} from './NumberField';
import {RadioField} from './RadioField';
import {TextField} from './TextField';
import type {BaseField, Field} from './types';

interface FieldRendererProps {
  field: Field;
  level?: number;
}

export function FieldRenderer({field, level = 0}: FieldRendererProps) {
  // Don't render invisible fields
  if (field.isVisible === false) {
    return null;
  }

  // Handle by inputType for more reliable field rendering
  switch (field.inputType) {
    case 'fieldset':
      return <FieldsetField field={field} level={level} />;

    case 'radio':
      return <RadioField field={field} />;

    case 'checkbox':
      return <CheckboxField field={field} />;

    case 'number':
      return <NumberField field={field} />;

    case 'text':
      return <TextField field={field} />;

    default:
      // Fallback for unknown field types
      const unknownField = field as BaseField;
      return (
        <Box sx={{mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1}}>
          <Typography variant="body2" color="text.secondary">
            Unsupported field type: {unknownField.inputType || unknownField.type} (
            {unknownField.label || unknownField.name})
          </Typography>
        </Box>
      );
  }
}
