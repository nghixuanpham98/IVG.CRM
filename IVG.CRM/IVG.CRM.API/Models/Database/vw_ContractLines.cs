namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_ContractLines
    {
        public Guid ID { get; set; }

        public Guid? ContractID { get; set; }

        public Guid? ProductID { get; set; }

        [StringLength(250)]
        public string ProductName { get; set; }

        public Guid? UnitGroupID { get; set; }

        public Guid? AccountID { get; set; }

        [StringLength(500)]
        public string AccountName { get; set; }

        public Guid? UnitID { get; set; }

        [StringLength(50)]
        public string SerialNumber { get; set; }

        [StringLength(50)]
        public string Title { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? Quantity { get; set; }

        public decimal? Rate { get; set; }

        public decimal? TotalPrice { get; set; }

        public decimal? Discount { get; set; }

        public int? PercentageDiscount { get; set; }

        public decimal? TotalDiscount { get; set; }

        public decimal? Net { get; set; }

        public int? TotalCases { get; set; }

        public int? Used { get; set; }

        public int? Remaining { get; set; }

        public Guid? ProvinceID { get; set; }

        public Guid? DistrictID { get; set; }

        public Guid? WardID { get; set; }

        public string Location { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
