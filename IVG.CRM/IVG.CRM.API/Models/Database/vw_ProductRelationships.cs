namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_ProductRelationships
    {
        public Guid ID { get; set; }

        public Guid? ProductID { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [StringLength(250)]
        public string ProductName { get; set; }

        public Guid? RelatedID { get; set; }

        [StringLength(50)]
        public string RelatedCode { get; set; }

        [StringLength(250)]
        public string RelatedName { get; set; }

        public int? Type { get; set; }

        public int? Direction { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
