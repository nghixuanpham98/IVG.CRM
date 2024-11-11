namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Accounts
    {
        [Key]
        [Column(Order = 0)]
        public Guid AccountID { get; set; }

        [StringLength(500)]
        public string AccountName { get; set; }

        [StringLength(500)]
        public string Website { get; set; }

        [StringLength(500)]
        public string Email { get; set; }

        [StringLength(100)]
        public string MainPhone { get; set; }

        [StringLength(100)]
        public string OtherPhone { get; set; }

        [Key]
        [Column(Order = 1)]
        public string FullAddress { get; set; }

        public string Address { get; set; }

        public Guid? ProvinceID { get; set; }

        [StringLength(255)]
        public string ProvinceName { get; set; }

        public Guid? DistrictID { get; set; }

        [StringLength(255)]
        public string DistrictName { get; set; }

        public Guid? WardID { get; set; }

        [StringLength(255)]
        public string WardName { get; set; }

        public Guid? OwnerID { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(501)]
        public string OwnerName { get; set; }

        public string Description { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(501)]
        public string CreatedByName { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(501)]
        public string ModifiedByName { get; set; }

        public Guid? ContactID { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(1001)]
        public string ContactName { get; set; }

        [StringLength(100)]
        public string ContactMainPhone { get; set; }

        [StringLength(100)]
        public string ContactOtherPhone { get; set; }

        [StringLength(500)]
        public string ContactEmail { get; set; }
    }
}
