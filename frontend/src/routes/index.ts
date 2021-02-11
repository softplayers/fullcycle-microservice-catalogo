import { RouteProps } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import CategoryList from '../pages/category/List';

interface MyRouteProps extends RouteProps {
    name: string;
    label: string;
};

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Lista Categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    }
];

export default routes;