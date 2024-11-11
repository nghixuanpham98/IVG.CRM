namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Units
    {
        public Guid ID { get; set; }

        public Guid? ParentID { get; set; }

        public Guid? BaseID { get; set; }

        [StringLength(250)]
        public string BaseName { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        public int? Quantity { get; set; }

        public int? Status { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
