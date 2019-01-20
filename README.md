# jsdav-promise
A promise interface implementing virtual file and folder with jsDAV

## Usage - ES5 ##

The module exports two classes: 'File' and 'Collection'. Extend them to create virtual files and folders.

```js
var JsDAVPromise = require('jsdav-promise');
var File = JsDAVPromise.File;
var Collection = JsDAVPromise.Collection;

var SomeFolder = Collection.extend(
{
    initialize: function(name) {
        this.name = name;
        this.path = '/' + name;
    },

    createDirectoryAsync: function(name) {
	/* ... */
    },

    deleteAsync: function() {
	/* ... */
    },

    getChildrenAsync: function() {
	/* ... */
    },

    setNameAsync: function(name) {
	/* ... */
    },    
});

var SomeFile = File.extend(
{    
    initialize: function(folder, name) {
        this.name = name;
	this.path = folder.path + '/' + name;
    },

    getAsync: function() {
	    /* ... */
    },

    putAsync: function(data, type) {
	    /* ... */
    },

    deleteAsync: function() {
	    /* ... */
    },

    getSizeAsync: function() {
	    /* ... */
    },

    getETagAsync: function() {
	    /* ... */
    },

    getContentTypeAsync: function() {
	    /* ... */
    },

    getLastModifiedAsync: function() {
	    /* ... */
    },

    setNameAsync: function(name) {
	    /* ... */
    },
});
```

## Usage - ES7 ##

```js
const { File, Collection } = require('jsdav-promise/es6');

class SomeFolder extends Collection {
    constructor(name) {
        super();
        this.name = name;
        this.path = '/' + name;
    }

    async createDirectoryAsync(name) {
	    /* ... */
    }

    async deleteAsync() {
	    /* ... */
    }

    async getChildrenAsync() {
	    /* ... */
    }

    async setNameAsync(name) {
	    /* ... */
    }
}

class SomeFile extends File {    
    constructor(folder, name) {
        this.name = name;
	    this.path = folder.path + '/' + name;
    }

    async getAsync() {
	    /* ... */
    }

    async putAsync(data, type) {
	    /* ... */
    }

    async deleteAsync() {
	    /* ... */
    }

    async getSizeAsync() {
	    /* ... */
    }

    async getETagAsync() {
	    /* ... */
    }

    async getContentTypeAsync() {
	    /* ... */
    }

    async getLastModifiedAsync() {
	    /* ... */
    }

    async setNameAsync(name) {
	    /* ... */
    }
}
```

### Methods for both File and Collection ###

#### deleteAsync() ####

Delete the file or folder. Should return a promise of true.

If not implemented, a Forbidden error will be thrown when the client attempts to perform the operation.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

### getLastModifiedAsync() ####

Get the last-modified date of the file or folder. Should return a promise of a Date object.

If not implemented, the current date is returned.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

### getName() ###

Get the name of the file or folder. Should return a string.

The default implementation return this.name.

### setNameAsync(name) ###

Change the name of the file or folder. Should return a promise of true.

If not implemented, a Forbidden error will be thrown when the client attempts to perform the operation.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

### Methhods for Collection ###

#### childExistsAsync(name) ####

Check if a child node exists. Should return a promise of a boolean.

If not implemented, getChildAsync() or getChildrenAsync() will be called to determine the child's existence.

#### createDirectoryAsync(name) ####

Create a child folder. Should return a promise of true. If the child already exists, promise should reject with a Conflict error.

If not implemented, a Forbidden error will be thrown when the client attempts to perform the operation.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

#### createFileAsync(name, data, type) ####

Create a file in the folder containing the data given. Should return a promise of true. If the file already exists, promise should reject with a Conflict error.

If not implemented, a Forbidden error will be thrown when the client attempts to perform the operation.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

#### getChildAsync(name) ####

Get a child by name. Should return a promise of a object extending either File or Collection--or null if the child does not exists.

If not implemented, getChildren() will be called to find the child.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

#### getChildrenAsync() ####

Get a list of all child nodes. Should return a promise of an array of objects extending either File or Collection.

If not implemented, an empty array is returned.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

### Methhods for File ###

#### getAsync() ####

Get the content of a virtual file. Should return a promise of a Buffer object.

If not implemented, a Forbidden error will be thrown when the client attempts to perform the operation.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

#### getContentTypeAsync() ####

Get the MIME type of a virtual file. Should return a promise of a string.

If not implemented, null is returned.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

#### getETagAsync() ####

Get the E-tag of a virtual file. Should return a promise of a string.

If not implemented, null is returned.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

#### getSizeAsync() ####

Get the E-tag of a virtual file. Should return a promise of a number.

If not implemented, 0 is returned.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

#### putAsync(data, type) ####

Replace the contents of a virtual file. Should return a promise of true.

If not implemented, a Forbidden error will be thrown when the client attempts to perform the operation.

If the promise resolves to null or undefined, a FileNotFound error will be thrown.

### Exceptions ###

For convenience sake, the module re-exports the following error classes from jsDAV:

* BadRequest (400)
* Conflict (409)
* AceConflict
* Locked (423)
* ConflictingLock
* FileNotFound (404)
* Forbidden (403)
* NeedPrivileges (403)
* InsufficientStorage (507)
* InvalidResourceType
* LockTokenMatchesRequestUri
* MethodNotAllowed (405)
* NotAuthenticated (401)
* NotImplemented (501)
* PaymentRequired (402)
* PreconditionFailed (412)
* NoAbstract
* NotRecognizedPrincipal
* NotSupportedPrivilege
* ReportNotImplemented
* RequestedRangeNotSatisfiable (416)
* ServiceUnavailable (503)
* UnsupportedMediaType (415)
* UnprocessableEntity (422)
