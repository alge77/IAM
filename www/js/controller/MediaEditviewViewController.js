/**
 * @author Jörn Kreutel
 */
define(["mwf","entities"], function(mwf, entities) {

    function MediaEditviewViewController() {
        console.log("MediaEditviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = MediaEditviewViewController.prototype;

        /*/
         * for any view: initialise the view
         */


        this.oncreate = function (callback) {
             // TODO: do databinding, set listeners, initialise the view

             var mediaItem = this.args.item;
            // alert("oncreate(): got item: " + JSON.stringify(mediaItem));

            this.bindElement("mediaEditviewTemplate",{item: mediaItem},this.root);

             var form = document.forms["mediaEditform"];

             form.onsubmit = function() {
                 // alert("submit: " + JSON.stringify(mediaItem));
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


            var deleteItemButton = this.root.querySelector(".mwf-img-delete");
            deleteItemButton.onclick = function() {
                this.args.item.delete(function() {
                    this.previousView({deleted: mediaItem});
                }.bind(this))
            }.bind(this);

             // call the superclass once creation is done
             proto.oncreate.call(this,callback);
         }

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
