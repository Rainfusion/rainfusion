/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import RainMod from './modObject';

function ModObject(uuid, name, author, img_url, summary, desc, last_update, version, item_type, dependencies) {
    this.uuid = uuid;
    this.name = name;
    this.author = author;
    this.img_url = img_url;
    this.summary = summary;
    this.desc = desc;
    this.last_update = last_update;
    this.version = version;
    this.item_type = item_type;
    this.dependencies = dependencies;
}

class ModDisplay extends React.Component {

    constructor() {
        super();

        this.state = {
            modTable: [],
            modHTML: [],
            keepLoading: true,
        }
    }

    getItems = async (pagedata) => {

        const request = new Request(process.env.REACT_APP_CDN_IP + '/api/mods?count=' + pagedata, { method: 'GET', headers: { "Origin": process.env.REACT_APP_ORIGIN_URL }, mode: 'cors', cache: 'default' });
        const response = await fetch(request);
        const data = await response.json();

        var flag = false;

        var modObjects = Object.keys(data).map(
            key => {
                if (data[key][0] === "EOD") {
                    flag = true;
                }

                return new ModObject(data[key][0], data[key][1].name, data[key][1].author, data[key][1].img_url, data[key][1].summary, data[key][1].description, new Date(data[key][1].last_update).toUTCString(), data[key][1].version, data[key][1].item_type, data[key][1].dependencies);
            }
        )

        if (flag) {
            modObjects.pop();
            this.setState({ modTable: modObjects });
            this.setState({ keepLoading: false });
        } else {
            this.setState({ modTable: modObjects });
        }
    }

    render() {
        if (this.state.keepLoading) {
            this.state.modTable.map(mod => {
                this.state.modHTML.push(<RainMod key={mod.uuid} object={mod} />)
            });
        }

        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.getItems.bind(this)}
                hasMore={this.state.keepLoading}
                loader={< h1 className="rain-text-square" key="loading" > Loading Mods ... </h1>}>

                <div id="mods">
                    {this.state.modHTML}
                </div>

            </InfiniteScroll >
        );
    }
}

export default ModDisplay;