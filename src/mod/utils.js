/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Card, CardBody, CardFooter } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

// Filters mod names using regex for parsing.
export function filterObjectName(string) {
    if (string !== undefined && string !== '') {
        return string.toLowerCase().replace(/[|&;$%@"'<>()+,/-]/g, "").replace(/[0-9]/g, '').match(/\S+/g).join("_")
    } else {
        return 'incorrect_name'
    }
}

// Converts Base64 descriptions to Plain Text.
export function decodeObjectDesc(encoded) {
    var decoded = "";

    try {
        decoded = atob(encoded)
    } catch (error) {
        decoded = "Description Not Available"
    };

    return decoded
}

// Generates the full collapse for the mod object.
export function generateCollapse(object, flag) {

    if (object !== null && object !== '') {

        // Filter Object Name
        var filteredName = filterObjectName(object.name);

        // Decode description from Base64.
        var decodedDescription = decodeObjectDesc(object.desc);

        // Check if dependencies exist or not.
        if (flag === false) {
            // Return a tabless mod information box if object does not require any dependencies.
            // COMPLETE: IMPROVED RESPONSIVE LAYOUT
            return generateDefault(decodedDescription, object.uuid, object.version, filteredName)
        } else if (flag === true) {
            // Moves to generating dependency information if dependencies were found.
            // TODO: IMPROVE RESPONSIVE LAYOUT
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
        // COMPLETE: IMPROVED RESPONSIVE LAYOUT
        return (<Card className="border-0" style={{ backgroundColor: '#1B1C1A' }}>
            <CardFooter className="border-0">
                <div className="row">
                    <div className="col-sm">
                        <h5 className="ror-font">Object failed to load.</h5>
                    </div>
                </div>
            </CardFooter>
        </Card>)
    }
}

// Generates a default description and download dropdown without dependencies.
// COMPLETE: IMPROVED RESPONSIVE LAYOUT
function generateDefault(decodedDescription, uuid, version, filteredName) {
    return (
        <Card className="border-0" style={{ backgroundColor: '#1B1C1A' }}>
            <CardBody>
                <ReactMarkdown source={decodedDescription} />
            </CardBody>

            <CardFooter className="border-0 rounded mb-2" style={{ backgroundColor: '#222321' }}>
                <div className="row">
                    <div className="col-sm-auto d-none d-md-block">
                        <img className="mod-download-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNBNAaMQAAAF6SURBVGhD7dYxTgNBDAXQHAk6RAMcgAoJUeQENJyAZkXNUVAOsnda5CgfbX7+eGYVB8mbKV6BM2P7RxqFzTRNqcliJrLYYhiGyYzjeBHoz3OZLLZIG+DSi7NaEFn0pA/AA153z6Eet3d7PIf3AFn0cGO1xDn+LYAaHomD8B4gi54eoFEPUNIagBdg6s5cD1BSW4AH8w8R/l7aB/eZLHqWDk4fgO9DVB9Z9EQNjuoji56owVF9ZNETNTiqz0mBH1mJGmp4cI3qYa43wLy5Rw01PcDB2QEent5caqjBYHVHUT1MD6CGzamhpgc4CA+ghrSoBVJ3TA/wsv3Ye//8OqKGKViA75dgHuYz3hNOCriw2gCgljZLFwcOUPqXBnXsmz9A6SAaf//sXLy4OtMC83iPkvUEUB+a1gBRSgFub+6PoI4vfj0B+GDtEQPfU2da8CPmvoDP4XoD8Hmm7ngwT/VS1hMAjwGFLP4ecfoA+EHIShYzkcVMZDGPafMLOH67FTQeqH8AAAAASUVORK5CYII=" alt="" />
                    </div>

                    <div className="col-sm">
                        <a href={process.env.REACT_APP_CDN_IP + '/download-mod/' + uuid + "/" + filteredName + "_" + version + ".zip"}>
                            <h2 className="mt-1 mod-title ror-font-square mod-download">Download Version {version}</h2>
                        </a>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

// Generates the HTML for a dependency from its object.
// COMPLETE: IMPROVED RESPONSIVE LAYOUT
function dependencyObject(name, summary, uuid, version, filteredName) {
    return (
        <div key={'dep_' + uuid} style={{ backgroundColor: '#222321' }}>
            <div className="col-sm">
                <h4 className="ror-font-square">{name}</h4>
                <h5 className="general-text mod-desc">{summary}</h5>
                <div className="row">
                    <div className="col-sm">
                        <a href={process.env.REACT_APP_CDN_IP + '/download-mod/' + uuid + "/" + filteredName + "_" + version + ".zip"}>
                            <h5 className="mod-title ror-font-square">Download Version {version}</h5>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Generates the tabbing object for the different parts of the collapse.
// COMPLETE: IMPROVED RESPONSIVE LAYOUT
function tabsObject(decodedDescription, lengthArray, dependenciesHTML, uuid, version, filteredName) {
    return (
        <Tabs defaultActiveKey={1} id="description-download-tabs">
            <Tab eventKey={1} title="Description">
                <Card className="border-0" style={{ backgroundColor: '#1B1C1A' }}>
                    <CardBody>
                        <ReactMarkdown source={decodedDescription} />
                    </CardBody>
                </Card>
            </Tab>
            <Tab eventKey={2} title="Download">
                <Card className="border-0 mt-1" style={{ backgroundColor: '#1B1C1A' }}>
                    {(() => {
                        if (lengthArray > 1) {
                            return (<h4 className="ror-font-square dep-title mb-3"><b>This mod requires the following dependencies to work:</b></h4>)
                        } else {
                            return (<h4 className="ror-font-square dep-title mb-3"><b>This mod requires the following dependency to work:</b></h4>)
                        }
                    })()}

                    {dependenciesHTML}

                    <CardFooter className="border-0">
                        <div className="row">
                            <div className="col-sm-auto d-none d-md-block">
                                <img className="mod-download-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNBNAaMQAAAF6SURBVGhD7dYxTgNBDAXQHAk6RAMcgAoJUeQENJyAZkXNUVAOsnda5CgfbX7+eGYVB8mbKV6BM2P7RxqFzTRNqcliJrLYYhiGyYzjeBHoz3OZLLZIG+DSi7NaEFn0pA/AA153z6Eet3d7PIf3AFn0cGO1xDn+LYAaHomD8B4gi54eoFEPUNIagBdg6s5cD1BSW4AH8w8R/l7aB/eZLHqWDk4fgO9DVB9Z9EQNjuoji56owVF9ZNETNTiqz0mBH1mJGmp4cI3qYa43wLy5Rw01PcDB2QEent5caqjBYHVHUT1MD6CGzamhpgc4CA+ghrSoBVJ3TA/wsv3Ye//8OqKGKViA75dgHuYz3hNOCriw2gCgljZLFwcOUPqXBnXsmz9A6SAaf//sXLy4OtMC83iPkvUEUB+a1gBRSgFub+6PoI4vfj0B+GDtEQPfU2da8CPmvoDP4XoD8Hmm7ngwT/VS1hMAjwGFLP4ecfoA+EHIShYzkcVMZDGPafMLOH67FTQeqH8AAAAASUVORK5CYII=" alt="" />
                            </div>

                            <div className="col-sm">
                                <a href={process.env.REACT_APP_CDN_IP + '/download-mod/' + uuid + "/" + filteredName + "_" + version + ".zip"}>
                                    <h2 className="mt-1 mod-title ror-font-square mod-download">Download Version {version}</h2>
                                </a>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </Tab>
        </Tabs>
    )
}