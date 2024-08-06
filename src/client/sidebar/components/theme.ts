import { createTheme } from '@mui/material/styles';

export const Theme = createTheme({
  typography: {
    fontSize: 12,
    caption: {
      fontSize: '.7rem',
    },
    body2: {
      fontSize: '.8rem',
    },
    h6: {
      paddingBottom: '.2rem',
    }
  },
  spacing: 3,
  components: {
    MuiToggleButtonGroup: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'medium',
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: 'dense',
        size: 'medium',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
        multiline: true,
        minRows: 4,
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
        size: 'medium',
        fullWidth: true,
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          paddingRight: '1.5rem',
          paddingLeft: '1rem',
          paddingTop: '.6rem',
          paddingBottom: '.6rem',
        },
        content: {
          '& .MuiTypography-root': {
            fontSize: '1rem',
            fontWeight: '500',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: '5.1rem',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '1rem', // Increase padding as needed
          paddingTop: '0rem',
          paddingBottom: '2rem',
        },
      },
    },
  },
});
