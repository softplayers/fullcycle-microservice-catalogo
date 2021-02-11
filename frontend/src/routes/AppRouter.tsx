import { Route, Switch } from 'react-router-dom';
import routes from './index';

export const AppRouter = () => {
    return (
        <Switch>
            {
                routes.map(
                    (route, key) => {
                        return <Route 
                            key={key}
                            path={route.path}
                            component={route.component}
                            exact={route.exact === true}
                        />
                    }
                )  
            }
        </Switch>
    );
};

export default AppRouter;
