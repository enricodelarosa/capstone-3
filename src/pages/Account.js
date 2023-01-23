import Content from '../layout/Content';

import UserContext from '../UserContext';

import {useContext} from 'react';

import Auth from '../layout/Auth';

export default function() {
    const {user} = useContext(UserContext);
    
    function getRole(isSuperAdmin, isAdmin) {
        if (isSuperAdmin) {
            return 'Super Admin';
        }

        if (isAdmin) {
            return 'Admin'
        }

        return 'User';
    }

    const role = getRole(user.isSuperAdmin, user.isAdmin);
    return (
        <>
        <div >
        <h1 className="mt-4 mb-4 text-center">User Details</h1>
        <Auth>
        

        <h6 className="d-inline" style={{fontSize: '2.5rem', fontWeight: 'bold'}}>Email: </h6> <p style={{fontSize: '2rem', fontWeight: 'normal', wordBreak: 'break-word'}} className="d-inline">{user.email}</p>
        <h6></h6>

        <h6 className="d-inline" style={{fontSize: '3rem', fontWeight: 'bold'}}>Role: </h6> <p className="d-inline" style={{fontSize: '3rem', fontWeight: 'normal'}}>{role}</p>
        <h6></h6>
        </Auth>
        </div>
        </>

    )
}