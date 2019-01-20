'use strict';

var JsDAVFile = require("../jsDAV/lib/DAV/file");
var JsDAVCollection = require("../jsDAV/lib/DAV/collection");
var JsDAVExceptions = require("../jsDAV/lib/shared/exceptions"); 

var Node = {
    name: '',
    path: '',

    try: function(action, callback) {
        try {
            var p = action.call(this);
            if (p && p.then instanceof Function) {
                /* if function returns a promise, then resolve it */
                p.then(callback.bind(null, null), callback);
            } else {
                /* invoke callback immediately */
                callback(null, p);
            }
        } catch(err) {
            /* catch any synchronous error */
            callback(err);
        }
    },

    delete: function(callback) {
        this.try(function() {
            checkFunction(this.deleteAsync);
            return this.deleteAsync().then(checkResult);
        }, callback);
    },

    exists: function(callback) {
        this.try(function() {
            if (this.existsAsync) {
                return this.existsAsync();
            } else if (this.getLastModifiedAsync) {
                return this.getLastModifiedAsync().then(function(date) {
                   return (date != null);
                });
            } else {
                return true;
            }
        }, callback);
    },

    getLastModified: function(callback) {
        this.try(function() {
            return (this.getLastModifiedAsync) ? this.getLastModifiedAsync().then(checkResult) : new Date;
        }, callback);
    },

    getName: function() {
        return this.name;
    },

    setName: function(name, callback) {
        this.try(function() {
            checkFunction(this.setNameAsync);
            return this.setNameAsync(name).then(checkResult);
        }, callback);
    },
};

var Collection = {
    childExists: function(name, callback) {
        this.try(function() {
            if (this.childExistsAsync) {
                return this.childExistsAsync(name);
            } else if (this.getChildAsync) {
                return this.getChildAsync(name).then(function(child) {
                    return (child != null);
                });
            } else if (this.getChildrenAsync) {
                return this.getChildrenAsync(name).then(function(children) {
                    for (var i = 0; children && i < children.length; i++) {
                        if (children[i].getName() === name) {
                            return true;
                        }
                    }
                    return false;
                });
            } else {
                return false;
            }
        }, callback);
    },

    createDirectory: function(name, callback) {
        this.try(function() {
            checkFunction(this.createDirectoryAsync);
            return this.createDirectoryAsync(name).then(checkResult);
        }, callback);
    },

    createFile: function(name, data, type, callback) {
        this.try(function() {
            checkFunction(this.createFileAsync);
            return this.createFileAsync(name, data, type).then(checkResult);
        }, callback);
    },

    getChild: function(name, callback) {
        this.try(function() {
            if (this.getChildAsync) {
                return this.getChildAsync(name).then(checkResult);
            } else if (this.getChildrenAsync) {
                return this.getChildrenAsync(name).then(function(children) {
                    for (var i = 0; children && i < children.length; i++) {
                        if (children[i].getName() === name) {
                            return children[i];
                        }
                    }
                }).then(checkResult);
            } else {
                checkResult(null);
            }
        }, callback);
    },

    getChildren: function(callback) {
        this.try(function() {
            return (this.getChildrenAsync) ? this.getChildrenAsync().then(checkResult) : [];
        }, callback);
    },
};

var File = {
    get: function(callback) {
        this.try(function() {
            checkFunction(this.getAsync);
            return this.getAsync().then(checkResult);
        }, callback);
    },

    getContentType: function(callback) {
        this.try(function() {
            return (this.getContentTypeAsync) ? this.getContentTypeAsync().then(checkResult) : null;
        }, callback);
    },

    getETag: function(callback) {
        this.try(function() {
            return (this.getETagAsync) ? this.getETagAsync().then(checkResult) : null;
        }, callback);
    },

    getSize: function(callback) {
        this.try(function() {
            return (this.getSizeAsync) ? this.getSizeAsync().then(checkResult) : 0;
        }, callback);
    },

    put: function(data, type, callback) {
        this.try(function() {
            checkFunction(this.putAsync);
            return this.putAsync(data, type).then(checkResult);
        }, callback);
    },
};

function checkResult(object) {
    if (object == null) {
        throw new JsDAVExceptions.FileNotFound("No such file or directory");
    }
    return object;
}

function checkFunction(func) {
    if (!func) {
        throw new JsDAVExceptions.Forbidden("Permission denied");
    }
}

exports.File = JsDAVFile.extend(Node, File);
exports.Collection = JsDAVCollection.extend(Node, Collection);

exports.BadRequest = JsDAVExceptions.BadRequest;
exports.Conflict = JsDAVExceptions.Conflict;
exports.AceConflict = JsDAVExceptions.AceConflict;
exports.Locked = JsDAVExceptions.Locked;
exports.ConflictingLock = JsDAVExceptions.ConflictingLock;
exports.FileNotFound = JsDAVExceptions.FileNotFound;
exports.Forbidden = JsDAVExceptions.Forbidden;
exports.NeedPrivileges = JsDAVExceptions.NeedPrivileges;
exports.InsufficientStorage = JsDAVExceptions.InsufficientStorage;
exports.InvalidResourceType = JsDAVExceptions.InvalidResourceType;
exports.LockTokenMatchesRequestUri = JsDAVExceptions.LockTokenMatchesRequestUri;
exports.MethodNotAllowed = JsDAVExceptions.MethodNotAllowed;
exports.NotAuthenticated = JsDAVExceptions.NotAuthenticated;
exports.NotImplemented = JsDAVExceptions.NotImplemented;
exports.PaymentRequired = JsDAVExceptions.PaymentRequired;
exports.PreconditionFailed = JsDAVExceptions.PreconditionFailed;
exports.NoAbstract = JsDAVExceptions.NoAbstract;
exports.NotRecognizedPrincipal = JsDAVExceptions.NotRecognizedPrincipal;
exports.NotSupportedPrivilege = JsDAVExceptions.NotSupportedPrivilege;
exports.ReportNotImplemented = JsDAVExceptions.ReportNotImplemented;
exports.RequestedRangeNotSatisfiable = JsDAVExceptions.RequestedRangeNotSatisfiable;
exports.ServiceUnavailable = JsDAVExceptions.ServiceUnavailable;
exports.UnsupportedMediaType = JsDAVExceptions.UnsupportedMediaType;
exports.UnprocessableEntity = function(msg, extra) {
    this.code    = 422;
    this.type    = "UnprocessableEntity";
    this.message = msg || this.type;
};
exports.UnprocessableEntity.prototype = new JsDAVExceptions.jsDAV_Exception();
