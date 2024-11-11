namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_OptionSetValue
    {
        [Key]
        public long OptionSetValueId { get; set; }

        public long OptionSetId { get; set; }

        public int? Value { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DateTime? CreatedOn { get; set; }
    }
}
