'use strict';

const {
    expressionStatement,
    isExpressionStatement,
    stringLiteral,
} = require('putout').types;

const store = require('fullstore');

module.exports.report = () => '"use strict" directive should be on top of commonjs file';

module.exports.fix = ({node}) => {
    const {body} = node;
    const useStrict = expressionStatement(stringLiteral('use strict'));
    
    body.unshift(useStrict);
};

module.exports.find = (ast, {push, traverse}) => {
    const isModule = store();
    
    traverse(ast, {
        'ImportDeclaration|ExportNamedDeclaration|ExportDefaultDeclaration'(path) {
            isModule(true);
            path.stop();
        },
        Program: {
            exit(path) {
                const {node} = path;
                const {directives} = node;
                
                const [first] = node.body;
                if (isExpressionStatement(first) && first.expression.value === 'use strict')
                    return;
                
                if (!isModule() && (!directives || !directives.length))
                    push(path);
                
                path.stop();
            },
        },
    });
};

