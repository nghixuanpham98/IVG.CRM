namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class vw_Contacts
    {
        [Key]
        [Column(Order = 0)]
        public Guid ContactID { get; set; }

        [StringLength(500)]
        public string FirstName { get; set; }

        [StringLength(500)]
        public string LastName { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(1001)]
        public string FullName { get; set; }

        [StringLength(500)]
        public string JobTitle { get; set; }

        [StringLength(100)]
        public string MainPhone { get; set; }

        [StringLength(100)]
        public string OtherPhone { get; set; }

        [StringLength(500)]
        public string Email { get; set; }

        [Key]
        [Column(Order = 2)]
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
        [Column(Order = 3)]
        [StringLength(501)]
        public string OwnerName { get; set; }

        public Guid? AccountID { get; set; }

        [StringLength(500)]
        public string AccountName { get; set; }

        public string Description { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
