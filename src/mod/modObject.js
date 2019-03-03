/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';
import { Collapse } from 'reactstrap';
import { filterObjectName, generateCollapse } from './utils';

class RainMod extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            modObject: "",
            collapse: false,
        };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    componentDidMount() {
        if (this.props.object) {
            this.setState({ modObject: this.props.object })
        } else {
            this.setState({ modObject: "" })
        }
    }

    render() {
        var filteredName = filterObjectName(this.state.modObject.name);

        return (
            <div className="card flex-sm-row mb-2" style={{ backgroundColor: '#222321' }}>
                <div className="col-sm-auto mt-2 mb-2">
                    <img className="mod-icon" src={this.state.modObject.img_url} alt={this.state.modObject.name} />

                    {(() => {
                        if (this.state.modObject.item_type === "Library") {
                            return (<img className="mod-category-icon mod-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNBNAaMQAAAKLSURBVHhe7ZZBjtswEAT3nL/kDTnkljflkJ87MwIpRFJzKZrEthBUAXVgmZIHJGD44/V64YOUEX3CYtQhjwiLUYc84oWItyjbl1Ne36Vsfxw52owXIt6ibF9OeX2Xsv1x5GgzXoi48evn74Pfv/3Y/Ic/aXlsmvq+fHHS+/7y2OPI0Wa8EHGjdyABFyLI0Wa8EHGjdRBfDRdS4ELeI0ebcScW8iejdSGtXqmfn620+plP5lj6k7mKmGnKnVhwIQuImabcicWB2Qup3H2+ta83Rxn/MeRIM+7E4gAX8h450ow7sdjoHUCl93mlta/21udnWnOV8R9DjjTjTiw2uJA5cqQZd2JxoHcxrX7m7vOtfb05yviPIUeacScWB7iQ98iRZtyJxVt/e89W1GdppdXPfDLHf/+3lwtZQMw05YWIG70L+Spac5RxH0eONuOFiBtcyHvkaDNeiLhRD6J1IMHSn4z6vnxx0vv+8tjjyNFmvBBxo3cgARciyNFmvBDxFmX7csrru5TtjyNHm/FCxFuU7cspr+9Stj+OHG1GWIw65BFhMeqQR4TFqEMeERajDnlEWIw65BFhMeqQR4TFqEMeERajDnlEWIw65BFhMeqQR5QRfcqIPmVEnzKiTxnRp4zoU0b0KSP6lBF9yog+ZUSfMqJPGdGnjOhTRvQpI/qUEX3KiD5lRJ8yok8Z0aeM6FNG9Ckj+pQRfcqIPmVEnzKiTxnRp4zoU0b0KSP6lBF9yog+ZUSfMqJPGdGnjOhTRvQpI/qUEX3KiD5lRJ8yok8Z0aeM6FNG9Ckj+pQRfcqIPmVEnzKiTxnRp4zoU0b0KSP6lBF9yog+ZUSfMqJPGdGnjOhTRvQpI7p8ffwFBpl0nL2T7jYAAAAASUVORK5CYII="
                                alt="lib" />)
                        }
                    })()}
                </div>

                <div className="col-sm m-sm-1 rounded ror-color-1">

                    <h2 className="card-title ror-font-square ror-shadow-1" onClick={this.toggle}>{(() => {
                        if (this.state.modObject.name !== '') {
                            return <a className="ror-hover" id={filteredName}> {this.state.modObject.name} </a>
                        } else {
                            return "Name Not Available"
                        }
                    })()}</h2>

                    <h5 className="card-text general-font mod-desc">{this.state.modObject.summary}</h5>

                    <div className="row">
                        <div className="col-sm-auto">
                            <p className="ror-font mod-footer ror-shadow-3">by {(() => {
                                if (this.state.modObject.author !== '') {
                                    return this.state.modObject.author
                                } else {
                                    return 'Unknown'
                                }
                            })()}</p>
                        </div>
                        <div className="col-sm-auto">
                            <p className="ror-font mod-footer ror-shadow-3">Latest Version: {(() => {
                                if (this.state.modObject.author !== '') {
                                    return this.state.modObject.version
                                } else {
                                    return '0.1.0'
                                }
                            })()}</p>
                        </div>
                        <div className="col-sm">
                            <p className="ror-font mod-footer ror-shadow-3">Last Updated: WIP</p>
                        </div>
                    </div>

                    {(() => {
                        if (this.state.modObject !== null && this.state.modObject !== '') {
                            return (<Collapse isOpen={this.state.collapse}>
                                {(() => {
                                    if (!Array.isArray(this.state.modObject.dependencies) || !this.state.modObject.dependencies.length) {
                                        return generateCollapse(this.state.modObject, false)
                                    } else {
                                        return generateCollapse(this.state.modObject, true)
                                    }
                                })()}
                            </Collapse>)
                        }
                    })()}

                </div>


            </div>
        )
    }
}

export default RainMod;