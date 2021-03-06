
$(document).ready(function() {
   $(".save_pc_udf").click(function(){
     upload_project_summary_udfs(this.id.replace("save_", "")); 
   });
   $(".save_sp_udf").click(function(){
     upload_sample_udfs(this.id.replace("save_sample_", ""), this.getAttribute('sample_list')); 
   });
});

function upload_sample_udfs(process_id, sample_list){
    final_obj={};
    sl=sample_list.split(",");
    $("#update_status_value").html('Updating Samples, please wait... <br />');
    for (s_id in sl){
        $('.'+process_id+'_sample_name').each(function(idx, el){
            udf_key=el.innerHTML.replace(/ /g, "_").replace(/\(/, '\\\(').replace(/\)/, '\\\)');
            $('.'+process_id+'_sample_'+sl[s_id]+'_values_'+udf_key).each(function(idx2, el2){
               final_obj[el.innerHTML]=el2.value; 
            }); 
        }); 
        clean_object(final_obj)
        update_lims_entity('Sample', sl[s_id], final_obj)
        
    }
}

function upload_project_summary_udfs(process_id){
    final_obj={};
    $("#update_status_value").html('Updating Process, please wait... <br />');
    $('.step_'+process_id+'_name').each(function(idx, el){
        udf_key=el.innerHTML.replace(/ /g, "_");
        $('.step_'+process_id+'_value_'+udf_key).each(function(idx2, el2){
           final_obj[el.innerHTML]=el2.value; 
        }); 
    }); 
    clean_object(final_obj)
    update_lims_entity('Process', process_id, final_obj)
}


function update_lims_entity(type, id, obj){
    $.ajax({
      type: 'POST',
      url: "/api/v1/project_summary_update/"+type+"/"+id,
      dataType: 'json',
      data: obj,
      error: function(xhr, textStatus, errorThrown) {
        //alert('Error: '+xhr['responseText']+' ('+errorThrown+')');
        $("#update_status_value").append('<span class="glyphicon glyphicon-remove-circle glyphicon-move" aria-hidden="true"></span> Update of '+id+' failed : '+xhr['responseText']+' ('+errorThrown+') <br />');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);
        return [false, xhr, errorThrown]
      },
      success: function(data, textStatus, xhr) {
        $("#update_status_value").append('<span class="glyphicon glyphicon-ok-circle glyphicon-move" aria-hidden="true"></span> Update of '+id+' was successful<br />')  
      }
  });
}
function clean_object(obj){
    for (var prop in obj){
        if (obj[prop] == "" || obj[prop] == "-"){
            delete obj[prop];
        }
    }
    return obj

}Samples
