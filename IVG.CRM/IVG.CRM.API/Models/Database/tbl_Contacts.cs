namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_Contacts
    {
        public Guid ID { get; set; }

        [StringLength(500)]
        public string FirstName { get; set; }

        [StringLength(500)]
        public string LastName { get; set; }

        [StringLength(500)]
        public string JobTitle { get; set; }

        [StringLength(100)]
        public string MainPhone { get; set; }

        [StringLength(100)]
        public string OtherPhone { get; set; }

        [StringLength(500)]
        public string Email { get; set; }

        public string Address { get; set; }

        public Guid? ProvinceID { get; set; }

        public Guid? DistrictID { get; set; }

        public Guid? WardID { get; set; }

        public Guid? OwnerID { get; set; }

        public Guid? AccountID { get; set; }

        public string Description { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
