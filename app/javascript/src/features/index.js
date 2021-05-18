$(document).ready(function(){
  if($("#features-table").length) {
    this.datatable = window.$('#features-table').DataTable({
      columns: [
          { title: "Name" },
          { title: "Blockchain" },
          { title: "Status" },
      ],
      dom: '<"top"i>frtp',
      paging: false
    });
  };
});
