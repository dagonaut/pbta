(function (window, angular) {
    'use strict';

    function markdownItProvider() {
        var options = {};
        var presetName = 'default';
        var plugins = [];

        function markdownItFactory(markdownIt) {
            var md = markdownIt(presetName, options);
            for (var i = 0; i < plugins.length; i += 1) {
                md.use.apply(md, plugins[i]);
            }
            return md;
        }
        this.config = function configureOptions(preset, opts) {
            if (angular.isString(preset) && angular.isObject(opts)) {
                presetName = preset;
                options = opts;
            } else if (angular.isString(preset)) {
                presetName = preset;
            } else if (angular.isObject(preset)) {
                options = preset;
            }
        };
        this.use = function addPlugin(pluginObject) {
            var options = Array.prototype.slice.call(arguments);
            plugins.push(options);
            return this;
        };
        this.$get = ['$log', function ($log) {
            var constructor = window.markdownit || markdownit;
            if (angular.isFunction(constructor)) {
                return markdownItFactory(constructor);
            }
            $log.error('angular-markdown-it: markdown-it library not loaded.');
        }];
    }

    function markdownItDirective($sanitize, $compile, markdownIt) {
        var attribute = 'markdownIt';
        var render = function (value) {
            return value ? $sanitize(markdownIt.render(value)) : '';
        };
        var link = function (scope, element, attrs) {
            if (attrs[attribute]) {
                scope.$watch(attribute, function (value) {
                    element.html(HandleSubstitutions(render(value)));
                    $compile(element.contents())(scope);
                });
            } else {

                element.html(HandleSubstitutions(render(element.text())));
                $compile(element.contents())(scope);
            }
        };
        return {
            restrict: 'AE',
            scope: {
                markdownIt: '='
            },
            replace: true,
            link: link
        };
    }

    function HandleSubstitutions(data) {
        let returnValue = data;
        let i, len;
        let regexHandles = /\{\{.*\}\}/g;
        let result = regexHandles.exec(data);

        if (result) {
            for (i = 0, len = result.length; i < len; i++) {
                let foundSubstitution = result[i];
                let cleanSubstitution = foundSubstitution.replace('{{', '').replace('}}', '');
                let splitValues = cleanSubstitution.split(':');
                let key = splitValues[0];

                if (key === 'term') {
                    returnValue = data.replace(foundSubstitution, HandleSubstitution_Term(splitValues));
                } else {
                    returnValue = data.replace(foundSubstitution, '');
                }
            }
        }

        return returnValue;
    }

    function HandleSubstitution_Term(values) {
        if (values.length == 2) {
            return '<span mx-term="' + values[1] + '"></span>';
        } else {
            return '';
        }
    }
    angular.module('mdMarkdownIt', ['ngSanitize']).provider('markdownItConverter', markdownItProvider).directive('markdownIt', ['$sanitize', '$compile', 'markdownItConverter', markdownItDirective]);
})(window, window.angular);