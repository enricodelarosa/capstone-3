import {useState, useEffect} from 'react';

import {Container, Row, Col, Button} from 'react-bootstrap';
import Spinner from '../../../utils/Spinner';
import Content from '../../../layout/Content';


export default function User({user,fetchUsers}) {

    const [isLoading, setIsLoading] = useState(false);

    function toggleAdmin(userId, bool) {
        setIsLoading(true);
        fetch(`/users/${userId}?isAdmin=${bool}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            
            fetchUsers(setIsLoading);
            
            
    
        })
    
    }
    
    return (
        <tr className="text-center align-middle">
                                    
            <td>{user.email}</td>
            <td>{user.isAdmin ? 'Admin' : 'User'}</td>

            <td>
                {(isLoading) ? 
                
                <Spinner small={true}/>
                :
                    <Button
                        className="my-auto"
                        variant={`${user.isAdmin ? "danger" : "info"}`}
                        onClick={e => {
                            toggleAdmin(user._id, !user.isAdmin)
                        }}
                    >
                        {user.isAdmin ? "Demote To User" : 'Promote to Admin'}
                    </Button>

                }

            </td>


        </tr>

                                    
                                          
    )

}