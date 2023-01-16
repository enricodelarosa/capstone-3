import { useState , useEffect, useContext} from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import UserContext from '../UserContext';

import {useParams, useNavigate, Link} from 'react-router-dom';

export default function ProductView() {

    const navigate = useNavigate();

    const {user} = useContext(UserContext);

    const {productId} = useParams();
	
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);

    const displayPrice =  price.toFixed(2);

    useEffect(() => {

        fetch(`/products/${productId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
        })

    }, [productId]);

    return (
        <Container>
			<Row>
				<Col lg={{span: 6, offset:3}} >
					<Card>
					      <Card.Body className="text-center">
					        <Card.Title>{name}</Card.Title>
					        <Card.Subtitle>Description:</Card.Subtitle>
					        <Card.Text>{description}</Card.Text>
					        <Card.Subtitle>Price:</Card.Subtitle>
					        <Card.Text>Php {displayPrice}</Card.Text>
					        
					        {/* {
					        	(user.id !== null) ?
					        		<Button variant="primary" onClick={() => enroll(courseId)} >Enroll</Button>
					        		:
					        		<Button className="btn btn-danger" as={Link} to="/login"  >Log in to Enroll</Button>
					        } */}

					      </Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>

    )

}