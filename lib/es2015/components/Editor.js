/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as ScriptLoader from '../ScriptLoader';
import { getTinymce } from '../TinyMCE';
import { initEditor, isTextarea, mergePlugins, uuid } from '../Utils';
import { editorProps } from './EditorPropTypes';
var scriptState = ScriptLoader.create();
var renderInline = function (h, id, tagName) {
    return h(tagName ? tagName : 'div', {
        attrs: { id: id }
    });
};
var renderIframe = function (h, id) {
    return h('textarea', {
        attrs: { id: id },
        style: { visibility: 'hidden' }
    });
};
var initialise = function (ctx) { return function () {
    var finalInit = __assign({}, ctx.$props.init, { selector: "#" + ctx.elementId, plugins: mergePlugins(ctx.$props.init && ctx.$props.init.plugins, ctx.$props.plugins), toolbar: ctx.$props.toolbar || (ctx.$props.init && ctx.$props.init.toolbar), inline: ctx.inlineEditor, setup: function (editor) {
            ctx.editor = editor;
            editor.on('init', function (e) { return initEditor(e, ctx, editor); });
            if (ctx.$props.init && typeof ctx.$props.init.setup === 'function') {
                ctx.$props.init.setup(editor);
            }
        } });
    if (isTextarea(ctx.element)) {
        ctx.element.style.visibility = '';
    }
    getTinymce().init(finalInit);
}; };
export var Editor = {
    props: editorProps,
    created: function () {
        this.elementId = this.$props.id || uuid('tiny-vue');
        this.inlineEditor = (this.$props.init && this.$props.init.inline) || this.$props.inline;
    },
    mounted: function () {
        this.element = this.$el;
        if (getTinymce() !== null) {
            initialise(this)();
        }
        else if (this.element) {
            var doc = this.element.ownerDocument;
            var channel = this.$props.cloudChannel ? this.$props.cloudChannel : 'stable';
            var apiKey = this.$props.apiKey ? this.$props.apiKey : '';
            //var url = "https://cloud.tinymce.com/" + channel + "/tinymce.min.js?apiKey=" + apiKey;
            var url = "https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.13/tinymce.min.js";
            ScriptLoader.load(scriptState, doc, url, initialise(this));
        }
    },
    beforeDestroy: function () {
        if (getTinymce() !== null) {
            getTinymce().remove(this.editor);
        }
    },
    render: function (h) {
        return this.inlineEditor ? renderInline(h, this.elementId, this.$props.tagName) : renderIframe(h, this.elementId);
    }
};
