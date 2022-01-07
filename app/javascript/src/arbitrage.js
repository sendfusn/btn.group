$(document).ready(function(){
  if($("#arbitrage").length) {
    window.onload = async () => {
      // datatable
      this.datatable = window.$('#arbitrage-table').DataTable({
        columns: [
            { data: 'id', title: "ID" },
            { data: 'from.symbol', title: "Symbol" },
            { data: 'arbitrage_amount_formatted', title: "Amount" },
            { data: 'arbitrage_profit', title: "Profit ($)" },
            { data: 'updated_at', title: "Updated at" },
        ],
        dom: '<"top"i>frtp',
        ordering: false,
        paging: false,
        rowId: function(a) {
          return 'position_' + a['position'];
        },
      });

      this.getAndSetswapPaths = async() => {
        let result = await $.ajax({
          url: '/swap_paths?arbitrage=true',
          type: 'GET'
        })
        this.datatable.clear()
        this.datatable.rows.add(result);
        this.datatable.draw();
      }

      setInterval(function () {
        this.getAndSetswapPaths()
      }.bind(this), 30_000);
      this.getAndSetswapPaths()
    }
  }
})
