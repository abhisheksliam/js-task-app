
// App JS
$( function() {

// Check if local storage is available
  try {
    var k = 'test';
      localStorage.setItem(k, k);
      localStorage.removeItem(k);
  } catch(e) {
      alert('Please use modern browser. localStorage is not supported on client !')
  }

// Initialize App, appdata, view
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

      GLOBALS.utils = {
                    saveAndRenderContext : saveAndRenderContext,
                    renderContext : renderContext,
                    applyJQuerySortable : applyJQuerySortable,
                    updateModel : updateModel,
                    updateModelSortable : updateModelSortable,
                    newListAddedView : newListAddedView
                  };


      GLOBALS.service = {
                    saveUserData : saveUserData,
                    getUserData : getUserData,
                    initUserData : initUserData
                  };


    } else {
      console.log('Error in init globals.');
    }

    initUserData(); // Initialize userdata from local storage
    renderContext(); // Render view from userdata

  })();

  /*
     ## Function Definitions
 */

  // Save userdata from GLOBALS to localStorage & render handlebars template
  function saveAndRenderContext() {
      saveUserData();
      renderContext();
  };

 // Render context using handlebars
  function renderContext() {
      var theTemplateScript = $("#list-card-template").html();
      var theTemplate = Handlebars.compile(theTemplateScript);
      var theCompiledHtml = theTemplate(GLOBALS.userdata);
      $('#content-area').html(theCompiledHtml);
      applyJQuerySortable();
  };


  // JQuery Ui Drag Drop bind, required for dynamically created elements
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

    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" );
  };

  // Update data from view to localStorage
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

  // Update data from jQuery sortable to localStorage
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

  // Save user data to localStorage
  function saveUserData(_GLOBALS) {
      if( ! _GLOBALS ) {
        if ( GLOBALS ) { _GLOBALS = GLOBALS }
        else { _GLOBALS = {}; }
      }
      localStorage.setItem('userdata', JSON.stringify(_GLOBALS.userdata));
  };

  // Get user data from localStorage
  function getUserData() {
   try{
     return JSON.parse(localStorage.getItem('userdata'));
    } catch (er) {
       console.log('Error in retriving userdata.', er);
       return null;
     }
   };

   // Scroll to top after adding new todo list
   function newListAddedView() {
     window.scrollTo(0, 0);
   }

// Initialize userdata - from localStorage to GLOBALS variable
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

    // temporary - setting up sample userdata for view, if no userdata is present
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


// jQuery App helpers
$( function() {

/*
   ## Note: Dependent on app.js (app.js methods must be loaded before)
 */

 // Initializing functions & constants defined in app.js
 var _utils = GLOBALS.utils,
     _userdata = GLOBALS.userdata,
     _constants = GLOBALS.constants;


 // Inplace Edit - Content Editable set / reset & Model data update trigger
 var $contentArea = $( "#content-area" );

    $contentArea.on( "click", ".title, .task, .description, .users, .tags", function() {
      this.contentEditable = true;
      this.focus();
      this.style.border = '1px dotted black';
      this.style.outline= 'none';
      this.style['border-color']= '#9ecaed';
      this.style['box-shadow']= '0 0 10px #9ecaed';
    });

    $contentArea.on( "blur", ".title, .task, .description, .users, .tags", function() {
      var $self = $( this ),
          listIndex = $self.closest('.list').index(),
          cardIndex = $self.closest('.card').index(),
          keyName = $self.attr('data-keyname').trim(),
          val = $self.text().trim();
      this.style.border = '';
      this.style['box-shadow']= '';
      this.contentEditable = false;

      _utils.updateModel(listIndex, cardIndex, keyName, val);

    });

/*
  ## Handling Add / Delete - List, Card - Model Update Events
*/

   // Add new list
    $( ".new-list" ).on( "click", function() {
      var _push = JSON.parse(JSON.stringify(_constants.blankList));
        // _push.name = prompt("Please enter list title..", "New List");
      (_userdata.list).unshift(_push);

      _utils.saveAndRenderContext();
      _utils.newListAddedView();

      // heilight newly added list
      $contentArea.find('.list').first().effect("highlight", {}, 3000);

    });

    // Add new card
    $contentArea.on( "click", ".new-card", function() {
        var listIndex = $( this ).closest('.list').index();

        if (listIndex !== -1) {
          (_userdata.list[listIndex].cards)
                           .push(JSON.parse(JSON.stringify(_constants.blankCard)));
         _utils.saveAndRenderContext();

         // heilight newly added card
         $contentArea.find('.list').eq(listIndex)
                             .find('.card').last().effect("highlight", {}, 3000);
        }

    });

    // Delete a list
    $contentArea.on( "click", ".delete-list", function() {
        var listIndex = $(this).closest('.list').index();
        (_userdata.list).splice(listIndex, 1);

      _utils.saveAndRenderContext();
    });

    // Delete a card
    $contentArea.on( "click", ".delete-card", function() {
        var listIndex = $(this).closest('.list').index(),
            cardIndex = $(this).closest('.card').index();

            if (listIndex !== -1){
              (_userdata.list[listIndex].cards).splice(cardIndex,1);
              _utils.saveAndRenderContext();
            }

    });

});
