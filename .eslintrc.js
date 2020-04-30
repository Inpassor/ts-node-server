'use strict';

module.exports = {
    env: {
        node: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',  // Allows for the use of imports
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
        'no-empty': 'off',
        'no-prototype-builtins': 'off',
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2020,
                project: 'tsconfig.json',
                sourceType: 'module',  // Allows for the use of imports
            },
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
                'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
            ],
            rules: {
                // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
                // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
                'no-empty': 'off',
                'no-prototype-builtins': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
            },
        },
    ]
};
