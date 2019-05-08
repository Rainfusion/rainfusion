/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';

import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

import download from './images/download.png';
import discord from './images/discord.png';
import docs from './images/docs.png'
import submit from './images/upload.png';
import update from './images/update.png';

class DownloadIcon extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false,
            modloaderVersion: "",
            launcherDownload: ""
        };
    }

    componentDidMount() {
        this.getLauncher()
    }

    getLauncher = async () => {

        const requestL = new Request(process.env.REACT_APP_CDN_IP + '/launcher-info', { method: 'GET', headers: { "Origin": process.env.REACT_APP_ORIGIN_URL }, mode: 'cors', cache: 'default' });
        const responseL = await fetch(requestL);
        const dataL = await responseL.text();

        const requestG = new Request(process.env.REACT_APP_CDN_IP + '/game-info', { method: 'GET', headers: { "Origin": process.env.REACT_APP_ORIGIN_URL }, mode: 'cors', cache: 'default' });
        const responseG = await fetch(requestG);
        const dataG = await responseG.text();

        var dataGSplit = dataG.split("\n");
        var dataLSplit = dataL.split("\n");

        this.setState({ modloaderVersion: dataGSplit[0] });
        this.setState({ launcherDownload: dataLSplit[1] });
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <div className="d-none d-sm-block">
                <div className="flex-sm-row">
                    <a href={this.state.launcherDownload}><input type="image" id="DownloadPopover" alt="download"
                        src={download}></input></a>

                    <Popover trigger="hover" placement="auto" isOpen={this.state.popoverOpen} target="DownloadPopover" toggle={this.toggle}>
                        <PopoverHeader>Download Modloader</PopoverHeader>
                        <PopoverBody>Latest Version: {this.state.modloaderVersion}</PopoverBody>
                    </Popover>
                </div>

            </div>
        );
    }
}

class SubmitIcon extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <div>
                <div className="flex-sm-row">
                    <a href={process.env.REACT_APP_SUBMIT_URL}><input type="image" id="SubmitPopover" alt="submit"
                        src={submit}></input></a>

                    <Popover trigger="hover" placement="auto" isOpen={this.state.popoverOpen} target="SubmitPopover" toggle={this.toggle}>
                        <PopoverBody>Submit your mod!</PopoverBody>
                    </Popover>
                </div>

            </div>
        );
    }
}

class UpdateIcon extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <div>
                <div className="flex-sm-row">
                    <a href={process.env.REACT_APP_UPDATE_URL}><input type="image" id="UpdatePopover" alt="update"
                        src={update}></input></a>

                    <Popover trigger="hover" placement="auto" isOpen={this.state.popoverOpen} target="UpdatePopover" toggle={this.toggle}>
                        <PopoverBody>Update your mod!</PopoverBody>
                    </Popover>
                </div>

            </div>
        );
    }
}

class DiscordIcon extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <div>
                <div className="flex-sm-row">
                    <a href={process.env.REACT_APP_DISCORD_URL}><input type="image" id="DiscordPopover" alt="discord"
                        src={discord}></input></a>

                    <Popover trigger="hover" placement="auto" isOpen={this.state.popoverOpen} target="DiscordPopover" toggle={this.toggle}>
                        <PopoverBody>Join the Discord</PopoverBody>
                    </Popover>
                </div>

            </div>
        );
    }
}

class DocsIcon extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <div>
                <div className="flex-sm-row">
                    <a href={process.env.REACT_APP_DOCS_URL}><input type="image" id="DocsPopover" alt="docs"
                        src={docs}></input></a>

                    <Popover trigger="hover" placement="auto" isOpen={this.state.popoverOpen} target="DocsPopover" toggle={this.toggle}>
                        <PopoverBody>RoRML Documentation</PopoverBody>
                    </Popover>
                </div>
            </div>
        );
    }
}

class LauncherInfo extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="d-flex flex-row justify-content-center">
                    <h1 className="ror-font-square ror-shadow-2 title text-center d-none d-sm-block">Rainfusion</h1>
                </div>

                <div className="d-flex flex-row justify-content-around">
                    <DownloadIcon />
                    <SubmitIcon />
                    <DocsIcon />
                    <UpdateIcon />
                    <DiscordIcon />
                </div >
            </div >
        )
    }
}

export default LauncherInfo;