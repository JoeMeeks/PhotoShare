//Kendo Mobile Slide Menu by Joe Meeks (aka TaeKwonJoe)
//http://github.com/JoeMeeks
; (function (tkj, $, undefined) {
    tkj.vm = kendo.observable({
        menu: new kendo.data.DataSource({
            data: [
                { section: "Header1", order: 1, title: "Home", icon: "home", viewID: "#home" },
                { section: "Header1", order: 2, title: "Favorites", icon: "favorites", viewID: "#favorites" },
                { section: "Header2", order: 1, title: "Featured", icon: "featured", viewID: "#featured" },
                { section: "Header2", order: 2, title: "Bookmarks", icon: "bookmarks", viewID: "#bookmarks" },
                { section: "Header2", order: 3, title: "Contacts", icon: "contacts", viewID: "#contacts" },
                { section: "Header2", order: 4, title: "Camera", icon: "camera", viewID: "#camera" },
                { section: "Header2", order: 5, title: "Downloads", icon: "downloads", viewID: "#downloads" },
                { section: "Header3", order: 1, title: "Cart", icon: "cart", viewID: "#cart" },
                { section: "Header3", order: 2, title: "Organize", icon: "organize", viewID: "#organize" },
                { section: "Header3", order: 3, title: "Share", icon: "share", viewID: "#share" },
                { section: "Header3", order: 4, title: "Action", icon: "action", viewID: "#action" },
                { section: "Header3", order: 5, title: "Globe", icon: "globe", viewID: "#globe" },
                { section: "Header4", order: 1, title: "Settings", icon: "settings", viewID: "#settings" },
                { section: "Header4", order: 2, title: "About", icon: "about", viewID: "#about" },
            ],
            group: "section",
            sort: "order"
        }),
        photos: new kendo.data.DataSource({
            transport: {
                read: function(options) {
                    tkj.api.get("image", null, function (result) { options.success(result); }, function (result) { options.error(result); }); 
                }
            }
        }),
        iconclass: function (e) { return "km-icon km-" + e.icon; },
        active: null,
        version: 'Photo Share by <a href="http://github.com/JoeMeeks" target="_blank">Joe Meeks</a>'
    });
    tkj.api = {
        baseUrl: " http://photoshare9999.appspot.com/",
        get: function (route, data, fnSuccess, fnError) {
            try {
                $.ajax({
                    //headers: { Accept: "text/json" },
                    url: tkj.api.baseUrl + route,
                    //contentType: "application/json; charset=utf-8",
                    type: "get",
                    data: data,
                    dataType: "jsonp",
                    beforeSend: function (e) {
                        app.showLoading();
                    },
                    success: function (e) {
                        console.log(e);
                        fnSuccess(e);
                    },
                    error: function (e) {
                        console.log(e);
                        if (fnError) {
                            fnError(e);
                        } else fbg.ui.showError(JSON.stringify(e));
                    },
                    complete: function () {
                        app.hideLoading();
                    }
                });
            } catch (e) {
                fbg.ui.showError("ajax error: " + e.message);
            }
        },
    };
    tkj.ui = {
        master_Init: function (e) {
            //the layout init event only fires once on browser load or refresh
        },
        master_Show: function (e) {
            $(document.body).css("visibility", "visible"); //reveal body after active view is shown
            
        },
        login: function () {
            var client_id="dev.photoshare.com";
            var state="authenticated";
            var scope="http://photoshare9999.appspot.com/";
            var url = "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=" + client_id + "&state=" + state + "&redirect_uri=http://localhost&scope=" + scope;
            var ref = window.open(url, "_blank", "location=yes");
            ref.addEventListener("exit", function () {
                alert(event.type); 
                ref.removeEventListener("exit");
            });

            function oAuth2Failed() {
              console.log('oAuth2Failed');
              document.getElementById('info').innerHTML='login failed';
              ref.close();
            }

            function oAuth2Success(token) {
              console.log("I can haz code: "+token);
              document.getElementById('info').innerHTML=token;
              ref.close();
            }


        },
        onPhotosShow: function (e) {
            
        },
        mediaUpload: function(input) {
            $("#btnClear").show();
            var options = { repo: "temp" };
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                var progressBar = document.querySelector("progress");
                xhr.upload.addEventListener("progress", function (e) {
                    var percentage = e.loaded / e.total;
                    progressBar.value = percentage * 100;
                    progressBar.textContent = Math.floor(percentage * 100) + "%";
                }, false);
            }
            provider = function () {
                return xhr;
            };
            var data = new FormData();
            data.append("options", JSON.stringify(options));
            for (var i = 0; i < input.files.length; i++) data.append(input.files[i].name, input.files[i]);
            $.ajax({
                url: "https://photoshare9999.appspot.com/_ah/upload/?bloburl=true",
                type: 'POST',
                xhr: provider,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (e) {
                    app.showLoading();
                },
                success: function (e) {
                    alert("success: " + e);
                },
                error: function (e) {
                    alert("failure: " + JSON.stringify(e));
                },
                complete: function (e) {
                    app.hideLoading();
                }
            });
            var images;
            $.each(input.files, function (n, i) {
                $("li.thumbs").show();
                //images += '<img src="' + i.fileName + '" width="32" height="32" />';
                images += '<img src="' + i.fileName + '" width="32" height="32" />';
                //console.log(i);
            });
            $("li.thumbs").append(images);
        },
        clearUpload: function() {
            var progressBar = document.querySelector("progress");
            progressBar.value = 0;
            progressBar.textContent = "0%";
            $("#fiMedia").val("");
            $("li.thumbs").hide();
            $("#btnClear").hide();
        }
    };
} (window.tkj = window.tkj || {}, jQuery));