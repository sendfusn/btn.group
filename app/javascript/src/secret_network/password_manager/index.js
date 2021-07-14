$(document).ready(function(){
  if($("#secret-network-password-manager").length) {
    this.datatable = window.$('#passwords-table').DataTable({
      columns: [
          { title: "Description" },
          { title: "Username" },
          { title: "Password" },
          { title: "" },
      ],
      dom: '<"top">frtp',
      ordering: false,
      paging: false
    });
    this.returned_credentials = [{'description': 'Cloudflare', 'username': 'username@gmail.com', 'password_first_character': 'S', 'password_length': 7}];
    let credentials = [];
    _.each(this.returned_credentials, function(value){
      let row = [];
      // data
      row.push(value['description']);
      row.push(value['username']);
      row.push(value['password_first_character'] + ('*').repeat(value['password_length']));
      credentials.push(row)
    })
    this.datatable.rows.add(credentials);
    this.datatable.draw();
  };
});
