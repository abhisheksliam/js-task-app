
// jQuery App helpers
$( function() {

/*
   ## Note: Dependent on app.js (app.js methods must be loaded before)
 */
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
      try {
        var _push = JSON.parse(JSON.stringify(_constants.blankList));
        // _push.name = prompt("Please enter list title..", "New List");
      (_userdata.list).unshift(_push);
      } catch (er){console.log(er);}

      _utils.saveAndRenderContext();
      _utils.newListAddedView();

      // animate new list
      $contentArea.find('.list').first().effect("highlight", {}, 3000);

    });

    // Add new card
    $contentArea.on( "click", ".new-card", function() {
      try {
        var listIndex = $( this ).closest('.list').index();
        (_userdata.list[listIndex].cards)
                         .push(JSON.parse(JSON.stringify(_constants.blankCard)));
      } catch (er){console.log(er);}

      _utils.saveAndRenderContext();

      // animate new card
      $contentArea.find('.list').eq(parseInt(listIndex))
                          .find('.card').last().effect("highlight", {}, 3000);
    });

    // Delete a list
    $contentArea.on( "click", ".delete-list", function() {
      try {
        var listIndex = $(this).closest('.list').index();
        (_userdata.list).splice(listIndex,1);
      } catch (er){console.log(er);}

      _utils.saveAndRenderContext();
    });

    // Delete a card
    $contentArea.on( "click", ".delete-card", function() {
      try {
        var listIndex = $(this).closest('.list').index(),
            cardIndex = $(this).closest('.card').index();
        (_userdata.list[listIndex].cards).splice(cardIndex,1);
      } catch (er){console.log(er);}

      _utils.saveAndRenderContext();
    });

});
