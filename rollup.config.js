//
// Rollup configure file
//

import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import sourcemaps from 'rollup-plugin-sourcemaps';

const paths = {
    root: '/',
    source: {
        root: './src/',
        modules: './src/modules/',
    },
    dist: {
        root: './dist/',
    },
};

let fileName,
    Configure;

fileName = process.env.NODE_ENV === 'development' ? 'me' : 'me.min';

Configure = {
    format: 'umd', // 'amd', 'cjs', 'es', 'iife', 'umd'
    moduleName: 'Me',
    moduleId: 'Me',
    entry: `${paths.source.root}index.js`,
    dest: `${paths.dist.root}${fileName}.js`,
    sourceMap: true,
    plugins: [
        babel(),
        sourcemaps(),
    ],
};

if (process.env.NODE_ENV === 'production') {
    Configure.plugins.push(uglify());
}

export default Configure;
