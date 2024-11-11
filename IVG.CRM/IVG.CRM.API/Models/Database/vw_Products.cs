namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Products
    {
        public Guid ID { get; set; }

        public Guid? ParentID { get; set; }

        [StringLength(250)]
        public string ParentName { get; set; }

        public Guid? UnitGroupID { get; set; }

        public Guid? UnitID { get; set; }

        public Guid? PriceListID { get; set; }

        [StringLength(250)]
        public string PriceListName { get; set; }

        public Guid? SubjectID { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        public int? Type { get; set; }

        public DateTime? ValidFrom { get; set; }

        public DateTime? ValidTo { get; set; }

        public int? Status { get; set; }

        public int? DecimalsSupported { get; set; }

        public string Description { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
