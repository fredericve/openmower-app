import {Checkbox, FormControlLabel, FormHelperText, Box} from '@mui/material';
import type {CheckboxField as CheckboxFieldType} from './types';

interface CheckboxFieldProps {
  field: CheckboxFieldType;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function CheckboxField({field, value = false, onChange}: CheckboxFieldProps) {
  return (
    <Box sx={{mb: 2}}>
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={(e) => onChange?.(e.target.checked)}
            name={field.name}
          />
        }
        label={field.label}
      />
      {field.description && (
        <FormHelperText sx={{ml: 4, mt: -1}}>{field.description}</FormHelperText>
      )}
    </Box>
  );
}

