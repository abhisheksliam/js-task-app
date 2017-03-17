
// jQuery App helpers
$( function() {

/* ==========================================================================
   Note: Dependent on app.js (app.js methods must be loaded before)
   Inplace Edit - Content Editable set / reset & Model data update trigger
   ========================================================================== */
    $( "#content-area" ).on( "click", ".title, .task, .description, .users, .tags", function() {
      this.contentEditable = true;
      this.focus();
      this.style.border = '1px dotted black';
      this.style.outline= 'none';
      this.style['border-color']= '#9ecaed';
      this.style['box-shadow']= '0 0 10px #9ecaed';
    });

    $( "#content-area" ).on( "blur", ".title, .task, .description, .users, .tags", function() {
      var listIndex = $(this).closest('.list').index();
      var cardIndex = $(this).closest('.card').index();
      var keyName = $( this ).attr('data-keyname').trim();
      var val = $( this ).text().trim();
      this.style.border = '';
      this.style['box-shadow']= '';
      this.contentEditable = false;

      GLOBALS.utils.updateModel(listIndex, cardIndex, keyName, val);

    });

    // todo: autocomplete for tags & user

/* ==========================================================================
   Handling Add / Delete - List, Card - Model Update Events
   ========================================================================== */

    $( ".new-list" ).on( "click", function() {
      try {
      (GLOBALS.userdata.list).unshift(JSON.parse(JSON.stringify(GLOBALS.constants.blankList)));
      } catch (er){console.log(er);}

      GLOBALS.utils.renderContext();
      GLOBALS.utils.newListAddedView();

      // animate new list
      $( "#content-area" ).find('.list').first().effect("highlight", {}, 3000);

    });
    // todo: add modal to get list title

    $( "#content-area" ).on( "click", ".new-card", function() {
      try {
        var listIndex = $( this ).closest('.list').index();
        (GLOBALS.userdata.list[listIndex].cards)
                         .push(JSON.parse(JSON.stringify(GLOBALS.constants.blankCard)));
      } catch (er){console.log(er);}

      GLOBALS.utils.renderContext();

      // animate new card
      $( "#content-area" ).find('.list').eq(parseInt(listIndex))
                          .find('.card').last().effect("highlight", {}, 3000);

    });

    $( "#content-area" ).on( "click", ".delete-list", function() {
      try {
        var listIndex = $(this).closest('.list').index();
        (GLOBALS.userdata.list).splice(listIndex,1);
      } catch (er){console.log(er);}

      GLOBALS.utils.renderContext();
    });

    $( "#content-area" ).on( "click", ".delete-card", function() {
      try {
        var listIndex = $(this).closest('.list').index();
        var cardIndex = $(this).closest('.card').index();
        (GLOBALS.userdata.list[listIndex].cards).splice(cardIndex,1);
      } catch (er){console.log(er);}

      GLOBALS.utils.renderContext();
    });

});
