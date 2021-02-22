import { RouteProps } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import CategoryList from '../pages/category/PageList';
import GenreList from '../pages/genre/PageList';
import CastMemberList from '../pages/cast_member/PageList'

export interface MyRouteProps extends RouteProps {
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
    },
    {
        name: 'categories.create',
        label: 'Criar Categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Membros do Elenco',
        path: '/cast_members',
        component: CastMemberList,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Lista de Gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
];

export default routes;