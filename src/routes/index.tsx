import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../app/pages/Home';
import Create from '../app/pages/Create';

class Routes extends Component<any, any> {
    render() {
        return (
            <Switch>
                <div style={{ backgroundColor: '#bfbfbf' }}>
                    <Route exact path="/" component={Home} />
                    <Route path="/create" component={Create} />
                </div>
            </Switch>
        );
    }
}

export default Routes;
