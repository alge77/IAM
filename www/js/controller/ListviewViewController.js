/**
 * @author Jörn Kreutel
 */

// Seite 40 4.4.3
// define(["mwf","entities","GenericCRUDImplLocal"], function(mwf, entities, GenericCRUDImplLocal) {
define(["mwf","entities"], function(mwf, entities) {

    function ListviewViewController() {
        console.log("ListviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = ListviewViewController.prototype;
        // var items = [
        //     new entities.MediaItem("m1","http://lorempixel.com/100/100"),
        //     new entities.MediaItem("m2","http://lorempixel.com/200/150"),
        //     new entities.MediaItem("m3","http://lorempixel.com/150/200")
        //     ];
        var resetDatabaseElement;

        // var crudops = GenericCRUDImplLocal.newInstance("MediaItem");
        /*
         * for any view: initialise the view
         */
        this.oncreate = function (callback) {
            // TODO: do databinding, set listeners, initialise the view

            resetDatabaseElement = this.root.querySelector("#resetDatabase");
            resetDatabaseElement.onclick = function() {
                if(confirm("Soll die Datenbank wirklich zurückgesetzt werden?")) {
                    indexedDB.deleteDatabase("mwftutdb");
                }
            }.bind(this);

            addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");

            addNewMediaItem.onclick = function() {
                // crudops.create(new entities.MediaItem("m", "http://lorimpixel.com/50/50"),function(created){
                //   this.addToListview(created);
                // }.bind(this));
                // this.createNewItem();
                var newMediaItem = new entities.MediaItem();

                this.nextView("mediaEditview",{item: newMediaItem});
            }.bind(this);
            // addNewMediaItem.onclick = function() {
            //   this.addToListview(new entities.MediaItem("m_new", "http://lorimpixel.com/50/50"));
            // }.bind(this);

            // crudops.readAll(function(items){
            //   this.initialiseListview(items);
            // }.bind(this));

            this.addListener(new mwf.EventMatcher("crud","created","MediaItem"), function(event) {
                this.addToListview(event.data);
            }.bind(this));
            this.addListener(new mwf.EventMatcher("crud","updated","MediaItem"), function(event) {
                this.updateInListview(event.data._id,event.data);
            }.bind(this));
            this.addListener(new mwf.EventMatcher("crud","deleted","MediaItem"), function(event) {
                this.removeFromListview(event.data);
            }.bind(this));

            entities.MediaItem.readAll(function(items){
                this.initialiseListview(items);
            }.bind(this));


            switchCrudElement = this.root.querySelector("#switchCrud");
            switchCrudElement.onclick = function() {
                // bestaetigung ob wirklich die datenbank geswitched werden soll
                 if(confirm("Switch Database?")) {
                 }
                console.log("SWITCHCRUD: "+ this.application.currentCRUDScope);
                if (this.application.currentCRUDScope == "local") {
                    this.application.switchCRUD("remote");
                } else if (this.application.currentCRUDScope == "remote") {
                    this.application.switchCRUD("local");
                }
                console.log("SWITCHCRUD: "+ this.application.currentCRUDScope);

                entities.MediaItem.readAll(function(items){
                    // console.log("initialisiere die Listview neu");
                    this.initialiseListview(items);
                }.bind(this));

            }.bind(this);
            // this.initialiseListview(items);
            // call the superclass once creation is done
            proto.oncreate.call(this,callback);
        }


        this.onListItemMenuItemSelected = function(option, listitem, listview) {
            // TODO: implement how selection of option for listitem shall be handled
            // notice: this = calling ViewController
            // this.nextView("mediaEditview", item: listitem);
            proto.onListItemMenuItemSelected.call(this, option, listitem, listview);
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

        /*
         * for deleteItem with dialogs
         * TODO:
         */
        this.deleteItem = function(item) {
            this.showDialog("mediaDeleteItemDialog", {
                item: item,
                actionBindings: {
                    submitForm: function(event) {
                        event.original.preventDefault();
                        // item.update(function(){
                        // item.delete(item._id,function(){
                        //   // this.removeFromListview(item._id);
                        // }.bind(this));
                        item.delete();
                        //   this.updateInListview(item._id, item);
                        // }.bind(this))
                        this.hideDialog();
                    }.bind(this),
                    cancelDialog: function(event) {
                       // this.deleteItem(item);
                        this.hideDialog();
                    }.bind(this)
                }
            });
        }




        /*
         * for editItem with dialogs
         * TODO:
         */
        this.editItem = function(item) {


            this.showDialog("mediaItemDialog", {
               item: item,
               actionBindings: {
                 submitForm: function(event) {
                   event.original.preventDefault();
                   item.update(function(){this.updateInListview(item._id, item);
                   }.bind(this));
                   this.hideDialog();
                 }.bind(this),
                 deleteItem: function(event) {
                     item.delete(item._id,function(){
                     this.removeFromListview(item._id);
                      }.bind(this));
                   this.hideDialog();
                 }.bind(this)
               }
             });
            // this.nextView("mediaEditview",{item: item});
        }



        this.onReturnFromSubview = function (subviewid,returnValue,returnStatus,callback) {
            if (subviewid == "mediaReadview") {
                if (returnValue && returnValue.deleted) {
                    this.removeFromListview(returnValue.deleted._id);
                }
            }
            else if (subviewid == "mediaEditview") {
                if (returnValue) {
                    if (returnValue.created) {
                       // this.addToListview(returnValue.created); <-- wenn nicht auskommentiert erscheinet ein neues Objekt doppelt im Listview, ist aber nur einmal in der DB und nach Reload auch nur 1x sichtbar.
                    }
                    else if (returnValue.updated) {
                        this.updateInListview(returnValue.updated._id, returnValue.updated);
                    }
                }
            }
            callback();
        }

    }

    // extend the view controller supertype
    mwf.xtends(ListviewViewController,mwf.ViewController);

    // and return the view controller function
    return ListviewViewController;
});