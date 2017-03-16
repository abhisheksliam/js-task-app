// Place any jQuery/helper in here.

// todo: sortable support for touch events
$( function() {
  $( "#content-area .sortable-cards" ).sortable({
    connectWith: ".sortable-cards",
    handle: ".drag-handler",
    cancel: ".toggle",
    placeholder: "placeholder"
  });

  $( ".portlet" )
    .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" );

    $( "#content-area" ).on( "click", ".title, .header, .content, .user, .tags", function() {
      console.log( $( this ).text() );
      this.contentEditable = true;
      this.focus();
      this.style.border = '1px dotted black';
      this.style.outline= 'none';
      this.style['border-color']= '#9ecaed';
      this.style['box-shadow']= '0 0 10px #9ecaed';
      // todo: while in focus - update model every n sec interval
    });

    $( "#content-area" ).on( "blur", ".title, .header, .content, .user, .tags", function() {
      console.log( $( this ).text() );
      this.style.border = '';
      this.style['box-shadow']= '';
      this.contentEditable = false;
      // todo: update model
    });

});
