const themeConfig = require('../tailwind.config.cjs');

module.exports = {
    ...themeConfig,
    theme: {
        ...themeConfig.theme,
        extend: {
            ...themeConfig.theme.extend,
            colors: {
                ...themeConfig.theme.extend.colors,
                primary: {
                    DEFAULT: '#16665b',
                    light: '#e8f4f1',
                    'dark-light': 'rgb(22 102 91 / 15%)',
                },
                secondary: {
                    DEFAULT: '#2eac97',
                    light: '#e9f7f4',
                    'dark-light': 'rgb(46 172 151 / 15%)',
                },
                warning: {
                    DEFAULT: '#f9b954',
                    light: '#fff7e8',
                    'dark-light': 'rgb(249 185 84 / 15%)',
                },
            },
        },
    },
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', '../src/components/icon/**/*.vue'],
};
