'use client';

import {useSelectedMower} from '@/stores/mowersStore';
import JsonSchemaDereferencer from '@json-schema-tools/dereferencer';
import {ExpandMore as ExpandMoreIcon} from '@mui/icons-material';
import {Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Typography} from '@mui/material';
import {createHeadlessForm} from '@remoteoss/json-schema-form';
import mergeAllOf from 'json-schema-merge-allof';
import {useEffect, useState} from 'react';
import {FieldsetField} from './FieldsetField';
import type {Field, FieldsetField as FieldsetFieldType} from './types';

export function SettingsForm() {
  const [fields, setFields] = useState<Field[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rpc = useSelectedMower((s) => s?.rpc);

  useEffect(() => {
    async function initializeForm() {
      if (!rpc) {
        setError('No mower selected');
        return;
      }
      setError(null);

      try {
        const schema = await rpc.meta.config.schema();
        const dereferencer = new JsonSchemaDereferencer(JSON.parse(schema), {
          recursive: true,
        });
        const dereferencedSchema = await dereferencer.resolve();
        if (typeof dereferencedSchema !== 'object') {
          throw new Error('Dereferenced schema is not an object');
        }
        const mergedSchema = mergeAllOf(dereferencedSchema);
        const {fields: formFields} = createHeadlessForm(mergedSchema);
        setFields(formFields as unknown as Field[]);
      } catch (err) {
        console.error('Failed to initialize form:', err);
        setError('Failed to load settings schema');
      }
    }

    initializeForm();
  }, [rpc]);

  if (error) {
    return (
      <Box sx={{p: {xs: 2, md: 3}}}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!fields) {
    return (
      <Box sx={{p: {xs: 2, md: 3}, display: 'flex', justifyContent: 'center'}}>
        <CircularProgress />
      </Box>
    );
  }

  // Filter to get only top-level fieldsets
  const topLevelFieldsets = fields.filter((field) => field.type === 'fieldset') as FieldsetFieldType[];

  return (
    <Box sx={{p: {xs: 2, md: 3}}}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
        Configure your mower settings. Changes are displayed but not saved yet.
      </Typography>

      {topLevelFieldsets.map((fieldset) => (
        <Accordion
          key={fieldset.name}
          sx={{
            mb: 2,
            '&:before': {display: 'none'},
            boxShadow: 1,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              bgcolor: 'background.default',
              '&:hover': {bgcolor: 'action.hover'},
              borderBottom: '1px solid',
              borderColor: 'divider',
              fontWeight: 'bold',
            }}
          >
            <Typography variant="h6">{fieldset.label}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{pt: 2}}>
            {fieldset.description && (
              <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                {fieldset.description}
              </Typography>
            )}
            <FieldsetField field={fieldset} level={0} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
