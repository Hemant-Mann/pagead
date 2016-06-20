(function() {
    // Localize jQuery variable
    var jQuery;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined) {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src",
            "//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js");
        if (script_tag.readyState) {
          script_tag.onreadystatechange = function () { // For old versions of IE
              if (this.readyState == 'complete' || this.readyState == 'loaded') {
                  scriptLoadHandler();
              }
          };
        } else { // Other browsers
          script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        main(); 
    }

    /******** Our main function ********/
    function main() { 
        "use strict";
        if (typeof window.$ === "undefined" && typeof jQuery !== "undefined") {
            window.$ = jQuery;
        }

        (function (window, $) {
            /**
             * Cookie Handler Object
             */
            var Cookie = (function (document, window) {
                function Cookie() {
                    this.prefix = "__vnative";
                    this.random = (window.Math.random() * 1e32).toString(36);
                }

                Cookie.prototype = {
                    set: function (cname, cvalue, exdays, path) {
                        cname = this.prefix + cname;

                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        var cookie = cname + "=" + cvalue + "; " + expires + "; ";
                        if (path)
                            cookie += " path=" + path + ";";
                        document.cookie = cookie;
                    },
                    get: function (cname) {
                        cname = this.prefix + cname;
                        var name = cname + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') c = c.substring(1);
                            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                        }
                        return "";
                    },
                    erase: function (cname) {
                        cname = this.prefix + cname;
                        document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC";';
                    }
                };
                return new Cookie();
            }(window.document, window));

            /**
             * Object to handle Impression of the Native Ads
             */
            var Impression = (function (window, $) {
                function Imp() {
                    this.loaded = false;
                    this.parser = null;
                    this.result = null;
                    this.domain = 'track.vnative.com';
                    this.el = null; this.sent = false;
                }

                Imp.prototype = {
                    init: function () {
                        this.loaded = true;
                        this.parser = new window.UAParser();
                    },
                    _result: function () {
                        var result = this.parser.getResult();
                        var screen = {
                            height: window.screen.height,
                            width: window.screen.width
                        };
                        var device = {
                            browser: result.browser.name,
                            os: result.os.name
                        };
                        this.result = {
                            screen: screen,
                            device: device,
                            mobile: 1
                        };
                    },
                    /**
                     * Send the impression to the server
                     */
                    send: function (data) {
                        this._result();
                        this.result.aduid = data.aduid;
                        this.result.cid = data.cid;
                        this.result.loc = btoa(window.location.hostname);                        
                    },
                    inViewPort: function () {
                        var el = this.el[0];

                        var rect = el.getBoundingClientRect();
                        return (
                            rect.top >= 0 &&
                            rect.left >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                        );
                    },
                    _send: function () {
                        var self = this;
                        $.ajax({
                            url: '//' + self.domain + '/impression?callback=?',
                            type: 'GET',
                            async: true,
                            dataType: "jsonp",
                            jsonp: 'callback',
                            data: self.result
                        })
                        .done(function (d) {
                            if (d.success) {
                                self.sent = true;
                            }
                        })
                        .fail(function () {
                            // do something with error
                        });
                    },
                    attach: function () {
                        var self = this;
                        $(window).on('resize scroll', function () {
                            if (!self.sent && self.inViewPort()) {
                                self.sent = true;
                                self._send();
                            }
                        });
                    }
                };

                var Impression = new Imp();
                $.ajaxSetup({ cache: true });
                var scriptUrl = '//serve.vnative.com/uaparser.min.js';
                $.getScript(scriptUrl, function (data) {
                    Impression.init();
                });

                return Impression;
            }(window, $));
    
            /**
             * Main Content Object
             * Responsible for fetching, modifying and tracking the content
             */
            var Content = (function () {
                function Content() {
                    this.domain = 'serve.vnative.com';
                    this.trackingDomain = 'track.vnative.com';
                    this.contentOpts = {
                        adunit: null,
                        publisher: null,
                        campaign: null,
                        dest: null,
                        time: window.Date.now()
                    };
                    
                    this.ckid = null; this.text = {};
                    this.contentOpts.publisher = $('.byvnative').data('client') || 'publisher';
                    this.contentOpts.publisher = this.contentOpts.publisher.replace(/pub-/g, '');
                }

                Content.prototype = {
                    // Init the various content options after the data is fetched
                    _init: function (data) {
                        var copts = this.contentOpts;
                        copts.adunit = $('.byvnative').data('slot') || 'slot';
                        copts.dest = data._url; // base64 encode this

                        copts.campaign = data._id;
                        if (!Cookie.get('Tracking')) {
                            Cookie.set('Tracking', Cookie.random, 365);
                        }
                        this.ckid = Cookie.get('Tracking');

                        Impression.send({
                            aduid: copts.adunit,
                            cid: copts.campaign
                        });
                    },
                    /**
                     * Get Content from the server
                     */
                    get: function (callback) {
                        var self = this;
                        
                        $.ajax({
                            url: '//' + self.domain + '/?callback=?&uid=' + self.contentOpts.publisher,
                            type: 'GET',
                            async: true,
                            jsonp: 'callback',
                            dataType: "jsonp"
                        })
                        .done(function (d) {
                            self._init(d);
                            callback.call(self, null, d);
                        })
                        .fail(function (err) {
                            callback.call(self, err, null);
                        });
                    },
                    _trackLink: function () {
                        var copts = this.contentOpts;
                        var str = '//';
                        str += this.trackingDomain + '/click';
                        str += '?slot=' + copts.adunit;
                        str += '&pid=' + copts.publisher;
                        str += '&cid=' + copts.campaign;
                        str += '&ckid=' + this.ckid;
                        str += '&dest=' + btoa(copts.dest);
                        str += '&ti=' + copts.time;

                        return str;
                    },
                    // Attach onclick event to the newly inserted node
                    attach: function (node) {
                        var $el = $(node),
                            link = this._trackLink();

                        $el.on('click', function (e) {
                            e.preventDefault();
                            window.location.href = link;
                        });

                        $el.mousedown(function(event) {
                            event.preventDefault();
                            switch (event.which) {
                                case 2:
                                case 3:
                                    window.open(link, '_newtab');
                                    break;

                                default:
                                    window.location.href = link;
                                    break;

                            }
                        });
                    },
                    attachImp: function ($el) {
                        Impression.el = $el;
                        Impression.attach();
                    }
                };

                return new Content();
            }());
            
            var obj = window.vNativeObject || 'vnative';
            window[obj] = Content;
        }(window, jQuery));

        $(document).ready(function() {
            var obj = window.vNativeObject || 'vnative';
            var Content = window[obj];
            Content.get(function (err, data) {
                if (err) return;

                var $el = '<article><header><h1>'+ data._title +'</h1></header><p>'+ data._description +'</p><figure><img src="'+ data._image+'" alt="" /></figure></article>';
                $el = $($el);

                $el.insertAfter('body');
                this.attach($el);   // attach link to the newly created dom element
                this.attachImp($el);
            });
        });
    }
})();
