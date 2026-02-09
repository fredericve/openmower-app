import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import type {RadioField as RadioFieldType} from './types';

interface RadioFieldProps {
  field: RadioFieldType;
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioField({field, value, onChange}: RadioFieldProps) {
  return (
    <FormControl component="fieldset" sx={{mb: 3, width: '100%'}}>
      <FormLabel component="legend">{field.label}</FormLabel>
      {field.description && (
        <FormHelperText sx={{mt: 0.5, mb: 1}}>{field.description}</FormHelperText>
      )}
      <RadioGroup
        name={field.name}
        value={value ?? field.default ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {field.options.map((option) => (
          <div key={option.value}>
            <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
            {option.description && (
              <Typography variant="caption" color="text.secondary" sx={{display: 'block', ml: 4, mt: -1, mb: 1}}>
                {option.description}
              </Typography>
            )}
          </div>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

