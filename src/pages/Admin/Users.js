import {useState, useEffect} from 'react';

import {Container, Row, Col, Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Spinner from '../../utils/Spinner';
import Content from '../../layout/Content';

export default function Users() {
    
    const [users, setUsers] = useState(null);

    function fetchUsers() {
        fetch(`/users/all`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {

            setUsers(data);


        })
    }

    useEffect(() => {

        fetchUsers();

    }, [])

    function toggleAdmin(userId, bool) {
        fetch(`/users/${userId}?isAdmin=${bool}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {

            fetchUsers();


        })

    }
    
    return (
        <>
        <h1 className="text-center mt-4">List of Users</h1>
        
        
            
                {(users === null) ?
                <Content>
                    <Spinner />
                </Content>
                :

                <Container className="">
                    <Row className="justify-content-center">
                        <Col className="col-12 col-md-6">
                        <Table variant="dark" striped bordered hover>
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
                                    <tr className="text-center align-middle">
                                    
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? 'Admin' : 'User'}</td>

                                    <td>
                                        <Button 
                                        className="my-auto" 
                                        variant={`${user.isAdmin ? "danger" : "info"}`}
                                        onClick={e => {
                                            toggleAdmin(user._id, !user.isAdmin)
                                        }}
                                        >
                                            {user.isAdmin ? "Demote To User" : 'Promote to Admin'}
                                        </Button>
                                    </td>
                                    

                                    </tr>

                                    
                                
                            )
                        })
                        }
                        </tbody>
                        </Table>
                        </Col>
                    </Row>  
                    </Container>
                }

            
        
        </>
    )   

}