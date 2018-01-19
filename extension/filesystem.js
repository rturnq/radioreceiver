/**
 * Filesystem helper.
 * @constructor
 */
function FileSystem() {
    
    var QUOTA = 20 * 1024 * 1024;
    
    function getFileSystem(callback, error = handleError) {
        if (window.filesystem) {
            callback(window.filesystem);
        } else {
            var handleFileSystem = function (fs) {
                window.filesystem = fs;
                callback(fs);
            }
            
            if (navigator.webkitPersistentStorage) {
                navigator.webkitPersistentStorage.requestQuota(QUOTA, function (grant) {
                    webkitRequestFileSystem(PERSISTENT, grant, handleFileSystem, error);
                }, error);
            } else if (webkitStorageInfo) {
                webkitStorageInfo.requestQuota(PERSISTENT, QUOTA, function (grant) {
                    webkitRequestFileSystem(PERSISTENT, grant, handleFileSystem, error);
                }, error);
            } else {
                throw new Exception('File system API is not supported');
            }
        }
    }

    function handleError(err) {
        alert(err);
    }

    function createEntry(name, callback, error = handleError) {
        getFileSystem(function (fs) {
            fs.root.getFile(name, {
                create: true,
                exclusive: true
            }, callback, error);
        }, error);
    }

    function openEntry(name, callback, error = handleError) {
        getFileSystem(function (fs) {
            fs.root.getFile(name, {
                create: false,
                exclusive: true
            }, callback, error);
        }, error);
    }


    return  {
        createEntry: createEntry,
        openEntry: openEntry
    };
}