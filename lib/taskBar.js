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
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING w
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Creates an HTML based task bar for holding Nina.UI.Dialog widgets and Nina.UI.Notification widgets.
* @constructor
* @name taskBar
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.Widget
* @requires Nina
* @requires Nina.UI
* @requires Nina.UI.Style.taskBar
* @memberOf Nina.UI
*/
Nina.UI.taskBar = function (args) {
    "use strict";
    // there can be only one
    if (Nina.UI.widgets.taskBar !== undefined) {
        return;
    }
    args = args || { };
    var self = Nina.beget(Nina.UI.Widget);
    self.publicMembers = {};
    self.style = args.style || Nina.UI.Style.taskBar();
    self.type = 'taskBar';
    self.items = [];
    self.activeItem = undefined;
    self.hoverItem = undefined;
    self.events = {
        /**
        * Occurs after the Nina.UI.taskBar is initialized.
        * @event
        * @name init
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        init: self.addInitalEvents(args.init),
        /**
        * Occurs when the task bar is clicked.
        * @event
        * @name click
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        click: self.addInitalEvents(args.click),
        /**
        * Occurs when the mouse moves over the task bar.
        * @event
        * @name mouseover
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        mouseover: self.addInitalEvents(args.mouseover),
        /**
        * Occurs when the mouse leaves the task bar.
        * @event
        * @name mouseout
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        mouseout: self.addInitalEvents(args.mouseout),
        /**
        * Occurs when an item is clicked.
        * @event
        * @name itemClick
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        itemClick: self.addInitalEvents(args.itemClick),
        /**
        * Occurs when the mouse moves over an item.
        * @event
        * @name itemMouseover
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        itemMouseover: self.addInitalEvents(args.itemMouseover),
        /**
        * Occurs when the mouse moves off of an item.
        * @event
        * @name itemMouseout
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        itemMouseout: self.addInitalEvents(args.itemMouseout),
        /**
        * Occurs when an item is added to the collection.
        * @event
        * @name addItem
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        addItem: self.addInitalEvents(args.addItem),
        /**
        * Occurs when an item is removed from the collection.
        * @event
        * @name removeItem
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        removeItem: self.addInitalEvents(args.removeItem),
        /**
        * Occurs when the task bar's rect is updated.
        * @event
        * @name updateRect
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        updateRect: self.addInitalEvents(args.updateRect),
        /**
        * Occurs when the task bar's style is updated.
        * @event
        * @name updateStyle
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        updateStyle: self.addInitalEvents(args.updateStyle)
    };
    self.createPublicMembers = function () {
        /**
        * The items belonging to the task bar.
        * @field
        * @name items
        * @memberOf Nina.UI.taskBar
        * @public
        * @returns {Native.Array} Array of Nina.UI.taskBarItem.
        */
        self.publicMembers.items = self.items;
        /**
        * The rect of the task bar.
        * @field
        * @name rect
        * @memberOf Nina.UI.taskBar
        * @public
        * @returns {Nina.UI.Rect} Nina.UI.taskBar instance.
        */
        self.publicMembers.rect = self.rect;
        /**
        * The type of widget. Returns taskBar.
        * @field
        * @name type
        * @type Native.String
        * @memberOf Nina.UI.taskBar
        */
        self.publicMembers.type = self.type;
        /**
        * The session unique id of the taskBar.
        * @field
        * @name id
        * @type Native.String
        * @memberOf Nina.UI.taskBar
        */
        self.publicMembers.id = self.id;
        /**
        * Applies the current Nina.UI.Style.taskBar to the Nina.UI.taskBar.
        * @function
        * @name redraw
        * @memberOf Nina.UI.taskBar
        * @public
        * @returns {Nina.UI.taskBar} Nina.UI.taskBar.
        */
        self.publicMembers.redraw = self.redraw;
        /**
        * Adds an item to the Nina.UI.taskBar.
        * @function
        * @name add
        * @memberOf Nina.UI.taskBar
        * @param {Native.HTMLElement} [obj] The object refrence to add to the item.
        * @param {Native.Function} [click] The function to execute when the item is clicked.
        * @param {Native.Function|Native.HTMLElement|Native.String|Native.Array} [text] The object to set as the title of the item.
        * @param {Native.Function} [over] The function to execute when the mouse moves over the item.
        * @param {Native.Function} [out] The function to execute when the mouse moves off the item.
        * @returns {Nina.UI.taskBarItem} Item added to the Nina.UI.taskBar.
        */
        self.publicMembers.add = self.add;
        /**
        * Adds an item to the Nina.UI.taskBar.
        * @function
        * @name remove
        * @memberOf Nina.UI.taskBar
        * @param {Nina.UI.taskBarItem} [obj] The item to remove from the Nina.UI.taskBar.
        * @returns {Nina.UI.taskBar} Item added to the Nina.UI.taskBar.
        */
        self.publicMembers.remove = self.remove;
        return self;
    };
    self.init = function () {
        // raise init event
        if (self.raiseEvent('init', undefined, undefined, undefined)) { return self; }
        // create an id for this widget
        self.id = Nina.UI.widgetIdCount++;
        Nina.UI.widgets.taskBar = self;
        // setup rect
        args.rect = args.rect || {};
        self.publicMembers.rect = self.rect = {
            x: args.rect.x || self.style.rect.x,
            y: args.rect.y || self.style.rect.y,
            w: args.rect.w || self.style.rect.w,
            h: args.rect.h || self.style.rect.h
        };
        // create bar
        self.taskBar = this.createElement('div');
        self.noSelect([self.taskBar]);
        self.taskBar.style.position = 'absolute';
        self.taskBar.style.overflow = 'hidden';
        self.taskBar.onclick = function (e) {
            if (self.raiseEvent('click', e, self.taskBar, [])) { return self; }
        };
        self.taskBar.onmouseover = function (e) {
            if (self.raiseEvent('mouseover', e, self.taskBar, [])) { return self; }
        };
        self.taskBar.onmouseout = function (e) {
            if (self.raiseEvent('mouseout', e, self.taskBar, [])) { return self; }
        };
        window.document.body.appendChild(self.taskBar);
        window.addEventListener('resize', self.browserResize, true);
        self.createPublicMembers();
        return self.setRect().stylize();
    };
    self.browserResize = function () {
        self.setRect();
        return;
    };
    self.setRect = function (rect) {
        if (self.raiseEvent('updateRect', undefined, undefined, undefined)) { return self; }
        rect = rect || self.rect;
        var s = self.style,
            items,
            x,
            l;
        self.updateElementRect(self.taskBar,
            self.client().w,
            rect.h,
            rect.x,
            rect.y + self.client().h - rect.h - s.border.size);
        items = self.items;
        for (x = 0; items.length > x; x++) {
            l = items[x].element;
            l.firstChild.innerHTML = '';
            self.appendObj(l.firstChild, items[x].text);
            self.updateElementRect(items[x].element,
                s.item.rect.w,
                s.item.rect.h,
                s.item.rect.x,
                s.item.rect.y);
            self.clipText(l.firstChild, s.item.rect.w - s.item.padding.r - s.item.padding.l);
        }
        return self;
    };
    self.stylize = function () {
        if (self.raiseEvent('updateStyle', undefined, undefined, undefined)) { return self; }
        var s = self.style,
            items,
            x,
            l;
        self.taskBar.style.background = s.background;
        self.taskBar.style.borderTop = self.border(s.border);
        items = self.items;
        for (x = 0; items.length > x; x++) {
            l = items[x].element;
            l.firstChild.style.padding = self.pad(s.item.padding);
            l.style.fontFamily = s.item.font;
            l.style.color = s.item.textColor;
            l.style.background = s.item.background;
            l.style.border = self.border(s.item.border);
            l.style.marginLeft = s.item.spacing + 'px';
        }
        return self;
    };
    self.redraw = function () {
        return self.stylize().setRect();
    };
    self.add = function (obj, click, text, over, out) {
        var l,
            item = {
                obj: obj,
                click: click,
                text: text,
                mouseover: over,
                mouseout: out,
                element: self.createElement('div')
            };
        if (self.raiseEvent('addItem', obj, item, [])) { return self; }
        l = item.element;
        l.onclick = function (e) {
            if (self.raiseEvent('itemClick', e, l, [])) { return self; }
            self.activeItem = item;
            if (!item.click) { return self; }
            item.click.apply(self, [e, l]);
            return self;
        };
        l.onmouseover = function (e) {
            if (self.raiseEvent('itemMouseover', e, l, [])) { return self; }
            l.style.background = self.style.item.hover.background;
            l.style.color = self.style.item.hover.textColor;
            self.hoverItem = item;
            if (!item.mouseover) { return self; }
            item.mouseover.apply(self, [e, l]);
            return self;
        };
        l.onmouseout = function (e) {
            if (self.raiseEvent('itemMouseout', e, l, [])) { return self; }
            l.style.background = self.style.item.background;
            l.style.color = self.style.item.textColor;
            if (!item.mouseout) { return self; }
            item.mouseout.apply(self, [e, l]);
            return self;
        };
        l.appendChild(self.createElement('span'));
        self.noSelect([l]);
        self.noSelect([l.firstChild]);
        l.style.display = 'inline-block';
        l.style.cursor = 'pointer';
        l.firstChild.style.whiteSpace = 'nowrap';
        l.style.overflow = 'hidden';
        self.taskBar.appendChild(l);
        self.items.push(item);
        self.redraw();
        return item;
    };
    self.remove = function (item) {
        var items = self.items,
            x;
        for (x = 0; items.length > x; x++) {
            if (items[x] === item) {
                if (self.raiseEvent('removeItem', items[x], item.element, [])) { return self; }
                self.taskBar.removeChild(item.element);
                self.items.splice(x, 1);
            }
        }
        return self.setRect().stylize();
    };
    self.init();
    // return publicMembers
    return self.publicMembers;
};