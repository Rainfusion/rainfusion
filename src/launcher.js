/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';

class LauncherInfo extends React.Component {

    constructor() {
        super();

        this.state = {
            modloaderVersion: "",
            launcherDownload: ""
        }
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

    render() {
        return (
            <div className="container-fluid col">
                <div className="row">

                    {/* Modloader Download Container */}
                    <div className="col-lg-8 rain-download-container">
                        <div className="container-fluid rounded rain-container-launcher">
                            <div className="row">
                                <div className="col-xs-2 px-2 py-2"><img className="rain-mod-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNBNAaMQAAAI2SURBVGhD7ZcxTsNAEEV9KAQUFEg0FFAAEhUNiIaaFi6QU3AEGk4TQUXDKcBrzRs549k4tjeJvfhJv8h6d/Y/FBKl6Mv359tvyAgovPQmO7ERCVXQR+r1J1sxmadcLM6q3L5fbjWnd8crgVmsDZnnXp4y/MFiQiC1hiPz3DIpk61Ym1CytyDIXLdMyvw7seRCIPPdMikzWrH75U8V4LW310tMTGqkR+a7ZeqZrNjH4qSKVyokBh/j7IvNmcWGwj8tUGj59bSSw4OjKjF4bs9Z4VlsKDJXQYxCYUsIRRGw4Tn7WZ/FUiNztRhBMGwJYf3q8dUNz1+er6twjtezWCpkrhYjiPFWYj0c8cLzmBhzZrGu2I93oBixYg8351XKEW543lfMQs9yxmZkKybnGrSJhaPrwr5UYlDO2AzZ3yAbMS7iY5gCxH7BhqMhvI6tc451O4f7COsx4XLGZsj+xkXZiNkL2t6KsYJ23f6BiD1nM4vFkP2NwYjEEo6G2IKsezIhnJ/F+orZL2h7AUVssba3Yl2mfo799hyJCXX+gs5WDOS8Yi+0hdrE6nu91GeHxIRAanZHziv2YltsMmIgcxRbwCZWNLZus3UhkHmKV6aeyYiBzFW8UkOycyGQ+YpXbkj2JgZyj+KV7JK9C4Hcp3hlu2Q0YiD3Kl7pdRmdEMj9ild+XUYrBtJD8STqGb0QSB/Fk6lnMmIgvZTJC4H0U7IRA/uzJ0bvnx37IlsxCwKTF7HsVqwo/gCZV8AX1C4nngAAAABJRU5ErkJggg=="
                                    alt="download" />
                                </div>
                                <div className="col-xs-10 px-2 pt-1">
                                    <a href={this.state.launcherDownload}>
                                        <h2 className="rain-text-square rain-font-20 rain-outline">Download Modloader</h2>
                                        <p className="rain-text-font rain-font-12">Latest Version: {this.state.modloaderVersion}</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Discord Container */}
                    <div className="col-lg-4 pb-1 p-0">
                        <div className="container-fluid rounded rain-container-discord">
                            <div className="d-flex justify-content-end">
                                <div className="col-xs-11 pt-1">
                                    <a href={process.env.REACT_APP_DISCORD_URL}>
                                        <h2 className="rain-text-square rain-font-20 rain-outline">Join the Discord</h2>
                                    </a>
                                </div>
                                <div className="col-xs-1 px-2 py-2"><img className="rain-mod-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS40E0BoxAAAASNJREFUaEPtlkFuwzAMBPv/T/QJ/U9PPeeeswsDszYiRaBZF4kp7AA6KKRFDiBQ+Wj5/Lot66qC+qX9MdOJff/cl3VVRf2jszOdWLWrF7FdzWnF2E+HxaphsWpYbITGa7uiB1/xZ9+u6ywWa+GPy/bAsz1Nex7l0lhM/LdIhOplsZig3suh/GEspvFMnZej+kexWDQ02sLaE+7I5meHiMU4fwhpHYQ7CHcQHkJaiMU4d0j2amXzBekhFuPct0M7IRbj3LdDOyEWix5oxaO8lqPfKX4Ui4mogXaMR0RjPiskLFYNi1XDYtWYV+yv4/TqzCsmsg/r1UFrYjFx1auZ7QudnWnFqkD/Q0irB/0PIa0ueHQQrgseHYTro+Gixc/1eRS7Lb8QnXPWSGNb4AAAAABJRU5ErkJggg=="
                                    alt="download" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-2">

                    {/* Documentation Container */}
                    <div className="col-lg-8 rain-download-container">
                        <div className="container-fluid rounded rain-container-form">
                            <div className="row">
                                <div className="col px-2 pt-1">
                                    <a href={process.env.REACT_APP_DOCS_URL}>
                                        <h2 className="rain-text-square rain-font-20 rain-outline rain-text-overflow">Modding Documentation</h2>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Container */}
                    <div className="col-lg-4 p-0">
                        <div className="container-fluid rounded rain-container-form">
                            <div className="row">
                                <div className="col px-2 pt-1">
                                    <h2 className="text-lg-right text-xs-left rain-text-square rain-font-20">
                                        <a className="rain-outline" href={process.env.REACT_APP_SUBMIT_URL}>Submit</a> or <a className="rain-outline" href={process.env.REACT_APP_UPDATE_URL}>Update</a> your mod!
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LauncherInfo;