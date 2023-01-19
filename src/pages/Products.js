import ProductCard from '../components/ProductCard';
import {useState, useEffect} from 'react';
// import coursesData from '../data/coursesData';

import {Row, Col, Container} from 'react-bootstrap';

import Content from '../layout/Content';

import Spinner from '../utils/Spinner';

export default function Products() {

    const [products, setProducts] = useState(null);


    useEffect(() => {
        fetch(`/products`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            
            setProducts(data.map(product => {

                return (
                    <Col  key ={product._id}className="col-12 col-md-3 m-2">
                        <ProductCard  product={product}/>
                    </Col>
                )
            }))
        })
    }, [])

	// Props Drilling - allows us to pass information from one component to another using "props"
	// Curly braces {} are used for props to signify that we are providing/passing information
	return(
        <Content>
        <Container>
        <Row className="mt-4 mx-1 justify-content-center align-middle">
            {
                (products == null) ?

                <Spinner />
                :

                products
                
            }
        </Row>
        </Container>
        </Content>
	)
}