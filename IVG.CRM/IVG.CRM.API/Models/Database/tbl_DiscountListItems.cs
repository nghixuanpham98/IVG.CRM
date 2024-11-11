namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_DiscountListItems
    {
        public Guid ID { get; set; }

        public Guid? DiscountListID { get; set; }

        public int? BeginQuantity { get; set; }

        public int? EndQuantity { get; set; }

        public decimal? Amount { get; set; }

        public int? Percentage { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
