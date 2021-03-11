import { createMuiTheme } from '@material-ui/core/styles';
import { PaletteOptions, SimplePaletteColorOptions } from '@material-ui/core/styles/createPalette';
import { purple, green, red, blue } from '@material-ui/core/colors';

const palette: PaletteOptions = {
  primary: {
    main: purple[500],
  },
  secondary: {
    main: green[500],
  },
  background: {
    default: '#f5f5f5',
    paper: '#dddddd'
  },
  success: {
    main: blue[500],
  },
  error: {
    main: red[500],
  },
}

const theme = createMuiTheme({
  palette,
  typography: {
    fontSize: 12,
  },
  spacing: 2,
  overrides: {
    MUIDataTable: {
      paper: {
        boxShadow: 'none'
      }
    },
    MUIDataTableToolbar: {
      root: {
        minHeight: '58px',
        backgroundColor: palette.background?.default,
      },
      icon: {
        color: (palette.primary as SimplePaletteColorOptions)?.main,
        '&:hover, &:active, &:focus': {
          color: '#055a52',
        }
      },
      iconActive: {
        color: '#055a52',
        '&:hover, &:active, &:focus': {
          color: '#055a52',
        }
      }
    },
    MUIDataTableHeadCell: {
      fixedHeader: {
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: (palette.primary as SimplePaletteColorOptions)?.main,
        color: '#fff',
        '&[aria-sort]': {
          backgroundColor: '%459ac4',
        }
      },
      sortActive: {
        color: '#fff',
      },
      sortLabelRoot: {
        '& svg': {
          color: '#fff !important',
        }
      },
      sortAction: {
        alignItems: 'center'
      },
    },
    MUIDataTableSelectCell: {
      headerCell: {
        backgroundColor: (palette.primary as SimplePaletteColorOptions)?.main,
        '& span': {
          color: '#fff !important'
        }
      }
    },
    MUIDataTableBodyCell: {
      root: {
        color: (palette.primary as SimplePaletteColorOptions)?.main,
        '&:hover, &:active, &:focus': {
          color: (palette.primary as SimplePaletteColorOptions)?.main,
        }
      }
    },
    MUIDataTableToolbarSelect: {
      title: {
        color: (palette.primary as SimplePaletteColorOptions)?.main,
      },
      iconButton: {
        color: (palette.primary as SimplePaletteColorOptions)?.main,
      }
    },
    MUIDataTableBodyRow: {
      root: {
        '&:nth-child(odd)': {
          backgroundColor: palette.background?.default
        }
      }
    },
    MUIDataTablePagination: {
      root: {
        color: (palette.primary as SimplePaletteColorOptions)?.main,
      }
    }
  },
});

export default theme;