'use strict';

var JsDAVFile = require("../../jsDAV/lib/DAV/file");
var JsDAVCollection = require("../../jsDAV/lib/DAV/collection");
var JsDAVExceptions = require("jsDAV/lib/shared/exceptions"); 

function verifyResult(object) {
    if (object == null) {
        throw new jsExceptions.FileNotFound("No such file or directory");
    }
}

exports.File = JsDAVFile.extend({
    get: function(callback) {
        if (this.getAsync) {
            this.getAsync().then(function(buffer) {
                verifyResult(buffer);
                callback(null, buffer);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.get.apply(this, arguments);
        }
    },

    put: function(data, type, callback) {
        if (this.putAsync) {
            this.putAsync(data, type).then(function(etag) {
                verifyResult(etag);
                callback(null, etag);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.put.apply(this, arguments);
        }
    },
    
    delete: function(callback) {
        if (this.deleteAsync) {
            this.deleteAsync().then(function(state) {
                verifyResult(state);
                callback(null);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.delete.apply(this, arguments);
        }
    },
                         
    getSize: function(callback) {
        if (this.getSizeAsync) {
            this.getSizeAsync().then(function(size) {
                verifyResult(size);
                callback(null, size);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getSize.apply(this, arguments);
        }
    },
    
    getETag: function(callback) {
        if (this.getETagAsync) {
            this.getETagAsync().then(function(etag) {
                verifyResult(etag);
                callback(null, etag);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getETag.apply(this, arguments);
        }
    },

    getContentType: function(callback) {
        if (this.getContentTypeAsync) {
            this.getContentTypeAsync().then(function(type) {
                verifyResult(type);            
                callback(null, type);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getContentType.apply(this, arguments);
        }
    },
    
    getLastModified: function(callback) {
        if (this.getLastModifiedAsync) {
            this.getLastModifiedAsync().then(function(date) {
                verifyResult(date);            
                callback(null, date);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVFile.getLastModified.apply(this, arguments);
        }
    },
});

exports.Collection = JsDAVCollection.extend(
{
    getChildren: function(callback) {
        if (this.getChildrenAsync) {
            this.getChildrenAsync().then(function(list) {
                verifyResult(list);            
                callback(null, list);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.getChildren.apply(this, arguments);
        }
    },
    
    getChild: function(name, callback) {
        if (this.getChildAsync) {
            this.getChildAsync(name).then(function(child) {
                verifyResult(child);
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
                verifyResult(child);
                callback(null, child);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.getChild.apply(this, arguments);
        }
    },
    
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
            this.createDirectoryAsync(name).then(function() {
                callback(null, state);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.createFile.apply(this, arguments);
        }
    },
    
    createFile: function(name, data, type, callback) {
        if (this.createFileAsync) {
            this.createFileAsync(name, data, type).then(function(state) {
                verifyResult(state);
                callback(null, state);
            }).catch(function(err) {
                callback(err);
            });
        } else {
            JsDAVCollection.createFile.apply(this, arguments);
        }
    }
});
