var es5 = require('./index');

for (var key in es5) {
    exports[key] = es5[key];
}

function Collection() {};
Collection.prototype = es5.Collection;
Collection.new = function() {
    return new (Function.prototype.bind.apply(this, [ null ].concat(arguments)));
};

function File() {};
File.prototype = es5.File;
File.new = function() {
    return new (Function.prototype.bind.apply(this, [ null ].concat(arguments)));
};

exports.File = File;
exports.Collection = Collection;
