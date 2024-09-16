import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ component: Component, ...rest }) {
    const { authToken } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={props =>
                authToken ? (
                    <Component {...props} />
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
    );
}

export default PrivateRoute;
