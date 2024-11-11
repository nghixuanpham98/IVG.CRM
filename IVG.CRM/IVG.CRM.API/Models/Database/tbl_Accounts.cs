namespace IVG.CRM.API.Models.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class tbl_Accounts
    {
        public Guid ID { get; set; }

        [StringLength(500)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Website { get; set; }

        [StringLength(500)]
        public string Email { get; set; }

        [StringLength(100)]
        public string MainPhone { get; set; }

        [StringLength(100)]
        public string OtherPhone { get; set; }

        public string Address { get; set; }

        public Guid? ProvinceID { get; set; }

        public Guid? DistrictID { get; set; }

        public Guid? WardID { get; set; }

        public Guid? OwnerID { get; set; }

        public string Description { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Guid? ModifiedBy { get; set; }
    }
}
