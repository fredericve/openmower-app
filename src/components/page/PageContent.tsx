import {Box} from '@mui/material';
import {PropsWithChildren} from 'react';

export default function PageContent({children}: PropsWithChildren) {
  return (
    <Box
      sx={{
        mx: {xs: 0, md: 2},
        mt: {xs: 1, md: -4},
        position: 'relative',
        zIndex: 2,
      }}
    >
      {children}
    </Box>
  );
}
