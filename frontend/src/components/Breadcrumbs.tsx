/* eslint-disable no-nested-ternary */
import { Box, Container } from '@material-ui/core';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link, { LinkProps } from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Location } from 'history';
import React from 'react';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import RouterParser from 'route-parser';
import routes from '../routes';

const breadcrumbNameMap: { [key: string]: string } = {};
routes.forEach(route => breadcrumbNameMap[route.path as string] = route.label);

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any} />;

export default function Breadcrumbs() {

  function makeBreadcrumbs(location: Location) {
    const pathnames = location.pathname.split('/').filter(x => x);
    pathnames.unshift('/');
    console.log('[Breadcrumb]', pathnames, location.pathname)

    return (
      <MuiBreadcrumbs aria-label="breadcrumb">
        {
          pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `${pathnames.slice(0, index + 1).join('/').replace('//', '/')}`;
            const route = Object.keys(breadcrumbNameMap).find(path => new RouterParser(path).match(to));

            if (route === undefined) {
              return false;
            }

            return last ? (
              <Typography color="textPrimary" key={to}>
                {breadcrumbNameMap[to]}
              </Typography>
            ) : (
              <LinkRouter color="inherit" to={to} key={to}>
                {breadcrumbNameMap[to]}
              </LinkRouter>
            );
          })
        }
      </MuiBreadcrumbs>
    );
  }

  return (
    <Container>
      <Box paddingTop={2} paddingBottom={1}>
        <Route>
          {
            ({ location }: { location: Location }) => makeBreadcrumbs(location)
          }
        </Route>
      </Box>
    </Container>
  );

}
