﻿/*
 * Copyright (c) 2013 Tony Germaneri
 * Permission is hereby granted,  free of charge, to any person 
 * obtaining a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Sends structured JSON requests to a HTTP server running Nina.Core.
* @constructor
* @name ajax
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @requires Nina
* @memberOf Nina
* @param {Native.Object} [args] Request object or an array of request objects.
* @param {Native.Object} [options=undefined] Options and events associated with the request collection.
* @param {Native.String} [args.method] The method to execute on the server.  Should be in the format <namespace>.<class>.<method>. E.g.: Nina.Authentication.Logon.  When in the Nina namespace the namespace can be omitted.
* @param {Native.Array} [args.parameters=undefined] The array of parameters to pass to the method.  Parameters can be of the type String, Number, Boolean, File Input, or an Array or Object of these types.  Files can contain multiple files as defined in the HTML 5 doctype.
* @param {Native.Function} [args.procedure] The procedure to run when the method responds.  The functions signature is (returnData, allReturnDataFromAllRequests).
* @param {Native.Object} [args.context=undefined] The scope that the callback procedure runs in.  This defines the keyword 'this' inside the callback procedure.
* @param {Native.Function} [options.loadstart=undefined] Event occurs once.  Occurs when the request begins.
* @param {Native.Function} [options.progress=undefined] Event occurs zero or more times.  Occurs while sending and loading data.  Signature is (progressEventObject).  The object contains the members loaded, total.
* @param {Native.Function} [options.error=undefined] Event occurs zero or once.  Occurs when progression has failed.
* @param {Native.Function} [options.abort=undefined] Event occurs zero or once.  Occurs when progression is terminated.
* @param {Native.Function} [options.load=undefined] Event occurs zero or once.  Occurs when progression is successful.
* @param {Native.Function} [options.loadend=undefined] Event occurs once.  Occurs when progression has stopped.
* @param {Native.Function} [options.readyStateChange=undefined]  Event occurs two or more times.  Occurs when request is about to be sent and when the request state has changed.
* @param {Native.String} [options.method=POST] The method the request will use.
* @param {Native.String} [options.responderUrl=/responder] The URL the request will use.
* @param {Native.String} [options.contentType='application/x-www-form-urlencoded; charset=utf-8'] The MIME type of the content and the content's encoding separated by ; .
* @param {Native.Boolean} [options.async=true] The asynchronous mode the request will use.  True = asynchronous, false = synchronous.
* @param {Native.Array} [options.headers=undefined] An array of arrays that represent headers. E.g.: [['X-Requested-With','XMLHttpRequest']].
* @param {Native.Boolean} [options.delayRequest=false] Delay the request until the instance method Nina.ajax.beginRequest() is called.
* @example <caption>Create a request for a single method.</caption>
* var foo = Nina.ajax({
*    method: 'Authentication.CreateAccount',
*    parameters: ['Test', '1234'],
*    procedure: function (e) {
*        alert(e.Message);
*    }
* });
* @example <caption>Create a request for two methods.</caption>
* var foo = Nina.ajax([
*    {
*        method: 'Authentication.CreateAccount',
*        parameters: ['Test', '1234'],
*        procedure: function (e) {
*            alert(e.Message);
*        }
*    },
*    {
*        method: 'Authentication.Logon',
*        parameters: ['Test', '1234'],
*        procedure: function (e) {
*            alert(e.Message);
*        }
*    }
* ]);
* @example <caption>Create a request that contains a file and show the progress of the upload.</caption>
* var foo = Nina.ajax({
*    method: 'FileManager.Upload',
*    parameters: ['~\\', document.getElementById('file1')],
*    procedure: function (e) {
*        document.body.innerHTML = e.Message;
*    }
* },
* {
*    progress:function (e) {
*        document.body.innerHTML = Math.round((e.loaded / e.total) * 100) + ' %';
*    }
* });
* @example <caption>Create a request that contains more than one file.</caption>
* var x = Nina.ajax({
*    method: 'FileManager.UploadFiles',
*    parameters: [['~\\','~\\'], [document.getElementById('file1'),document.getElementById('file2')]],
*    procedure: function (e) {
*        showMessage(b, e.Message, t);
*    }
* });
*/
Nina.ajax = function (args, options) {
    "use strict";
    // using this as a reference http://www.w3.org/TR/XMLHttpRequest/
    Nina.assert(args !== undefined, 'Nina.ajax missing parameter.');
    var self = {},
        createRequest,
        parseFiles,
        pushFile,
        writeFileId,
        readyStateChange;
    self.options = options || { };
    createRequest = function () {
        try { return new XMLHttpRequest(); } catch (ignore) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (ignore) {}
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (ignore) {}
        return null;
    };
    parseFiles = function () {
        var x,
            t,
            p,
            fa,
            f,
            y,
            a,
            z;
        for (x = 0; args.length > x; x++) {
            a = args[x];
            for (t = 0; args[x].parameters.length > t; t++) {
                p = args[x].parameters[t];
                if (Nina.isArray(p)) {
                    fa = [];
                    for (z = 0; p.length > z; z++) {
                        f = p[z];
                        if (f.type === 'file') {
                            for (y = 0; f.files.length > y; y++) {
                                pushFile(f.files[y], a);
                                f.files[y].fileId = writeFileId(a.method, a.instanceNumber, z, y);
                                fa.push(f.files[y].fileId);
                            }
                        }
                    }
                    if (fa.length > 0) {
                        args[x].parameters[t] = fa.join("");
                    }
                } else {
                    if (p.type === 'file') {
                        fa = [];
                        for (y = 0; p.files.length > y; y++) {
                            pushFile(p.files[y], a);
                            p.files[y].fileId = writeFileId(a.method, a.instanceNumber, 0, y);
                            fa.push(p.files[y].fileId);
                        }
                        if (fa.length > 0) {
                            args[x].parameters[t] = fa.join("");
                        }
                    }
                }
            }
        }
    };
    /**
    * Begins the request.
    * @function
    * @name beginRequest
    * @memberOf Nina.ajax
    * @public
    * @returns {Nina.ajax} Nina.ajax instance.
    */
    self.beginRequest = function () {
        var x,
            d = new FormData(),
            z;
        self.map = [];
        self.methodInstances = { };
        if (!Nina.isArray(args)) {
            args = [args];
        }
        for (x = 0; args.length > x; x++) {
            // assign this method an instance number in case it occurs more than once
            if (self.methodInstances[args[x].method] === undefined) {
                self.methodInstances[args[x].method] = 0;
            } else {
                self.methodInstances[args[x].method]++;
            }
            self.map.push([
                args[x].method,
                args[x].parameters
            ]);
            // assign the instance number back to the mapper object
            args[x].instanceNumber = self.methodInstances[args[x].method];
        }
        self.id = Nina.createUUID();
        self.request = createRequest();
        self.request.upload.addEventListener('loadstart', function (e) {
            if (typeof self.options.loadstart !== 'function') { return; }
            self.options.loadstart.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('progress', function (e) {
            if (typeof self.options.progress !== 'function') { return; }
            self.options.progress.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('abort', function (e) {
            if (typeof self.options.abort !== 'function') { return; }
            self.options.abort.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('error', function (e) {
            if (typeof self.options.error !== 'function') { return; }
            self.options.error.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('load', function (e) {
            if (typeof self.options.load !== 'function') { return; }
            self.options.load.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('timeout', function (e) {
            if (typeof self.options.timeout !== 'function') { return; }
            self.options.timeout.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('loadend', function (e) {
            if (typeof self.options.loadend !== 'function') { return; }
            self.options.loadend.apply(this, [e]);
        }, false);
        self.request.addEventListener('readystatechange', function (e) {
            if (typeof self.options.readyStateChange !== 'function') {
                readyStateChange();
                return;
            }
            // allow user to abort default readStateChange by returning false.
            if (self.options.readyStateChange.apply(this, [e]) !== false) {
                self.options.readyStateChange();
            }
        }, false);
        self.request.open(self.options.method || 'POST', (self.options.responderUrl || '/responder') + '?' + self.id, self.options.async === false ? false : true);
        self.request.setRequestHeader('Content-Type', self.options.contentType || 'application/x-www-form-urlencoded; charset=utf-8');
        self.request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if (self.options.headers !== undefined) {
            for (x = 0; self.options.headers.length > x; x++) {
                self.request.setRequestHeader(self.options.headers[x][0], self.options.headers[x][1]);
            }
        }
        d.append("id", self.id);
        // parse map looking for file inputs and replace them with IDs
        parseFiles();
        d.append("map", JSON.stringify(self.map));
        for (x = 0; args.length > x; x++) {
            if (args[x].files) {
                for (z = 0; args[x].files.length > z; z++) {
                    d.append(args[x].files[z].fileId, args[x].files[z]);
                }
            }
        }
        self.request.send(d);
        return self;
    };
    pushFile = function (f, a) {
        if (Nina.isArray(a.files)) {
            a.files.push(f);
        } else {
            a.files = [f];
        }
    };
    writeFileId = function (method, instance, z, y) {
        return "file:::" + method + '_' + instance + "_files_" + z + "_" + y;
    };
    readyStateChange = function () {
        var allResults,
            instanceNumber,
            x;
        if (self.request.readyState !== 4 || self.request.status === 0) { return; }
        if (self.request.status !== 200) {
            // an error occurred
            Nina.UI.Widget.log('Nina.ajax request returned a status of ' + self.request.status + ':\n' + self.request.responseText);
            return;
        }
        allResults = JSON.parse(self.request.responseText);
        // separate responses into map collection and call callback functions
        for (x = 0; args.length > x; x++) {
            instanceNumber = self.methodInstances[args[x].method] > 0 ? '_' + args[x].instanceNumber : '';
            args[x].procedure.apply(args[x].context || this, [allResults[args[x].method + instanceNumber], allResults]);
        }
    };
    if (self.options.delayRequest !== false) {
        self.beginRequest();
    }
    return self;
};