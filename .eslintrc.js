module.exports = {
    "env": {
        "browser": true,
        "node" : true,
        "es6": true,
        "jasmine" : true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        // "indent"         : ["error", 2],
        "linebreak-style": ["error", "unix"],
        "quotes"         : ["error", "double"],
        "semi"           : ["error", "never"],
        "no-unused-vars" : 0,
        "no-fallthrough" :
          ["error", { "commentPattern": "break[\\s\\w]*omitted" }],
    }
};