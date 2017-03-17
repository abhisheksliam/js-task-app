
// jQuery helpers
$( function() {

// Content Editable
    $( "#content-area" ).on( "click", ".title, .task, .description, .users, .tags", function() {
      console.log( $( this ).text() );
      this.contentEditable = true;
      this.focus();
      this.style.border = '1px dotted black';
      this.style.outline= 'none';
      this.style['border-color']= '#9ecaed';
      this.style['box-shadow']= '0 0 10px #9ecaed';
      // todo: while in focus - update model,lsm every n sec interval
    });

    $( "#content-area" ).on( "blur", ".title, .task, .description, .users, .tags", function() {
      console.log( $( this ).text() );
      var listIndex = $(this).closest('.list').index();
      var cardIndex = $(this).closest('.card').index();
      var keyName = $( this ).attr('data-keyname').trim();
      var val = $( this ).text().trim();
      this.style.border = '';
      this.style['box-shadow']= '';
      this.contentEditable = false;

      GLOBALS.updateModel(listIndex, cardIndex, keyName, val);

    });
    // todo: autocomplete for tags & user

/* ==========================================================================
   Handling User Events
   ========================================================================== */

    $( ".new-list" ).on( "click", function() {
      console.log( $( this ) );
      try {
      (GLOBALS.userdata.list).unshift(JSON.parse(JSON.stringify(GLOBALS.blankList)));
      } catch (er){console.log(er);}

      GLOBALS.renderContext();
    });


    $( "#content-area" ).on( "click", ".new-card", function() {
      console.log( $( this ) );
      try {
        var listIndex = $( this ).closest('.list').index();
        (GLOBALS.userdata.list[listIndex].cards)
                                .push(JSON.parse(JSON.stringify(GLOBALS.blankCard)));
      } catch (er){console.log(er);}

      GLOBALS.renderContext();
    });


    $( ".delete-list" ).on( "click", function() {
      console.log( $( this ) );
      try {
        var listIndex = $(this).closest('.list').index();
        (GLOBALS.userdata.list).splice(listIndex,1);
      } catch (er){console.log(er);}

      GLOBALS.renderContext();
    });

    $( "#content-area" ).on( "click", ".delete-card", function() {
      console.log( $( this ) );
      try {
        var listIndex = $(this).closest('.list').index();
        var cardIndex = $(this).closest('.card').index();
        (GLOBALS.userdata.list[listIndex].cards).splice(cardIndex,1);
      } catch (er){console.log(er);}

      GLOBALS.renderContext();
    });



});
