import { IconButton, Menu as MenuMui, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../routes';

export const Menu = () => {

  const routeList = ['dashboard', 'categories.list'];

  const menuRoutes = routes.filter(route => routeList.includes(route.name));

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
          routeList.map(
            (routeName, key) => {
              const route = menuRoutes.find(r => r.name === routeName) as any;
              return (
                <MenuItem key={key} component={Link} to={route.path as string} onClick={handleClose}>
                  {route.label}
                </MenuItem>
              );
            }
          )
        }
      </MenuMui>
    </React.Fragment>
  );
};
