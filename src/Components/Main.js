import React, { Component } from "react";
import Header from "./Header/Header";
import BurgerBuilder from "./BurgerBuilder/BurguerBuilder";
import Orders from "./Orders/Orders";
import Checkout from "./Orders/Checkout/Checkout";
import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Auth/Auth";
import Logout from "./Auth/Logout";
import { authCheck } from "../redux/authActionCreators";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authCheck: () => dispatch(authCheck()),
    }
}

class Main extends Component {
    componentDidMount() {
        this.props.authCheck();
    }

    render() {
        let routes = null;
        if (this.props.token === null) {
            routes = (
                <Routes>
                    <Route path="/login" element={<Auth />} />
                    <Route path="/" element={<Navigate replace to="/login" />} />
                </Routes>
            )
        } else {
            routes = (
                <Routes>
                    <Route path="/" index element={<BurgerBuilder />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/login" element={<Navigate replace to="/" />} />
                </Routes>
            )
        }
        return (
            <div>
                <Header />
                <div className="container">
                    {routes}
                </div>
            </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);