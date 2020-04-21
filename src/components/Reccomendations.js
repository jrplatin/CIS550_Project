
import React, { useState, useEffect } from "react";
import PageNavbar from '../components/Header';
import "../style/reccomendations.css"




export default class Reccomendations extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            reccomendationsProfiles: ["Jacob", "Noah", "Max"]
        };


    }

    componentDidMount() {

        this.initial = (this.props.location.pathname.split('/')[2]).toUpperCase()[0];
        this.username = (this.props.location.pathname.split('/')[2]);

        this.setState({ username: this.username });
        this.setState({ initial: this.initial });
    }
    render() {
        return (
            <div>
                <div >
                    <PageNavbar active="Reccomendations" />
                </div>
                <div className="topPic">
                </div>
                <div className="floater">
                    <p className="recTitle">{this.state.username}, based on your activity, we reccomend you check out the following people:</p>
                    <br></br>
                    <div class="container">
                        <div class="row">

                            {this.state.reccomendationsProfiles.map(profile => (
                                <div class="col-sm-4">
                                    <div class="card" style={{ "width": "18rem" }}>
                                        <div style={{ "height": "10vw" }} class="card-header">
                                            <span class="nameSpanForCard">{profile.toUpperCase()[0]}</span>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">{profile}</p>
                                            <button type="button" class="btn btn-warning">Go to</button>
                                        </div>
                                    </div>
                                </div>
                            ))}




                        </div>
                    </div>
                </div>
                <span class="nameSpan">{this.state.initial}</span>

            </div >
        );
    }
}