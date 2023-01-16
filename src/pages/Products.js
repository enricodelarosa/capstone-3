import ProductCard from '../components/ProductCard';
import {useState, useEffect} from 'react';
// import coursesData from '../data/coursesData';

import {Row, Col} from 'react-bootstrap';

export default function Courses() {

    const [products, setProducts] = useState([]);


    useEffect(() => {
        fetch(`/products`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            
            setProducts(data.map(product => {
                return <ProductCard key={product.id} product={product}/>
            }))
        })
    }, [])

	// Props Drilling - allows us to pass information from one component to another using "props"
	// Curly braces {} are used for props to signify that we are providing/passing information
	return(
		<Row>
		{products}
		</Row>
	)
}