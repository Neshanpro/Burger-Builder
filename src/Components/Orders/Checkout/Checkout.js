import React, { Component } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import Spinner from "../../Spinner/Spinner";
import { resetIngredients } from "../../../redux/actionCreators";

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchaseable: state.purchaseable
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetIngredients: () => dispatch(resetIngredients())
    }
}

class Checkout extends Component {
    state = {
        values: {
            deliveryAddress: "",
            phone: "",
            paymentType: "Cash On Delivery"
        },
        isLoading: false,
        isModalOpen: false,
        modalMsg: ""
    }

    inputChangeHandler = e => {
        this.setState({
            values: {
                ...this.state.values,
                [e.target.name]: e.target.value
            }
        })
    }

    submitHandler = () => {
        this.setState({ isLoading: true })
        const order = {
            ingredients: this.props.ingredients,
            customer: this.state.values,
            price: this.props.totalPrice,
            orderTime: new Date()
        }
        axios.post("https://burger-builder-6f6a7-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json", order)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: "Order Placed Successfully"
                    })
                    this.props.resetIngredients();
                } else {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: "Something in the way! Hmmmmmm!!!"
                    })
                }
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                    isModalOpen: true,
                    modalMsg: "Something in the way! Hmmmmmm!!!"
                })
            })
    }

    render() {
        let form = (<div>
            <h4 style={{
                border: "1px solid grey",
                boxShadow: "1px 1px #888888",
                borderRadius: "5px",
                padding: "20px"
            }}>Payment: {this.props.totalPrice}</h4>
            <form style={{
                border: "1px solid grey",
                boxShadow: "1px 1px #888888",
                borderRadius: "5px",
                padding: "20px"
            }}>
                <textarea name="deliveryAddress" value={this.state.values.deliveryAddress} className="form-control" placeholder="Your Address" onChange={(e) => this.inputChangeHandler(e)}></textarea>
                <br />
                <input name="phone" className="form-control" value={this.state.values.phone} placeholder="Your Phone Number" onChange={(e) => this.inputChangeHandler(e)} />
                <br />
                <select name="paymentType" className="form-control" value={this.state.values.paymentType} onChange={(e) => this.inputChangeHandler(e)}>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                    <option value="Bkash">Bkash</option>
                </select>
                <br />
                <Link to={-1}>
                    <Button style={{ backgroundColor: "#D70F64" }} className="mr-auto" onClick={this.submitHandler} disabled={!this.props.purchaseable} >Place Order</Button>
                </Link>
                <Link to={-1}>
                    <Button style={{ backgroundColor: "#666362" }} className="ml-1" >Cancel</Button>
                </Link>
            </form>
        </div>)
        return (
            < div >
                {this.state.isLoading ? <Spinner /> : form}
                <Modal isOpen={this.state.isModalOpen} onClick={<Link to={-1} />}>
                    <ModalBody>
                        <p> {this.state.modalMsg} </p>
                    </ModalBody>
                </Modal>
            </div >
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Checkout);