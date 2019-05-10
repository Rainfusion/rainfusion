/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import RainMod from './modObject';

function ModObject(uuid, name, author, summary, desc, version, item_type, dependencies, tags) {
    this.uuid = uuid;
    this.name = name;
    this.author = author;
    this.summary = summary;
    this.desc = desc;
    this.version = version;
    this.item_type = item_type;
    this.dependencies = dependencies;
    this.tags = tags;
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

    getDependency = async (uuid, version) => {
        const request = new Request(process.env.REACT_APP_CDN_IP + '/api/mod/' + uuid, {
            method: 'GET',
            headers: {
                "Origin": process.env.REACT_APP_ORIGIN_URL
            },
            mode: 'cors',
            cache: 'default'
        });

        const response = await fetch(request);

        if (response.status === 404) {
            return "";
        } else {
            var object = await response.json();
            return new ModObject(object[0], object[1].name, object[1].author, object[1].summary, object[1].description, version, object[1].item_type, object[1].dependencies, object[1].tags)
        }
    }

    getItems = async (pagedata) => {
        const request = new Request(process.env.REACT_APP_CDN_IP + '/api/mods?count=' + pagedata, {
            method: 'GET',
            headers: {
                "Origin": process.env.REACT_APP_ORIGIN_URL
            },
            mode: 'cors',
            cache: 'default'
        });

        const response = await fetch(request);
        const data = await response.json();
        var flag = false;

        var modObjects = Object.keys(data).map(async (key) => {
            if (data[key][0] === "00000000-0000-0000-0000-000000000000") {
                flag = true;
            }

            var mod = new ModObject(data[key][0], data[key][1].name, data[key][1].author, data[key][1].summary, data[key][1].description, data[key][1].version, data[key][1].item_type, data[key][1].dependencies, data[key][1].tags);

            if (data[key][0] !== "00000000-0000-0000-0000-000000000000") {
                for (let index = 0; index < mod.dependencies.length; index++) {
                    const element = mod.dependencies[index];
                    const version = mod.dependencies[index][1].version;
                    var temp = "";

                    if (mod.dependencies === null) {
                        temp = ""
                    } else {
                        temp = await this.getDependency(element[0], version);
                    }

                    if (temp === "") {
                        mod.dependencies = [];
                    } else {
                        mod.dependencies = [];
                        mod.dependencies.push(temp);
                    }
                }
            }

            return mod;
        })

        var objects = await modObjects;
        var temp = [];

        for (let index = 0; index < objects.length; index++) {
            const element = await objects[index];
            temp.push(element);
        }

        if (flag) {
            temp.pop();
            this.setState({ modTable: temp });
            this.setState({ keepLoading: false });
        } else {
            this.setState({ modTable: temp });
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
                loader={<h1 className="ror-font-square text-center" key="loading"> Loading Mods ... </h1>}>

                <div id="mods">
                    {this.state.modHTML}
                </div>

            </InfiniteScroll>
        );
    }
}

export default ModDisplay;