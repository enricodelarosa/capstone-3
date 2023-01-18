import { Col, Row } from 'react-bootstrap';

export default function Auth(props) {
    return (
        <Row className="justify-content-center align-items-center h-100 mx-2">
            <Col className="col-12 col-md-6 col-lg-4 bg-light border border-dark rounded py-2 px-2 ">
                {props.children}
            </Col>
        </Row>
    )
}
