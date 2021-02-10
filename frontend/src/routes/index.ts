import { RouteProps } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import CategoryList from '../pages/category/List';

interface MyRoutePropos extends RouteProps {
    label: string;
};

const routes: MyRoutePropos[] = [
    {
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        label: 'Dashboard',
        path: '/categories',
        component: CategoryList,
        exact: true
    }
];

export default routes;