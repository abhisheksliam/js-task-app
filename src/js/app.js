
if (typeof GLOBALS === "undefined") {
  var _lsm;
  try{
    _lsm = JSON.parse(localStorage.getItem('GLOBALS'));
    if(_lsm) {
      GLOBALS = _lsm
    } else {
      GLOBALS = {};
    }
  } catch(er){
    console.log(er); GLOBALS = {};
    alert('localStorage is not supported on client.');
  }
}


// temp - setting up sample userdata, if no userdata is present
if (!GLOBALS.userdata) {
  GLOBALS.userdata = {
    meta: {
      title: "task management app"
    },
    list: [
        {
          _id: "",
          name: "List 1",
          modified: "",
          cards: [
              {
                task:"Sample7",
                description: "7 desc",
                tags: [],
                users: [],
                completed: false
              },
              {
                task:"Sample 5",
                description: "5 desc..",
                tags: [],
                users: [],
                completed: false
              }
            ]
        },
        {
          _id: "",
          name: "List 2",
          modified: "",
          cards: [
              {
                task:"Sample 3",
                description: "3 desc..",
                tags: ["tag4"],
                users: [],
                completed: false
              },
              {
                task:"Sample 4",
                description: "4 desc..",
                tags: ["tag1","tag2"],
                users: ["user1","user3"],
                completed: false
              }
            ]
        }
    ]
  };
}



$( function() {

  renderContext();
  // Handlebars template handling
  function renderContext(){
    try {
      var theTemplateScript = $("#list-card-template").html();
      var theTemplate = Handlebars.compile(theTemplateScript);
      var theCompiledHtml = theTemplate(GLOBALS.userdata);
      $('#content-area').html(theCompiledHtml);
    } catch (er) {console.log('Error in handlebars templating. ', er);}

    setLSM();
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
      setLSM();
    } catch (er) {console.log('Error in updating data model. ', er);}
  }

  function setLSM() {
    try{
      localStorage.setItem('GLOBALS', JSON.stringify(GLOBALS));
    } catch (er) {console.log(er);}
  }

  function getLSM(){
   try{
     return JSON.parse(localStorage.getItem('GLOBALS'));
   } catch (er) {console.log(er); return {};}
  }

  GLOBALS.blankList = {
    _id: "",
    name: "List Title",
    modified: "",
    cards: []
  }

  GLOBALS.blankCard = {
    task:"Task Name",
    description: "Task Description",
    tags: [" "],
    users: [" "],
    completed: false
  }

  GLOBALS.renderContext = renderContext;
  GLOBALS.applyJQuerySortable = applyJQuerySortable;
  GLOBALS.updateModel = updateModel;

})
