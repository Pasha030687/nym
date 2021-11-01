import React from 'react';
import { Typography } from '@mui/material';

export const Title: React.FC<{ text: string }> = ({ text }) => (
  <Typography
    variant="h5"
    sx={{
      color: 'primary.main',
      mb: 3,
    }}
  >
    {text}
  </Typography>
);
