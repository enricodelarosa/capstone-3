import {Button} from 'react-bootstrap';

import {Link} from 'react-router-dom';

export default function Error404() {
    return (
        <div className="mt-4">
        <h1>404 Page not found</h1>

        <h4>The Page you are looking for deoes not exist</h4>


        <Button as={Link} to={'/products'}>Go Back to Products</Button>
        </div>


    )
}