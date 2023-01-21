
import {useState, useContext} from 'react';

import {Button} from 'react-bootstrap';

import {useParams, useNavigate} from 'react-router-dom';

import UserContext from '../../../UserContext';

import Spinner from '../../../utils/Spinner';

export default function AdminProduct({product, getProducts}) {

    const {width} = useContext(UserContext);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    function toggleisActive(productId, option) {
        setIsLoading(true);
        fetch(`/products/${productId}/${option}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {

            getProducts(setIsLoading);
            //setProducts
        })

    }

    const noneStyle = {
        display: 'none'
    }

    const cellStyle = {
        display: 'table-cell'
    }


    return (

        

        <tr className={`${product.isActive ? '' : 'bg-danger'} align-middle`} key={product.id}>
            <th>{product.name}</th>
            <td style={(width <= 768)? noneStyle : cellStyle}>{product.description}</td>
            <td className="text-end">&#8369;  {
                Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(product.price)
            }
            </td>
            <td className="text-center" style={(width <= 768)? noneStyle : cellStyle}>{product.stock}</td>
            <td className={`text-center`}>
                <strong>
                    {
                        product.isActive ? 'Active' : 'Inactive'
                    }
                </strong>
            </td>
            <td className="text-center">
                <Button className="my-1 py-0 px-2 d-block mx-auto"
                    variant="warning" onClick={e => {
                        navigate(`/admin/products/${product._id}`)
                    }}><strong>Update</strong></Button>


                {(isLoading) ?


                <Spinner small={true}/>
                    :

                    <Button className="my-1 py-0 px-2 d-block mx-auto"

                        variant={product.isActive ? 'danger' : 'info'}

                        onClick={e => {
                            const option = product.isActive ? 'deactivate' : 'activate';
                            toggleisActive(product._id, option)
                        }}
                    >
                        <strong>{product.isActive ? 'Deactivate' : 'Activate'}
                        </strong>
                    </Button>
                }

            </td>
        </tr>

    )
}