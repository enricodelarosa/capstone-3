import ProductCard from '../components/ProductCard';
import {useState, useEffect} from 'react';
// import coursesData from '../data/coursesData';

import {Row, Col, Container} from 'react-bootstrap';


import Spinner from '../utils/Spinner';

import {useSearchParams} from 'react-router-dom';

export default function Products() {

    const [products, setProducts] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setSearchParams(`?${new URLSearchParams({ field: 'name' })}&${new URLSearchParams({ isAsc: 1 })}`)
    },[setSearchParams])

    // useEffect(() => {
    //     // console.log('search params changed');
    //     extractProducts()

    // },[searchParams])



    useEffect(() => {
        // console.log(field, isAsc)
        function extractProducts() {
            setIsLoading(true)
            const field = searchParams.get('field');
            const isAsc = searchParams.get('isAsc');
    
            fetch(`/products?field=${field}&isAsc=${isAsc}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                
                setProducts(data.map(product => {
    
                    return (
                        <Col  key ={product._id}className="col-12 col-md-4 col-lg-3 my-2">
                            <ProductCard  product={product} searchParams={searchParams}/>
                        </Col>
                    )
                }))
    
                setIsLoading(false);
            })
        }

        extractProducts()

    }, [searchParams])


    function updateSearchParams(json) {

        const [field, isAsc] = json.split(':')

        console.log(field, isAsc);

        setSearchParams(`?${new URLSearchParams({ field: field  })}&${new URLSearchParams({ isAsc: isAsc })}`)

    }

	// Props Drilling - allows us to pass information from one component to another using "props"
	// Curly braces {} are used for props to signify that we are providing/passing information
	return(
        
        <Container>
            <Row>
        <div className="text-center mt-4"><p className="d-inline p-2">Sort By</p><select onChange={ e => {
                        updateSearchParams(e.target.value)
                    }}>
                        <option value="name:1">Name: A to Z</option>
                        <option value="name:-1">Name: Z to A</option>
                        <option value="price:1">Price: Low to High</option>
                        <option value="price:-1">Price: High to Low</option>
                        </select></div>

                        </Row>
        <Row className="mt-4 mx-1 justify-content-center align-middle">

            {
                (products == null || isLoading) ?

                <Spinner />
                :

                <>

                    {products}
                </>
                    
                

                
                
            }
        </Row>
        </Container>
        
	)
}