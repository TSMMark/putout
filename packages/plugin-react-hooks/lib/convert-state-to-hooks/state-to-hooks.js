'use strict';

const {template} = require('putout');

const buildHooks = template(`
    const [NAME, SETTER] = useState(VALUE);
`);

module.exports = (path) => {
    const {right} = path.node;
    const nodes = [];
    
    for (const {key, value} of right.properties) {
        const {name} = key;
        const NAME = name;
        const SETTER = getSetter(name);
        const VALUE = String(value.value);
        
        nodes.push(buildHooks({
            NAME,
            SETTER,
            VALUE,
        }));
    }
    
    path.replaceWithMultiple(nodes);
};

function getSetter(name) {
    const first = name[0].toUpperCase();
    const newName = [
        first,
        name.slice(1),
    ].join('');
    
    return `set${newName}`;
}

