import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
    background: {
      default: '#f5f5f5',
      paper: '#dddddd'
    }
  },
  typography: {
    fontSize: 12,
  },
  spacing: 2,
  overrides: {
    MuiDataTable: {

    }
  },
});

export default theme;