import ProductCard from '../components/ProductCard';
import {useState, useEffect} from 'react';
// import coursesData from '../data/coursesData';

import {Row, Col} from 'react-bootstrap';

import Content from '../layout/Content';

export default function Products() {

    const [products, setProducts] = useState([]);


    useEffect(() => {
        fetch(`/products`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            
            setProducts(data.map(product => {
                return <ProductCard key={product._id} product={product}/>
            }))
        })
    }, [])

	// Props Drilling - allows us to pass information from one component to another using "props"
	// Curly braces {} are used for props to signify that we are providing/passing information
	return(
        <Content>
        <Row className="mt-4 mx-1">
            {products}
        </Row>
        </Content>
	)
}