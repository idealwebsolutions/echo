import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const lightTheme = createMuiTheme({
  palette: {
    primary: blue
  },
  typography: {
    useNextVariants: true
  },
});

export default lightTheme;
