/**
 * @author Jörn Kreutel
 */
define(["mwf", "entities"], function(mwf, entities) {

    function ListviewViewController() {
        console.log("ListviewViewController()");

        // declare a variable for accessing the prototype object (used für super() calls)
        var proto = ListviewViewController.prototype;

        var items = [];

        var addNewMediaItemElement;

        var resetDatabaseElement;
        /*
         * for any view: initialise the view
         */
        this.oncreate = function (callback) {
            // TODO: do databinding, set listeners, initialise the view

            addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
            addNewMediaItemElement.onclick = function() {

            this.createNewItem();
            }.bind(this);

            entities.MediaItem.readAll(function(items) {
              this.initialiseListview(items);
            }.bind(this));

            resetDatabaseElement = this.root.querySelector("#resetDatabase");
            resetDatabaseElement.onclick = function() {
              if (confirm("Soll die Datenbank wirklich zurückgesetzt werden?")) {
                indexedDB.deleteDatabase("mwftutdb");
              }
            }.bind(this);

            // call the superclass once creation is done
            proto.oncreate.call(this,callback);
        }

        /*
        this.createNewItem = function() {
        var newItem = new entities.MediaItem(“m“,“http://lorempixel.com/50/50“);
        newItem.create(function(){
        this.addToListview(newItem);
        }.bind(this));
      }
        */

        /* HIER STECKT DER FEHLER!!!!! DER OBERE CODE FÜGT EIN ELEMENT HINZU, MIT DIALOG NICHT MEHR MÖGLICH
        AUSSERDEM WIRD EINE URL NACH DEM MUSTER http://localhost:3000/?name=*der name den ich in das Dialogfeld eingegeben habe* AUFGERUFEN */
        this.createNewItem = function() {
          var newItem = new entities.MediaItem("", "https://placeholdit.imgix.net/~text?txtsize=100&txt=NEW&w=200&h=200");
          this.showDialog("mediaItemDialog",{
            item: newItem,
            actionBindings: {
            submitForm: function(event) {
              event.original.preventDefault();
              newItem.create(function(){
                this.addToListview(newItem);
                }.bind(this));
                this.hideDialog();
              }.bind(this)
            }
          });
        }

      this.deleteItem = function(item) {
        /*
        crudops.delete(item._id,function(){
          this.removeFromListview(item. id);
        }.bind(this));
        */
        item.delete(function(){
          this.removeFromListview(item._id);
          }.bind(this));
        }

        this.editItem = function(item) {
          /*
          item.name = (item.name + item.name);
          crudops.update(item._id,item,function(){
            this.updateInListview(item. id,item);
          }.bind(this));
          */
          this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
              submitForm: function(event) {
                event.original.preventDefault();
                item.update(function(){
                  this.updateInListview(item._id, item);
                }.bind(this));
                this.hideDialog();
              }.bind(this), /*!!!*/
              deleteItem: function(event) {
              this.deleteItem(item);
              this.hideDialog();
            }.bind(this)
            }
          });
        }

        /*
         * for views with listviews: bind a list item to an item view
         * TODO: delete if no listview is used or if databinding uses ractive templates
         */
      /*   this.bindListItemView = function (viewid, itemview, item) {
            // TODO: implement how attributes of item shall be displayed in itemview
            itemview.root.getElementsByTagName("img")[0].src = item.src;
            itemview.root.getElementsByTagName("h2")[0].textContent =
            item.name + item._id;
            itemview.root.getElementsByTagName("h3")[0].textContent =
            item.added;
        }
        */


        /*
         * for views with listviews: react to the selection of a listitem
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemSelected = function(listitem,listview) {
            // TODO: implement how selection of listitem shall be handled
            alert("Element "  + listitem.name + listitem._id + " wurde ausgewählt!");
        }


        /*
         * for views with listviews: react to the selection of a listitem menu option
         * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
         */
        this.onListItemMenuItemSelected = function(option, listitem, listview) {
            // TODO: implement how selection of option for listitem shall be handled
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


    }

    // extend the view controller supertype
    mwf.xtends(ListviewViewController,mwf.ViewController);

    // and return the view controller function
    return ListviewViewController;
});
