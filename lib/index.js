'use strict';

var JsDAVFile = require("../../jsDAV/lib/DAV/file");
var JsDAVCollection = require("../../jsDAV/lib/DAV/collection");
var JsDAVExceptions = require("../../jsDAV/lib/shared/exceptions"); 

var Node = {
    name: '',
    path: '',

    delete: function(callback) {
        if (this.deleteAsync) {
            this.deleteAsync().then(function(state) {
                checkResult(state);
                callback(null);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.delete.apply(this, arguments);
        }
    },
                         
    exists: function(callback) {
        if (this.existsAsync) {
            this.existsAsync().then(function(state) {
                callback(null, state);
            }).catch(function(err) {
                callback(err);
            });
        } else if (this.getLastModifiedAsync) {
            this.getLastModifiedAsync().then(function(date) {
                callback(null, date != null);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.exists(callback);
        }
    },

    getLastModified: function(callback) {
        if (this.getLastModifiedAsync) {
            this.getLastModifiedAsync().then(function(date) {
                checkResult(date);
                callback(null, date);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getLastModified.apply(this, arguments);
        }
    },
    
    getName: function() {
        return this.name;
    },

    setName: function(name, callback) {
        if (this.setNameAsync) {
            var self = this;
            this.setNameAsync(name).then(function(state) {
                checkResult(state);
                self.name = name;
                callback(null);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.setName.apply(this, arguments);
        }
    },
};

var Collection = {
    childExists: function(name, callback) {
        if (this.childExistsAsync) {
            this.childExistsAsync(name).then(function(state) {
                callback(null, state);
            }).catch(function(err) {
                callback(err);
            });
        } else if (this.getChildAsync) {
            this.getChildAsync(name).then(function(child) {
                callback(null, child != null);
            }).catch(function(err) {
                callback(null, false);
            });
        } else if (this.getChildrenAsync) {
            this.getChildrenAsync(name).then(function(children) {
                var found = false;
                for (var i = 0; children && i < children.length; i++) {
                    if (children[i].getName() === name) {
                        found = true;
                        break;
                    }
                }
                callback(null, found);
            }).catch(function(err) {
                callback(null, false);
            });
        } else {
            JsDAVCollection.childExists.apply(this, arguments);
        }
    },
    
    createDirectory: function(name, callback) {
        if (this.createDirectoryAsync) {
            this.createDirectoryAsync(name).then(function(state) {
                checkResult(state);            
                callback(null);
            }).catch(function(err) {
                console.log(err.stack);
                callback(err);
            });
        } else {
            JsDAVCollection.createFile.apply(this, arguments);
        }
    },
    
    createFile: function(name, data, type, callback) {
        if (this.createFileAsync) {
            this.createFileAsync(name, data, type).then(function(state) {
                checkResult(state);
                callback(null);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.createFile.apply(this, arguments);
        }
    },
    
    getChild: function(name, callback) {
        if (this.getChildAsync) {
            this.getChildAsync(name).then(function(child) {
                checkResult(child);
                callback(null, child);
            }).catch(function(err) {
                callback(err);
            });
        } else if (this.getChildrenAsync) {
            this.getChildrenAsync(name).then(function(children) {
                var child = null;
                for (var i = 0; children && i < children.length; i++) {
                    if (children[i].getName() === name) {
                        child = children[i];
                        break;
                    }
                }
                checkResult(child);
                callback(null, child);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.getChild.apply(this, arguments);
        }
    },
    
    getChildren: function(callback) {
        if (this.getChildrenAsync) {
            this.getChildrenAsync().then(function(list) {
                checkResult(list);            
                callback(null, list);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.getChildren.apply(this, arguments);
        }
    },
};

var File = {
    get: function(callback) {
        if (this.getAsync) {
            this.getAsync().then(function(buffer) {
                checkResult(buffer);
                callback(null, buffer);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.get.apply(this, arguments);
        }
    },

    getContentType: function(callback) {
        if (this.getContentTypeAsync) {
            this.getContentTypeAsync().then(function(type) {
                checkResult(type);            
                callback(null, type);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getContentType.apply(this, arguments);
        }
    },

    getETag: function(callback) {
        if (this.getETagAsync) {
            this.getETagAsync().then(function(etag) {
                checkResult(etag);
                callback(null, etag);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getETag.apply(this, arguments);
        }
    },

    getSize: function(callback) {
        if (this.getSizeAsync) {
            this.getSizeAsync().then(function(size) {
                checkResult(size);
                callback(null, size);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getSize.apply(this, arguments);
        }
    },

    put: function(data, type, callback) {
        if (this.putAsync) {
            this.putAsync(data, type).then(function(etag) {
                checkResult(etag);
                callback(null, etag);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.put.apply(this, arguments);
        }
    },
};

function checkResult(object) {
    if (object == null) {
        throw new JsDAVExceptions.FileNotFound("No such file or directory");
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

