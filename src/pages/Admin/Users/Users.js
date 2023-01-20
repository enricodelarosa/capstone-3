import {useState, useEffect} from 'react';

import {Container, Row, Col, Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Spinner from '../../../utils/Spinner';
import Content from '../../../layout/Content';

import User from './User';

export default function Users() {
    
    const [users, setUsers] = useState(null);

    function fetchUsers(optionalCallBackFunc) {
        fetch(`/users/all`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {

            setUsers(data);

            if (typeof optionalCallBackFunc === 'function') {
                optionalCallBackFunc(false);
            }



        })
    }

    useEffect(() => {

        fetchUsers();

    }, [])

    
    
    return (
        <>
        <h1 className="text-center mt-4">List of Users</h1>
        
        
            
                {(users === null) ?
                <Content>
                    <Spinner />
                </Content>
                :

                 
                        <div>
                        <Table className="mx-auto" style={{maxWidth: '700px'}} variant="dark" striped bordered hover>
                            <thead className="text-center">
                                <tr>
                                    <th>
                                        E-mail
                                    </th>

                                    <th>Role</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>
                        { users.map(user => {
                            return (
                                <User key={user._id} user={user} fetchUsers={fetchUsers}/>
                                    )
                        })
                        }
                        </tbody>
                        </Table>
                        </div>
                    
                }

            
        
        </>
    )   

}