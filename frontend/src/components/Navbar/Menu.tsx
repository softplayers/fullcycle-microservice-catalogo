import { IconButton, Menu as MenuMui, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';

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
        <MenuItem onClick={handleClose}>Categorias</MenuItem>
        <MenuItem onClick={handleClose}>Videos</MenuItem>
      </MenuMui>
    </React.Fragment>
  );
};
