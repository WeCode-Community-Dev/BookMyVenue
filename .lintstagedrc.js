module.exports = {
    // Matches JS/TS files recursively inside the workspace
    '**/*.{js,jsx,ts,tsx}': [
        'eslint --fix',
        'prettier --write'
    ],
    // Matches metadata/layout files recursively
    '**/*.{json,md,html,css}': [
        'prettier --write'
    ]
};
