
// App JS
$( function() {

  (function initApp() {

    if ( typeof GLOBALS === "undefined" ) {
      GLOBALS = {};

      GLOBALS.constants = {
                    blankCard : {
                      task:"Task Name..",
                      description: "Task Description..",
                      tags: ["tag1, tag2"],
                      users: ["assignee"],
                      completed: false
                    },
                    blankList : {
                      _id: "",
                      name: "New List",
                      modified: "",
                      cards: []
                    }
                };
      // todo: to update & add to userdata after prompting user to prefil data
      // while adding new list / card - http://jquerymodal.com/

      GLOBALS.utils = {};
      GLOBALS.utils.saveAndRenderContext = saveAndRenderContext;
      GLOBALS.utils.applyJQuerySortable = applyJQuerySortable;
      GLOBALS.utils.updateModel = updateModel;
      GLOBALS.utils.updateModelSortable = updateModelSortable;
      GLOBALS.utils.newListAddedView = newListAddedView;

      GLOBALS.service = {};
      GLOBALS.service.saveUserData = saveUserData;
      GLOBALS.service.getUserData = getUserData;
      GLOBALS.service.initUserData = initUserData;

    } else {
      console.log('Error in init globals.');
    }

    initUserData();
    saveAndRenderContext();

  })();

  /*
     ## Finction Definitions
 */

  // Handlebars templating
  function saveAndRenderContext() {
    saveUserData();
    try {
      var theTemplateScript = $("#list-card-template").html();
      var theTemplate = Handlebars.compile(theTemplateScript);
      var theCompiledHtml = theTemplate(GLOBALS.userdata);
      $('#content-area').html(theCompiledHtml);
    } catch (er) {console.log('Error in handlebars templating. ', er);}
    applyJQuerySortable();
  };

  // JQuery Ui Drag Drop, required for dynamically created elements
  function applyJQuerySortable() {

    var oldListIndex = -1, newListIndex = -1, oldCardIndex = -1, newCardIndex = -1;
    var repeat = false;
    $( "#content-area .sortable-cards" ).sortable({
      connectWith: ".sortable-cards",
      handle: ".drag-handler",
      cancel: ".toggle",
      placeholder: "placeholder",
      start: function(e, ui) {
      var $self = $( this );
          $self.attr('data-old-card-index', ui.item.index());
          $self.attr('data-old-list-ondex', $self.closest('.list').index());
      },
      update: function(e, ui) {
      var $self = $( this );
          if(!repeat) {
            oldListIndex = $self.attr('data-old-list-ondex'),
            oldCardIndex = $self.attr('data-old-card-index'),
            repeat = true;
          }
          newListIndex = $self.closest('.list').index(),
          newCardIndex = ui.item.index();
          $self.removeAttr('data-old-card-index');
          $self.removeAttr('data-old-list-ondex');
      },
      stop: function( event, ui ) {
        repeat = false;
        updateModelSortable(oldListIndex, newListIndex, oldCardIndex, newCardIndex);
      }
    });
    // todo: add sortable support for touch events

    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" );
  };

  // update data from view to lsm
  function updateModel(listIndex, cardIndex, keyName, val) {
    try {
      if (keyName === "title")
      {GLOBALS.userdata.list[listIndex][keyName] = val;}
      else {
        if (keyName === "users" || keyName === "tags") {val = val.split(',')};
        GLOBALS.userdata.list[listIndex].cards[cardIndex][keyName] = val;
      }
      saveUserData(GLOBALS);
    } catch (er) {console.log('Error in updating data model. ', er);}
  };

  // update data from jq sortable to lsm
  function updateModelSortable(oldListIndex, newListIndex, oldCardIndex, newCardIndex) {
    try {
      oldListIndex = parseInt(oldListIndex);
      newListIndex = parseInt(newListIndex);
      oldCardIndex = parseInt(oldCardIndex);
      newCardIndex = parseInt(newCardIndex);

      if(oldListIndex !==-1 && newListIndex !==-1 &&
         oldCardIndex !==-1 && newCardIndex !==-1) {
        if (oldListIndex !== newListIndex || oldCardIndex !== newCardIndex) {

            // add sortable data
            var value = GLOBALS.userdata.list[oldListIndex]
                    .cards.slice(oldCardIndex, (oldCardIndex+1));

            GLOBALS.userdata.list[newListIndex]
                    .cards.splice(newCardIndex, 0, value[0]);

            // delete sortable data
            if ( (newCardIndex < oldCardIndex) &&
                    (newListIndex === oldListIndex) ) {
                    GLOBALS.userdata.list[oldListIndex]
                            .cards.splice((oldCardIndex+1), 1);
            } else {
                    GLOBALS.userdata.list[oldListIndex]
                            .cards.splice(oldCardIndex, 1);
            }

            saveUserData(GLOBALS);
        }
      }
    } catch (er) {console.log('Error in updating data model. ', er);}
  };

  // save user data
  function saveUserData(_GLOBALS) {
    try{
      if( ! _GLOBALS ) {
        if ( GLOBALS ) { _GLOBALS = GLOBALS }
        else { _GLOBALS = {}; }
      }
      localStorage.setItem('userdata', JSON.stringify(_GLOBALS.userdata));
    } catch (er) {console.log(er);
      alert('Error in retriving userdata. Local storage might'+
      ' not be supported on client');
      }
  };

  // get user data
  function getUserData() {
   try{
     return JSON.parse(localStorage.getItem('userdata'));
   } catch (er) {
       console.log(er);
       alert('Error in retriving userdata. Local storage might'+
       ' not be supported on client');
       return null;
     }
   };

   // view updates after adding new list
   function newListAddedView() {
     window.scrollTo(0, 0);
   }

   /*
      ## To Initialize userdata - from lsm to GLOBALS variable
  */

  function initUserData(){
      try{
        if(GLOBALS) {
          GLOBALS.userdata = GLOBALS.service.getUserData();
        } else {
          GLOBALS = {
            userdata: {}
          };
        }
      } catch(er){
        console.log(er);
      }

    // temp - setting up sample userdata for view, if no userdata is present
    if (!(GLOBALS.userdata)) {
      GLOBALS.userdata = {
        meta: {
          title: "Task Management App"
        },
        list: [
            {
              _id: "",
              name: "My Task List",
              modified: "",
              cards: [
                  {
                    task:"Explore Features",
                    description: "verify features of app",
                    tags: ['inprocess'],
                    users: ['qa'],
                    completed: false
                  },
                  {
                    task:"New Features",
                    description: "implement new app features",
                    tags: ['new','p2'],
                    users: ['developer'],
                    completed: false
                  }
                ]
            }
        ]
      };
    }
  };

});
