/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

export function filterObjectName(string) {
    if (string !== undefined && string !== '') {
        return string.toLowerCase().replace(/[|&;$%@"'<>()+,/-]/g, "").replace(/[0-9]/g, '').match(/\S+/g).join("_")
    } else {
        return 'incorrect_name'
    }
}

export function decodeObjectDesc(encoded) {
    var decoded = "";

    try {
        decoded = atob(encoded)
    } catch (error) {
        decoded = "Description Not Available"
    };

    return decoded
}