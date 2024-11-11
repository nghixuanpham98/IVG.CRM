namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_ProductBundles
    {
        public Guid ID { get; set; }

        public Guid? BundleID { get; set; }

        public Guid? ProductID { get; set; }

        public Guid? UnitID { get; set; }

        public int? Quantity { get; set; }

        public int? Required { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
