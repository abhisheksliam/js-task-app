
$( function() {

  renderContext();

  if ( GLOBALS ) {
    GLOBALS.constants = {
                  blankCard : {
                    task:"Task Name",
                    description: "Task Description",
                    tags: [" "],
                    users: [" "],
                    completed: false
                  },
                  blankList = {
                    _id: "",
                    name: "List Title",
                    modified: "",
                    cards: []
                  }
              };
    // todo: to be updated after prompting user to prefil data while adding new

    GLOBALS.utils = {};
    GLOBALS.utils.renderContext = renderContext;
    GLOBALS.utils.applyJQuerySortable = applyJQuerySortable;
    GLOBALS.utils.updateModel = updateModel;

    GLOBALS.service = {};
    GLOBALS.service.saveUserData = saveUserData;
    GLOBALS.service.getUserData = getUserData;
  } else {
    console.log('Error in init globals.');
  }

  /* ==========================================================================
     Finction Definitions
     ========================================================================== */

  // Handlebars template handling
  function renderContext(){
    try {
      var theTemplateScript = $("#list-card-template").html();
      var theTemplate = Handlebars.compile(theTemplateScript);
      var theCompiledHtml = theTemplate(GLOBALS.userdata);
      $('#content-area').html(theCompiledHtml);
    } catch (er) {console.log('Error in handlebars templating. ', er);}

    saveUserData();
    applyJQuerySortable();
  };

  // JQuery Ui Drag Drop, required for dynamically created elements
  function applyJQuerySortable(){
    $( "#content-area .sortable-cards" ).sortable({
      connectWith: ".sortable-cards",
      handle: ".drag-handler",
      cancel: ".toggle",
      placeholder: "placeholder"
    });
    // todo: sortable support for touch events

    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" );
  };

  function updateModel(listIndex, cardIndex, keyName, val){
    try {
      if (keyName === "title")
      {GLOBALS.userdata.list[listIndex][keyName] = val;}
      else {
        if (keyName === "users" || keyName === "tags") {val = val.split(',')};
        GLOBALS.userdata.list[listIndex].cards[cardIndex][keyName] = val;
      }
      saveUserData();
    } catch (er) {console.log('Error in updating data model. ', er);}
  };

  function saveUserData(_GLOBALS) {
    try{
      if( ! _GLOBALS ) {
        if ( GLOBALS ) { _GLOBALS = GLOBALS }
        else { _GLOBALS = {}; }
      }
      localStorage.setItem('userdata', JSON.stringify(_GLOBALS.userdata));
    } catch (er) {console.log(er);
    alert('Error in saving userdata. Local storage might not be supported on client');}
  };

  function getUserData(){
   try{
     return JSON.parse(localStorage.getItem('userdata'));
   } catch (er) {console.log(er);
     alert('Error in retriving userdata. Local storage might not be supported on client');}
     return {};
   };

  }
});

/* ==========================================================================
   Initialize userdata
   ========================================================================== */

(function initUserData(){
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
  }

  // temp - setting up sample userdata for view, if no userdata is present
  if (!(GLOBALS.userdata) {
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
                  task:"Task 1",
                  description: "verify features of app",
                  tags: ['inprocess'],
                  users: ['qa'],
                  completed: false
                },
                {
                  task:"Task 2",
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
})();
