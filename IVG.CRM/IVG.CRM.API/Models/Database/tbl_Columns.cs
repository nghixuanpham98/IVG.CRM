namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_Columns
    {
        public Guid ID { get; set; }

        [StringLength(250)]
        public string TableOrView { get; set; }

        [StringLength(250)]
        public string ColumnName { get; set; }

        [StringLength(500)]
        public string DisplayName { get; set; }

        public bool? IsDisplay { get; set; }

        public bool? IsKey { get; set; }
    }
}
