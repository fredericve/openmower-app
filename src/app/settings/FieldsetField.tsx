import {Box, Typography} from '@mui/material';
import {FieldRenderer} from './FieldRenderer';
import type {FieldsetField as FieldsetFieldType} from './types';

interface FieldsetFieldProps {
  field: FieldsetFieldType;
  level?: number;
}

export function FieldsetField({field, level = 0}: FieldsetFieldProps) {
  // Top-level fieldsets are handled by the accordion, so we only render nested ones here
  const isTopLevel = level === 0;

  if (isTopLevel) {
    return (
      <>
        {field.fields.map((subField) => (
          <FieldRenderer key={subField.name} field={subField} level={level + 1} />
        ))}
      </>
    );
  }

  // Calculate the sticky top position based on nesting level
  // Level 1 (first nested): 64px (accordion header height)
  // Level 2+: 64px + 40px per additional level
  const stickyTop = 64 + (level - 1) * 40;
  const zIndex = 100 - level; // Higher levels have higher z-index

  return (
    <Box
      sx={{
        mb: 3,
        pl: 2,
        borderLeft: '2px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        gutterBottom
        sx={{
          position: 'sticky',
          top: `${stickyTop}px`,
          bgcolor: 'background.default',
          py: 1,
          zIndex,
          ml: -2,
          mr: -1,
          px: 2,
        }}
      >
        {field.label}
      </Typography>
      {field.description && (
        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
          {field.description}
        </Typography>
      )}
      <Box sx={{pl: 1}}>
        {field.fields.map((subField) => (
          <FieldRenderer key={subField.name} field={subField} level={level + 1} />
        ))}
      </Box>
    </Box>
  );
}
