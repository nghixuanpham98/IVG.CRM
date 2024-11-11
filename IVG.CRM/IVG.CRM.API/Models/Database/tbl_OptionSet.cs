namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_OptionSet
    {
        [Key]
        public long OptionSetId { get; set; }

        [Required]
        [StringLength(250)]
        public string Name { get; set; }

        public string Description { get; set; }

        [StringLength(500)]
        public string TableDependencies { get; set; }

        public DateTime? CreatedOn { get; set; }
    }
}
