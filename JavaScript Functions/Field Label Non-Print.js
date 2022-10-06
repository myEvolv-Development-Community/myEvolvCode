//On Load Script for field
// This will put the verbage in field instructions into a non-printing label for that field caption

var a = this.getAttribute('dirty_form_line_id');
    a = (a === null) ? this.parentNode.previousSibling.getAttribute('caption_form_line_id') : a;
    a = (a === null) ? this.getAttribute('form_line_id') : a;
$('#caption_' + a).after('<br><span id="ins_'+a+'" style="font-size:13px; color: #555;"><i>'+$('#caption_' + a).attr('title')+'</i></span>');
