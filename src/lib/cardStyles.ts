export const outerCardStyles = {
  borderRadius: 4,
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)',
};

export const innerCardStyles = {
  borderRadius: 3,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
};
