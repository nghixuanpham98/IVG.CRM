namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_ProductBundles
    {
        public Guid ID { get; set; }

        public Guid? BundleID { get; set; }

        [StringLength(50)]
        public string BundleCode { get; set; }

        [StringLength(250)]
        public string BundleName { get; set; }

        public Guid? ProductID { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [StringLength(250)]
        public string ProductName { get; set; }

        public Guid? UnitID { get; set; }

        [StringLength(250)]
        public string UnitName { get; set; }

        public int? Quantity { get; set; }

        public int? Required { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
