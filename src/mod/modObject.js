/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Collapse, Card, CardBody, CardFooter } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import { decodeObjectDesc, filterObjectName } from './utils';

// Utility Functions used by the Mod Component

function withoutDeps(decodedDescription, uuid, version, filteredName) {
    return (
        <Card className="rain-container-color border-0">
            <CardBody>
                <div className="row">
                    <div className="col-xl">
                        <ReactMarkdown source={decodedDescription} />
                    </div>
                </div>
            </CardBody>

            <CardFooter className="rain-container-color border-0">
                <div className="col-md rain-download-container">
                    <div className="container-fluid row">
                        <div className="col-md-auto">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNBNAaMQAAAF6SURBVGhD7dYxTgNBDAXQHAk6RAMcgAoJUeQENJyAZkXNUVAOsnda5CgfbX7+eGYVB8mbKV6BM2P7RxqFzTRNqcliJrLYYhiGyYzjeBHoz3OZLLZIG+DSi7NaEFn0pA/AA153z6Eet3d7PIf3AFn0cGO1xDn+LYAaHomD8B4gi54eoFEPUNIagBdg6s5cD1BSW4AH8w8R/l7aB/eZLHqWDk4fgO9DVB9Z9EQNjuoji56owVF9ZNETNTiqz0mBH1mJGmp4cI3qYa43wLy5Rw01PcDB2QEent5caqjBYHVHUT1MD6CGzamhpgc4CA+ghrSoBVJ3TA/wsv3Ye//8OqKGKViA75dgHuYz3hNOCriw2gCgljZLFwcOUPqXBnXsmz9A6SAaf//sXLy4OtMC83iPkvUEUB+a1gBRSgFub+6PoI4vfj0B+GDtEQPfU2da8CPmvoDP4XoD8Hmm7ngwT/VS1hMAjwGFLP4ecfoA+EHIShYzkcVMZDGPafMLOH67FTQeqH8AAAAASUVORK5CYII=" alt="" />
                        </div>

                        <div className="col-md">
                            <a href={process.env.REACT_APP_CDN_IP + '/download-mod/' + uuid + "/" + filteredName + "_" + version + ".zip"}>
                                <h2 className="rain-title rain-text-overflow rain-text-square">Download Version {version}</h2>
                            </a>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

function dependencyObject(name, summary, uuid, version, filteredName) {
    return (
        <div key={'dep_' + uuid} className="container-fluid rain-deps-container-color">
            <div className="col-xl">
                <h4 className="rain-text-square">{name}</h4>
                <h5 className="rain-default-text">{summary}</h5>
                <div className="row">
                    <div className="col-md">
                        <a href={process.env.REACT_APP_CDN_IP + '/download-mod/' + uuid + "/" + filteredName + "_" + version + ".zip"}>
                            <h5 className="rain-title rain-text-overflow rain-text-square">Download Version {version}</h5>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

function tabsObject(decodedDescription, lengthArray, dependenciesHTML, uuid, version, filteredName) {
    return (
        <Tabs defaultActiveKey={1} id="description-download-tabs">
            <Tab eventKey={1} title="Description">
                <Card className="rain-container-color border-0">
                    <CardBody>
                        <div className="row">
                            <div className="col-xl">
                                <ReactMarkdown source={decodedDescription} />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Tab>
            <Tab eventKey={2} title="Download">
                <Card className="rain-container-color border-0 pt-3">
                    <div className="container-fluid">
                        {(() => {
                            if (lengthArray > 1) {
                                return (<h4 className="rain-default-text py-2"><b>This mod requires the following dependencies to work:</b></h4>)
                            } else {
                                return (<h4 className="rain-default-text py-2"><b>This mod requires the following dependency to work:</b></h4>)
                            }
                        })()}

                        {dependenciesHTML}
                    </div>

                    <CardFooter className="rain-container-color border-0">
                        <div className="col-md rain-download-container">
                            <div className="container-fluid row">
                                <div className="col-md-auto">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNBNAaMQAAAF6SURBVGhD7dYxTgNBDAXQHAk6RAMcgAoJUeQENJyAZkXNUVAOsnda5CgfbX7+eGYVB8mbKV6BM2P7RxqFzTRNqcliJrLYYhiGyYzjeBHoz3OZLLZIG+DSi7NaEFn0pA/AA153z6Eet3d7PIf3AFn0cGO1xDn+LYAaHomD8B4gi54eoFEPUNIagBdg6s5cD1BSW4AH8w8R/l7aB/eZLHqWDk4fgO9DVB9Z9EQNjuoji56owVF9ZNETNTiqz0mBH1mJGmp4cI3qYa43wLy5Rw01PcDB2QEent5caqjBYHVHUT1MD6CGzamhpgc4CA+ghrSoBVJ3TA/wsv3Ye//8OqKGKViA75dgHuYz3hNOCriw2gCgljZLFwcOUPqXBnXsmz9A6SAaf//sXLy4OtMC83iPkvUEUB+a1gBRSgFub+6PoI4vfj0B+GDtEQPfU2da8CPmvoDP4XoD8Hmm7ngwT/VS1hMAjwGFLP4ecfoA+EHIShYzkcVMZDGPafMLOH67FTQeqH8AAAAASUVORK5CYII=" alt="" />
                                </div>

                                <div className="col-md">
                                    <a href={process.env.REACT_APP_CDN_IP + '/download-mod/' + uuid + "/" + filteredName + "_" + version + ".zip"}>
                                        <h2 className="rain-title rain-text-overflow rain-text-square">Download Version {version}</h2>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </Tab>
        </Tabs>
    )
}

// End Utility Functions

// Begin RainMod Object

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

    generateCollapse(object, flag) {

        if (object !== null && object !== '') {

            var filteredName = filterObjectName(object.name);

            var decodedDescription = decodeObjectDesc(object.desc);

            // Checks flag if dependencies are valid or not.
            if (flag === false) {
                // Return a tabless mod information box if object does not require any dependencies.
                return withoutDeps(decodedDescription, object.uuid, object.version, filteredName)
            } else if (flag === true) {
                // Moves to generating dependency information if dependencies were found.
                var dependenciesHTML = [];

                for (var i = 0; i < Object.keys(object.dependencies).length; i++) {
                    var filteredDName = filterObjectName(object.dependencies[i].name);

                    dependenciesHTML.push(dependencyObject(object.dependencies[i].name,
                        object.dependencies[i].summary, object.dependencies[i].id, object.dependencies[i].version,
                        filteredDName))
                }

                return tabsObject(decodedDescription, object.dependencies.length, dependenciesHTML, object.uuid, object.version, filteredName)
            }
        } else {
            // Returns failsafe if object failed to parse correctly.
            return (<div>
                <Card className="rain-container-color border-0">
                    <CardFooter className="rain-container-color border-0">
                        <div className="col-md rain-download-container">
                            <div className="container-fluid row">
                                <h5 className="rain-default-text">Object failed to load.</h5>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>)
        }
    }

    render() {
        var filteredName = filterObjectName(this.state.modObject.name);

        return (<div className="container-fluid rounded rain-text-overflow rain-container-color">
            <div className="row mb-3">
                <div className="col-auto">
                    <img className="mt-2 rain-icon" src={this.state.modObject.img_url} alt={this.state.modObject.name} />

                    {(() => {
                        if (this.state.modObject.item_type === "Library") {
                            return (<img className="mt-2 rain-category-icon rain-mod-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNBNAaMQAAAKLSURBVHhe7ZZBjtswEAT3nL/kDTnkljflkJ87MwIpRFJzKZrEthBUAXVgmZIHJGD44/V64YOUEX3CYtQhjwiLUYc84oWItyjbl1Ne36Vsfxw52owXIt6ibF9OeX2Xsv1x5GgzXoi48evn74Pfv/3Y/Ic/aXlsmvq+fHHS+/7y2OPI0Wa8EHGjdyABFyLI0Wa8EHGjdRBfDRdS4ELeI0ebcScW8iejdSGtXqmfn620+plP5lj6k7mKmGnKnVhwIQuImabcicWB2Qup3H2+ta83Rxn/MeRIM+7E4gAX8h450ow7sdjoHUCl93mlta/21udnWnOV8R9DjjTjTiw2uJA5cqQZd2JxoHcxrX7m7vOtfb05yviPIUeacScWB7iQ98iRZtyJxVt/e89W1GdppdXPfDLHf/+3lwtZQMw05YWIG70L+Spac5RxH0eONuOFiBtcyHvkaDNeiLhRD6J1IMHSn4z6vnxx0vv+8tjjyNFmvBBxo3cgARciyNFmvBDxFmX7csrru5TtjyNHm/FCxFuU7cspr+9Stj+OHG1GWIw65BFhMeqQR4TFqEMeERajDnlEWIw65BFhMeqQR4TFqEMeERajDnlEWIw65BFhMeqQR5QRfcqIPmVEnzKiTxnRp4zoU0b0KSP6lBF9yog+ZUSfMqJPGdGnjOhTRvQpI/qUEX3KiD5lRJ8yok8Z0aeM6FNG9Ckj+pQRfcqIPmVEnzKiTxnRp4zoU0b0KSP6lBF9yog+ZUSfMqJPGdGnjOhTRvQpI/qUEX3KiD5lRJ8yok8Z0aeM6FNG9Ckj+pQRfcqIPmVEnzKiTxnRp4zoU0b0KSP6lBF9yog+ZUSfMqJPGdGnjOhTRvQpI7p8ffwFBpl0nL2T7jYAAAAASUVORK5CYII="
                                alt="lib" />)
                        }
                    })()}
                </div>

                <div className="col-md-10">

                    <h2 className="rain-title rain-text-square pt-2" onClick={this.toggle}>{(() => {
                        if (this.state.modObject.name !== '') {
                            return <a id={filteredName}> {this.state.modObject.name} </a>
                        } else {
                            return "Name Not Available"
                        }
                    })()}</h2>

                    <h5 className="rain-default-text rain-font-15">{this.state.modObject.summary}</h5>
                    <p className="rain-text-font rain-font-10">by {(() => {
                        if (this.state.modObject.author !== '') {
                            return this.state.modObject.author
                        } else {
                            return 'Unknown'
                        }
                    })()}</p>
                </div>

                {(() => {
                    if (this.state.modObject !== null && this.state.modObject !== '') {
                        return (<div className="container-fluid">
                            <Collapse isOpen={this.state.collapse}>
                                {(() => {
                                    if (!Array.isArray(this.state.modObject.dependencies) || !this.state.modObject.dependencies.length) {
                                        return this.generateCollapse(this.state.modObject, false)
                                    } else {
                                        return this.generateCollapse(this.state.modObject, true)
                                    }
                                })()}
                            </Collapse>
                        </div>)
                    }
                })()}
            </div>
        </div>
        )
    }
}

// End RainMod Object

export default RainMod;