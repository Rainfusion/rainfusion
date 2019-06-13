/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';
import parse from "html-react-parser";

class ModDisplay extends React.Component {

    constructor() {
        super();

        this.state = {
            modHTML: [],
        }
    }

    getHTML = async () => {
        const request = new Request(process.env.REACT_APP_CDN_IP + '/api/mods/', {
            method: 'GET',
            headers: {
                "Origin": process.env.REACT_APP_ORIGIN_URL
            },
            mode: 'cors',
            cache: 'default'
        });

        const response = await fetch(request);

        if (response.status === 404) {
            this.setState({ modHTML: parse('<h1 className="ror-font-square text-center"> Server Sided Rendering Failure (404) </h1>') });
        } else {
            var object = await response.json();
            this.setState({ modHTML: parse(object) });
        }
    }

    componentDidMount() {
        // Render the server sided HTML
        this.getHTML();
    }

    render() {
        return (
            <div id="mods">
                {this.state.modHTML}
            </div>
        );
    }
}

export default ModDisplay;