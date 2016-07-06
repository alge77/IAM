/**
 * @author Jörn Kreutel
 */
define(["mwf","entities"], function(mwf, entities) {

    function MediaEditviewViewController() {
        console.log("MediaEditviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = MediaEditviewViewController.prototype;

        var mediaItem;

        /*/
         * for any view: initialise the view
         */


        this.oncreate = function (callback) {
            // TODO: do databinding, set listeners, initialise the view
            if (this.args) {
                mediaItem = this.args.item;
            }
            else {
                mediaItem = new entities.MediaItem();
            }

            // alert("oncreate(): got item: " + JSON.stringify(mediaItem));

            this.bindElement("mediaEditviewTemplate", {item: mediaItem}, this.root);

            var form = document.forms["mediaEditform"];

             form.onsubmit = (function() {
                 // alert("submit: " + JSON.stringify(mediaItem));
                 if (mediaItem.contentProvision == "URL") {
                     this.createOrUpdateMediaItem();
                 }
                 else if (mediaItem.contentProvision == "Upload") {
                     this.submitFormDataToServerAndCreateMediaItem(form);
                 }
                 else {
                     alert("Content Provision must be set and selected!");
                 }
                 return false;
             }).bind(this);

            // call the superclass once creation is done
            proto.oncreate.call(this,callback);
        }

            this.submitFormDataToServerAndCreateMediaItem = function(form) {

                var formdata = new FormData();
                formdata.append("srccontent",form.srccontent.files[0]);
                formdata.append("name",mediaItem.name);
                formdata.append("description",mediaItem.description);

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            // alert("got response " + xhr.responseText);
                            var responseJson = JSON.parse(xhr.responseText);
                            mediaItem.src = responseJson.data.srccontent;
                            this.createOrUpdateMediaItem();
                        }
                        else {
                            alert("got status different from 200 " + xhr.status);
                        }
                    }
                }.bind(this);
                xhr.open("POST","http2mdb/upload");
                xhr.send(formdata);

        }

             this.createOrUpdateMediaItem = function() {
                 if (mediaItem.created) {
                     mediaItem.update(
                         function() {
                             this.previousView({updated: mediaItem});
                         }.bind(this)
                     );
                 }
                 else {
                     mediaItem.create(
                         function() {
                             this.previousView({created: mediaItem});
                         }.bind(this)
                     );
                 }
                 return false;
             }.bind(this);

        // das funktioniert leider nicht mehr :(
        
        /*var deleteItemButton = this.root.querySelector(".mwf-img-delete");
        deleteItemButton.onclick = function() {
            this.args.item.delete(function() {
                this.previousView({deleted: mediaItem});
            }.bind(this))
        }.bind(this);*/

        /*
         * for views with listviews: bind a list item to an item view
         * TODO: delete if no listview is used or if databinding uses ractive templates
         */
        this.bindListItemView = function (viewid, itemview, item) {
            // TODO: implement how attributes of item shall be displayed in itemview
        }

        /*
         * for views with listviews: react to the selection of a listitem
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemSelected = function(listitem,listview) {
            // TODO: implement how selection of listitem shall be handled
            proto.onListItemMenuItemSelected.call(this, option, listitem, listview);
        }

        /*
         * for views with listviews: react to the selection of a listitem menu option
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemMenuItemSelected = function(option, listitem, listview) {
            // TODO: implement how selection of option for listitem shall be handled
        }

        /*
         * for views with dialogs
         * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
         */
        this.bindDialog = function(dialogid,dialog,item) {
            // call the supertype function
            proto.bindDialog.call(this,dialogid,dialog,item);
            // TODO: implement action bindings for dialog, accessing dialog.root
        }

    }

    // extend the view controller supertype
    mwf.xtends(MediaEditviewViewController,mwf.ViewController);

    // and return the view controller function
    return MediaEditviewViewController;
});
