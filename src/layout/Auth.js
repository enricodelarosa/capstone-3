import { Col, Row } from 'react-bootstrap';

export default function Auth(props) {
    return (
        <Row className="justify-content-center align-items-center h-100">
            <Col className="col-12 col-md-6 col-lg-4">
                {props.children}
            </Col>
        </Row>
    )
}
