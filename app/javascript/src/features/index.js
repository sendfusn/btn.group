$(document).ready(function(){
  if($("#features-table").length) {
    this.datatable = window.$('#features-table').DataTable({
      columns: [
          { title: "Name" },
          { title: "Blockchain / Platform" },
          { title: "Status" },
      ],
      dom: '<"top"i>frtp',
      ordering: false,
      paging: false
    });
  };
});
