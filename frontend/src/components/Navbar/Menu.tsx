import { IconButton, Menu as MenuMui, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { Link } from 'react-router-dom';
import routes, {MyRouteProps} from '../../routes';

const listRoutes = {
  'dashboard': 'Dashboard',
  'categories.list': 'Categorias',
  'cast_members.list': 'Membros de Elenco',
  'genres.list': 'Gêneros',
}

const menuRoutes = routes.filter(route => Object.keys(listRoutes).includes(route.name));

export const Menu = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <React.Fragment>
      <IconButton
        color="inherit"
        aria-label='open drawer'
        aria-controls='menu-appbar'
        onClick={handleOpen} >
        <MenuIcon />
      </IconButton>

      <MenuMui
        id='menu-appbar'
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        getContentAnchorEl={null}>
        { 
          Object.keys(listRoutes).map(
            (routeName, key) => {
              const route = menuRoutes.find(r => r.name === routeName) as MyRouteProps;
              return (
                <MenuItem key={key} component={Link} to={route.path as string} onClick={handleClose}>
                  {listRoutes[routeName]}
                </MenuItem>
              );
            }
          )
        }
      </MenuMui>
    </React.Fragment>
  );
};
