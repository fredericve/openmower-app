import {Box, TextField as MuiTextField} from '@mui/material';
import type {NumberField as NumberFieldType} from './types';

interface NumberFieldProps {
  field: NumberFieldType;
  value?: number;
  onChange?: (value: number) => void;
}

export function NumberField({field, value, onChange}: NumberFieldProps) {
  const unit = field['x-unit'] ? ` (${field['x-unit']})` : '';

  return (
    <Box sx={{mb: 2}}>
      <MuiTextField
        fullWidth
        type="number"
        name={field.name}
        label={`${field.label}${unit}`}
        value={value ?? field.default ?? ''}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        helperText={field.description}
        inputProps={{
          min: field.minimum,
          max: field.maximum,
          step: field.jsonType === 'integer' ? 1 : 'any',
        }}
        slotProps={{
          formHelperText: {
            sx: {whiteSpace: 'pre-wrap'},
          },
        }}
      />
    </Box>
  );
}
