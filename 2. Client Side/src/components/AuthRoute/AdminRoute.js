import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfileAction } from '../../redux/slices/users/usersSlice';
import AdminOnly from '../NotAuthorised/AdminOnly';

const AdminRoute = ({ children }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserProfileAction());
    }, [dispatch]);
    const { userAuth } = useSelector((state) => state?.users);

    const isAdmin = userAuth?.userInfo?.userFound?.isAdmin ? true : false;
    if (!isAdmin) return <AdminOnly />;
    return (
        <div>
            {children}
        </div>
    )
}

export default AdminRoute;
