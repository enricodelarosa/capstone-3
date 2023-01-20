import ProductCard from '../components/ProductCard';
import {useState, useEffect} from 'react';
// import coursesData from '../data/coursesData';

import {Row, Col, Container} from 'react-bootstrap';

import Content from '../layout/Content';

import Spinner from '../utils/Spinner';

import {useSearchParams} from 'react-router-dom';
import { search } from 'fontawesome';

export default function Products() {

    const [products, setProducts] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setSearchParams(`?${new URLSearchParams({ field: 'name' })}&${new URLSearchParams({ isAsc: 1 })}`)
    },[])



    useEffect(() => {
        // console.log(field, isAsc)
        setIsLoading(true)
        const field = searchParams.get('field');
        const isAsc = searchParams.get('isAsc');

        fetch(`/products?field=${field}&isAsc=${isAsc}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            
            setProducts(data.map(product => {

                return (
                    <Col  key ={product._id}className="col-12 col-md-3 m-2">
                        <ProductCard  product={product} searchParams={searchParams}/>
                    </Col>
                )
            }))

            setIsLoading(false);
        })


    }, [searchParams])


    function updateSearchParams(json) {

        const [field, isAsc] = json.split(':')

        console.log(field, isAsc);

        setSearchParams(`?${new URLSearchParams({ field: field  })}&${new URLSearchParams({ isAsc: isAsc })}`)

    }

	// Props Drilling - allows us to pass information from one component to another using "props"
	// Curly braces {} are used for props to signify that we are providing/passing information
	return(
        <Content>
        <Container>
        <Row className="mt-4 mx-1 justify-content-center align-middle">
            {
                (products == null || isLoading) ?

                <Spinner />
                :

                <>
                    <div className="text-center"><p className="d-inline p-2">Sort By</p><select onChange={ e => {
                        updateSearchParams(e.target.value)
                    }}>
                        <option value="name:1">Name: A to Z</option>
                        <option value="name:-1">Name: Z to A</option>
                        <option value="price:1">Price: Low to High</option>
                        <option value="price:-1">Price: High to Low</option>
                        </select></div>
                    {products}
                </>
                    
                

                
                
            }
        </Row>
        </Container>
        </Content>
	)
}