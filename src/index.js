/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';

import ModDisplay from './mod/modDisplay';
import LauncherInfo from './launcher';

ReactDOM.render(<ModDisplay />, document.getElementById('mods-root'));
ReactDOM.render(<LauncherInfo />, document.getElementById('launcher-root'));
