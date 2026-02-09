import {Box, TextField as MuiTextField} from '@mui/material';
import type {TextField as TextFieldType} from './types';

interface TextFieldProps {
  field: TextFieldType;
  value?: string;
  onChange?: (value: string) => void;
}

export function TextField({field, value, onChange}: TextFieldProps) {
  return (
    <Box sx={{mb: 2}}>
      <MuiTextField
        fullWidth
        type="text"
        name={field.name}
        label={field.label}
        value={value ?? field.default ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        helperText={field.description}
        slotProps={{
          formHelperText: {
            sx: {whiteSpace: 'pre-wrap'},
          },
        }}
      />
    </Box>
  );
}

