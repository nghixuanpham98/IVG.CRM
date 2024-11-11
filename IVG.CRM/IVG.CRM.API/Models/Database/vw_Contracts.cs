namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Contracts
    {
        public Guid ID { get; set; }

        public Guid? OwnerID { get; set; }

        [StringLength(50)]
        public string OwnerCode { get; set; }

        [StringLength(250)]
        public string OwnerName { get; set; }

        public Guid? AccountID { get; set; }

        [StringLength(500)]
        public string AccountName { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        public DateTime? ContractStartDate { get; set; }

        public DateTime? ContractEndDate { get; set; }

        public int? DurationInDays { get; set; }

        public int? DiscountType { get; set; }

        public int? ServiceLevel { get; set; }

        public int? Status { get; set; }

        public Guid? ContractProvinceID { get; set; }

        public Guid? ContractDistrictID { get; set; }

        public Guid? ContractWardID { get; set; }

        public string ContractAddress { get; set; }

        public Guid? BillAccountID { get; set; }

        [StringLength(500)]
        public string BillAccountName { get; set; }

        public DateTime? BillStartDate { get; set; }

        public DateTime? BillEndDate { get; set; }

        public Guid? BillProvinceID { get; set; }

        public Guid? BillDistrictID { get; set; }

        public Guid? BillWardID { get; set; }

        public string BillAddress { get; set; }

        public int? BillFrequency { get; set; }

        public DateTime? CancellationDate { get; set; }

        public decimal? TotalPrice { get; set; }

        public decimal? TotalDiscount { get; set; }

        public decimal? NetPrice { get; set; }

        public string Description { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
