import { Navbar, Nav, Spinner, Form } from 'react-bootstrap';
import React, { ReactNode } from 'react';
import { withStyles } from '@material-ui/core';

type MyProps = { pathName: string, isLoading?: boolean }

class NavBar extends React.Component<MyProps, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            pathName: ''
        }
    }

    componentDidMount() {
        this.setState({ pathName: this.props.pathName });
    }

    render(): ReactNode {
        const { pathName, isLoading } = this.props;
        return (
            <div>
                <Navbar bg="dark" fixed="top" variant="dark" expand="md">
                    <Navbar.Brand> Transporte Universitário </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav style={{ fontSize: '15px' }} className="mr-auto">
                            <Nav.Link active={pathName === '/' ? true : false} href="/">
                                Buscar
                                </Nav.Link>
                            <Nav.Link active={pathName === '/create' ? true : false} href="/create">
                                Inserir
                            </Nav.Link>
                        </Nav>
                        <Form inline>
                            {isLoading && isLoading === true && <Spinner style={{ color: '#fff' }} animation="border" />}
                        </Form>
                    </Navbar.Collapse>
                </Navbar >
            </div >
        );
    }
}

const styles: any = {

}

export default withStyles(styles)(NavBar)