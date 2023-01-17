import { Col, Row } from 'react-bootstrap';

export default function Auth(props) {
    return (
        <Row className="justify-content-center align-items-center h-100">
            <Col>
                {props.children}
            </Col>
        </Row>
    )
}
