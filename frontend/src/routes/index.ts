import { RouteProps } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import CategoryList from '../pages/category/PageList';
import CategoryForm from '../pages/category/PageForm';
import GenreList from '../pages/genre/PageList';
import GenreForm from '../pages/genre/PageForm';
import CastMemberList from '../pages/cast_member/PageList';
import CastMemberForm from '../pages/cast_member/PageForm';

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
        path: '/categories/create',
        component: CategoryForm,
        exact: true
    },
    {
        name: 'categories.edit',
        label: 'Editar Categorias',
        path: '/categories/:id/edit/',
        component: CategoryForm,
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
        name: 'cast_members.create',
        label: 'Criar Membro de Elenco',
        path: '/cast_members/create',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'cast_members.edit',
        label: 'Editar Membro de Elenco',
        path: '/cast_members/:id/edit',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Lista de Gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
    {
        name: 'genres.create',
        label: 'Criar Gêneros',
        path: '/genres/create',
        component: GenreForm,
        exact: true
    },
    {
        name: 'genres.edit',
        label: 'Criar Gêneros',
        path: '/genres/:id/edit',
        component: GenreForm,
        exact: true
    },
];

export default routes;